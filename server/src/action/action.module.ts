import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionGateway } from './action.gateway';
import { ActionController } from './action.controller';
import { MqttService } from '../mqtt/mqtt.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, ActionGateway, MqttService]
})
export class ActionModule {}
