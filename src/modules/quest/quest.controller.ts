import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { UserResponse } from '../auth/interfaces/userResponse.interface';
import { CreateQuestDto } from './dto/create-quest.dto';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UpgradeUpdateDto } from './dto/upgrade-update.dto';
import { QuestService } from './quest.service';

@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  findQuests(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: 'pending' | 'completed',
  ) {
    return this.questService.findQuests(page, limit, status);
  }

  @UseGuards(AuthGuard)
  @Get('/own-quests')
  findUserQuests(@Request() req: Request) {
    return this.questService.findUserQuests((req['user'] as UserResponse).id!);
  }

  @UseGuards(AuthGuard)
  @Get('/own-quests-updates')
  findUpdatedQuestsByUser(@Request() req: Request) {
    return this.questService.findUpdatedQuestsByUser(
      (req['user'] as UserResponse).id!,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  createQuest(@Body() createQuestDto: CreateQuestDto, @Request() req: Request) {
    return this.questService.createQuest(
      createQuestDto,
      (req['user'] as UserResponse).id!,
    );
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateQuest(@Body() updateQuestDto: UpdateQuestDto, @Request() req: Request) {
    return this.questService.updateQuest(
      updateQuestDto,
      (req['user'] as UserResponse).id!,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  createUpdate(@Body() createUpdate: CreateUpdateDto, @Request() req: Request) {
    return this.questService.createUpdate(
      createUpdate,
      (req['user'] as UserResponse).id!,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/update')
  upgradeUpdate(
    @Body() upgradeUpdateDto: UpgradeUpdateDto,
    @Request() req: Request,
  ) {
    return this.questService.upgradeUpdate(
      upgradeUpdateDto,
      (req['user'] as UserResponse).id!,
    );
  }

  @Get('/:id')
  findQuestsById(@Param('id') id: string) {
    return this.questService.findQuestById(id);
  }
}
