import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { K8sService } from './k8s.service';

@Module({
  providers: [K8sService],
  imports: [ConfigModule],
  exports: [K8sService],
})
export class K8sModule {}
