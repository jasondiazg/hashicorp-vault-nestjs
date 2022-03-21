import { Module } from '@nestjs/common';
import { K8sModule } from 'src/k8s/k8s.module';
import { VaultModule } from 'src/vault/vault.module';
import { MongoService } from './mongo.service';

@Module({
  providers: [MongoService],
  imports: [VaultModule, K8sModule],
  exports: [MongoService],
})
export class MongoModule {}
