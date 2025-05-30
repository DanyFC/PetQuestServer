import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateQuestDto } from './dto/create-quest.dto';
import { CreateUpdateDto } from './dto/create-update.dto';
import { Quest } from './entities/quest.entity';
import { Update } from './entities/update.entity';
import { QuestResponse } from './interfaces/quest-response.interface';
import { UpdateResponse } from './interfaces/update-response.interface';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class QuestService {
  constructor(
    @InjectModel(Quest.name) private quest: Model<Quest>,
    @InjectModel(Update.name) private update: Model<Update>,
    @InjectModel(User.name) private user: Model<User>,
  ) {}

  async findAllQuests(): Promise<QuestResponse[]> {
    return this.quest.find();
  }

  async createQuest(
    createQuestDto: CreateQuestDto,
    userId: string,
  ): Promise<QuestResponse> {
    try {
      const newQuest = new this.quest({ ...createQuestDto, user: userId });
      const savedQuest = await newQuest.save();

      const user = await this.user.findById(userId);

      if (!user) throw new BadRequestException('User not found');

      user.published.push(savedQuest.id);
      await user.save();

      return savedQuest as unknown as QuestResponse;
    } catch {
      throw new BadRequestException();
    }
  }

  async findUserQuests(userId: string): Promise<QuestResponse[]> {
    const quests = await this.user
      .findById(userId)
      .populate('published')
      .select('published');

    if (!quests) throw new BadRequestException('User not found');

    return quests.published as unknown as QuestResponse[];
  }

  async findUpdatedQuestsByUser(userId: string): Promise<QuestResponse[]> {
    const updates = await this.user
      .findById(userId)
      .populate({ path: 'commented', populate: { path: 'quest' } })
      .select('commented');

    if (!updates) throw new BadRequestException('User not found');

    // eslint-disable-next-line
    const quests = updates.commented.map((update: any) => update.quest);

    return quests as QuestResponse[];
  }

  async createUpdate(
    createUpdateDto: CreateUpdateDto,
    userId: string,
  ): Promise<UpdateResponse> {
    try {
      const newUpdate = new this.update({
        ...createUpdateDto,
        user: userId,
      });
      const savedUpdate = await newUpdate.save();
      const quest = await this.quest.findById(savedUpdate.quest);

      if (!quest) throw new BadRequestException('Quest not found');

      quest.record.push(savedUpdate.id);
      await quest.save();

      const user = await this.user.findById(userId);

      if (!user) throw new BadRequestException('User not found');

      user.commented.push(savedUpdate.id);
      await user.save();

      return savedUpdate as unknown as UpdateResponse;
    } catch {
      throw new BadRequestException();
    }
  }

  async findQuestById(id: string): Promise<QuestResponse> {
    const quest = await this.quest
      .findById(id)
      .populate({ path: 'record', populate: { path: 'user' } });

    if (!quest) throw new BadRequestException('Quest not found');

    return quest as unknown as QuestResponse;
  }
}
