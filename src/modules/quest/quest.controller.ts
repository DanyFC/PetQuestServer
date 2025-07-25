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
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

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

  @ApiOperation({
    summary: 'Get all quests or filtered by query parameters',
    description:
      'By default it returns 6 quests per page with the status pending and the order by the date of founding',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @Get()
  findQuests(
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('orderBy') orderBy: string,
    @Query('page') page: number,
    @Query('sort') sort: 'asc' | 'desc',
    @Query('status') status: 'pending' | 'completed',
  ) {
    return this.questService.findQuests(
      limit,
      name,
      orderBy,
      page,
      sort,
      status,
    );
  }

  @ApiOperation({ summary: 'Get published quests of a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/own-quests')
  findUserQuests(@Request() req: Request) {
    return this.questService.findUserQuests((req['user'] as UserResponse).id!);
  }

  @ApiOperation({ summary: 'Get all quests updated by a user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/own-quests-updates')
  findUpdatedQuestsByUser(@Request() req: Request) {
    return this.questService.findUpdatedQuestsByUser(
      (req['user'] as UserResponse).id!,
    );
  }

  @ApiOperation({ summary: 'Create a new quest' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  createQuest(@Body() createQuestDto: CreateQuestDto, @Request() req: Request) {
    return this.questService.createQuest(
      createQuestDto,
      (req['user'] as UserResponse).id!,
    );
  }

  @ApiOperation({ summary: 'Update a quest' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch()
  updateQuest(@Body() updateQuestDto: UpdateQuestDto, @Request() req: Request) {
    return this.questService.updateQuest(
      updateQuestDto,
      (req['user'] as UserResponse).id!,
    );
  }

  @ApiOperation({ summary: 'Create a new update' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/update')
  createUpdate(@Body() createUpdate: CreateUpdateDto, @Request() req: Request) {
    return this.questService.createUpdate(
      createUpdate,
      (req['user'] as UserResponse).id!,
    );
  }

  @ApiOperation({ summary: 'Upgrade a update' })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Get a quest by id, with all the updates and users',
  })
  @Get('/:id')
  findQuestsById(@Param('id') id: string) {
    return this.questService.findQuestById(id);
  }
}
