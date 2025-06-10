import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity';
import { CreateQuestDto } from './dto/create-quest.dto';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UpgradeUpdateDto } from './dto/upgrade-update.dto';
import { Quest } from './entities/quest.entity';
import { Update } from './entities/update.entity';
import { QuestResponse } from './interfaces/quest-response.interface';
import { UpdateResponse } from './interfaces/update-response.interface';

@Injectable()
export class QuestService {
  constructor(
    @InjectModel(Quest.name) private quest: Model<Quest>,
    @InjectModel(Update.name) private update: Model<Update>,
    @InjectModel(User.name) private user: Model<User>,
  ) {}

  async findQuests(
    page: number = 0,
    limit: number = 6,
    status: 'pending' | 'completed' = 'pending',
  ): Promise<QuestResponse[]> {
    const quests = await this.quest
      .find<QuestResponse>({ foundedDate: { $exists: status === 'completed' } })
      .sort({ lostDate: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    console.log('🔥 🔜 quest.service.ts 🔜 quests:', quests);
    return quests;
  }

  async findUserQuests(userId: string): Promise<QuestResponse[]> {
    const quests = await this.user
      .findById(userId)
      .populate('published')
      .select('published');

    if (!quests) throw new BadRequestException('User not found');

    // eslint-disable-next-line
    quests?.published.sort((a: any, b: any) => b.lostDate - a.lostDate);

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

    return [...new Set(quests)] as unknown as QuestResponse[];
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

  async updateQuest(
    updateQuestDto: UpdateQuestDto,
    userId: string,
  ): Promise<QuestResponse> {
    try {
      const user = await this.user.findById(userId);
      if (!user) throw new BadRequestException('User not found');

      const quest = await this.quest.findById(updateQuestDto.id);
      if (!quest) throw new BadRequestException('Quest not found');

      if (user.id !== quest.user.toString())
        throw new BadRequestException('You are not the owner of this quest');

      const updatedQuest = await this.quest.findByIdAndUpdate<QuestResponse>(
        quest.id,
        updateQuestDto,
        { new: true },
      );

      return updatedQuest!;
    } catch {
      throw new BadRequestException();
    }
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
      quest.lastSeen = savedUpdate.date;
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

  async upgradeUpdate(
    upgradeUpdateDto: UpgradeUpdateDto,
    userId: string,
  ): Promise<UpdateResponse> {
    try {
      const user = await this.user.findById(userId);
      if (!user) throw new BadRequestException('User not found');

      const update = await this.update.findById(upgradeUpdateDto.id);
      if (!update) throw new BadRequestException('Update not found');

      if (user.id !== update.user.toString())
        throw new BadRequestException('You are not the owner of this update');

      const savedUpdate = await this.update.findByIdAndUpdate<UpdateResponse>(
        update.id,
        upgradeUpdateDto,
        { new: true },
      );

      return savedUpdate!;
    } catch {
      throw new BadRequestException();
    }
  }

  async findQuestById(id: string): Promise<QuestResponse> {
    const quest = await this.quest
      .findById(id)
      .populate({ path: 'record', populate: { path: 'user' } });

    if (!quest) throw new BadRequestException('Quest not found');

    // eslint-disable-next-line
    quest.record.sort((a: any, b: any) => b.date - a.date);

    return quest as unknown as QuestResponse;
  }
}
