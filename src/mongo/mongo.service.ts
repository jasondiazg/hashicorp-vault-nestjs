import { Injectable, Logger } from '@nestjs/common';
import { MongoDB } from 'src/configuration/constants';
import { VaultService } from '../vault/vault.service';

@Injectable()
export class MongoService {
  private readonly logger = new Logger(MongoService.name);

  constructor(private readonly vaultService: VaultService) {}

  getDynamicMongoConnection() {
    const creds = this.vaultService.getMongoCredentials();
    const { protocol, nodeList, requestedParams, authSource, db } = MongoDB;

    return `${protocol}://${creds.username}:${creds.password}@${nodeList}/${db}?${requestedParams}${authSource}`;
  }

  getStaticMongoConnection() {
    const creds = this.vaultService.getMongoCredentials(true);
    const { protocol, nodeList, requestedParams, authSource, db } = MongoDB;

    return `${protocol}://${creds.username}:${creds.password}@${nodeList}/${db}?${requestedParams}${authSource}`;
  }
}
