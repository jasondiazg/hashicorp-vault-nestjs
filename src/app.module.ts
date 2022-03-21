import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VaultModule } from './vault/vault.module';
import { MongoModule } from './mongo/mongo.module';
import { K8sModule } from './k8s/k8s.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [VaultModule, MongoModule, K8sModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
