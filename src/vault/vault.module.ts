import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { K8sModule } from 'src/k8s/k8s.module';
import { VaultService } from './vault.service';

@Module({
  providers: [VaultService],
  imports: [K8sModule, ConfigModule],
  exports: [VaultService],
})
export class VaultModule {}
