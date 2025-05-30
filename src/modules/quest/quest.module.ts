import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { QuestSchema } from './entities/quest.entity';
import { UpdateSchema } from './entities/update.entity';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { UserSchema } from '../auth/entities/user.entity';

@Module({
  controllers: [QuestController],
  providers: [QuestService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Quest', schema: QuestSchema },
      { name: 'Update', schema: UpdateSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
})
export class QuestModule {}
