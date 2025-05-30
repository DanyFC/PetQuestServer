import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateQuestDto } from './dto/create-quest.dto';
import { QuestService } from './quest.service';
import { UserResponse } from '../auth/interfaces/userResponse.interface';
import { CreateUpdateDto } from './dto/create-update.dto';

@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  findAllQuests() {
    return this.questService.findAllQuests();
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
  @Post('/update')
  createUpdate(@Body() createUpdate: CreateUpdateDto, @Request() req: Request) {
    return this.questService.createUpdate(
      createUpdate,
      (req['user'] as UserResponse).id!,
    );
  }

  @Get('/:id')
  findQuestsById(@Param('id') id: string) {
    return this.questService.findQuestById(id);
  }
}
