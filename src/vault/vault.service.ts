import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { K8sService } from '../k8s/k8s.service';
import * as fs from 'fs';
import watch from 'node-watch';
import { Environments } from 'src/configuration/constants';

@Injectable()
export class VaultService {
  public watcher: any;
  private dynamicVaultFile: string;
  private staticVaultFile: string;
  private readonly logger = new Logger(VaultService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly k8sService: K8sService,
  ) {
    this.dynamicVaultFile = this.configService.get('MONGO_CREDS_DYNAMIC_FILENAME') as string;
    this.staticVaultFile = this.configService.get('MONGO_CREDS_STATIC_FILENAME') as string;
  }

  watchCredentials() {
    if (this.configService.get('NODE_ENV') === Environments.PROD) {
      this.logger.log(`Watching the ${this.dynamicVaultFile} file`);
      this.watcher = watch(
        this.dynamicVaultFile,
        (eventType?: EventType, filePath?: string) => {
          this.logger.log(`The file ${this.dynamicVaultFile} has changed...`);
          this.logger.log(`Watch event in file ${filePath}, event type ${eventType}`);
          this.k8sService.configureClient();
          this.k8sService.restartPod();
        },
      );
    }
  }

  getMongoCredentials(staticCreds = false): MongoDBCreds {
    if (this.configService.get('NODE_ENV') === Environments.PROD && !staticCreds) {
      this.logger.debug(`Reading MongoDB Credentials from ${this.dynamicVaultFile}...`);
      const file = fs.readFileSync(this.dynamicVaultFile, 'utf-8');
      return JSON.parse(file) as MongoDBCreds;
    } else if (this.configService.get('NODE_ENV') === Environments.PROD) {
      this.logger.debug(`Reading MongoDB Credentials from ${this.staticVaultFile}...`);
      const file = fs.readFileSync(this.staticVaultFile, 'utf-8');
      return JSON.parse(file) as MongoDBCreds;
    }
    return {
      username: this.configService.get('MONGO_USER') as string,
      password: this.configService.get('MONGO_PASSWORD') as string,
    };
  }
}

type EventType = 'update' | 'remove';

interface MongoDBCreds {
  username: string;
  password: string;
}
