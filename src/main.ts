import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultService } from './vault/vault.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  const vault = app.get(VaultService);
  vault.watchCredentials();
  await app.listen(3000);
}
bootstrap();
