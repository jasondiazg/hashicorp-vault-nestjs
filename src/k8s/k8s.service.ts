import { Injectable, Logger } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class K8sService {
  private kubeConfig: k8s.KubeConfig;
  private k8sApi: k8s.CoreV1Api;
  private k8sAppsV1Api: k8s.AppsV1Api;
  private podName: string;
  private deploymentName: string;
  private namespace: string;
  private delay: number;
  private readonly logger = new Logger(K8sService.name);

  constructor(private readonly configService: ConfigService) {}

  configureClient() {
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.k8sApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsV1Api = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    this.podName = this.configService.get('K8S_POD_NAME') as string;
    this.deploymentName = this.configService.get('K8S_DEPLOYMENT_NAME') as string;
    this.namespace = this.configService.get('K8S_NAMESPACE') as string;
    this.delay = this.configService.get('K8S_RESTART_DELAY_MS') as number;
  }

  restartPod() {
    this.k8sAppsV1Api
      .readNamespacedDeployment(this.deploymentName, this.namespace)
      .then(({ body }) => {
        const replicas = body.status?.replicas as number;
        if (replicas === 1) {
          this.logger.log(`There is only one replica deployed...`);
          this.restart();
        } else {
          const availableReplicas = body.status?.availableReplicas as number;
          if (availableReplicas === 1) {
            this.logger.log(`There is only one replica running, but there should be ${replicas} replicas, making a delay of ${this.delay / 1000} seconds...`);
            setTimeout(() => this.restartPod(), this.delay);
          } else {
            this.logger.log(`There are ${availableReplicas} of ${replicas} replicas running...`);
            this.restart();
          }
        }
      })
      .catch((err: any) => {
        this.logger.error(`An error ocurred when trying to list the deployment of ${this.podName} pod`);
        this.logger.error(err);
      });
  }

  restart() {
    this.logger.log(`Deleting the Kubernetes Pod ${this.podName} in ${this.namespace} namespace.`);
    this.k8sApi
      .deleteNamespacedPod(this.podName, this.namespace)
      .then(({ body }) => {
        this.logger.log(`Pod ${this.podName} deleted successfully...`);
        this.logger.log(`${body.kind} ${JSON.stringify(body.status)}`);
      })
      .catch((err: any) => {
        this.logger.error(`An error ocurred when trying to delete ${this.podName}`);
        this.logger.error(err);
      });
  }
}
