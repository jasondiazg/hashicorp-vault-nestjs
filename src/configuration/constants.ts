export enum Environments {
  PROD = 'production',
  DEV = 'development',
}

export const MongoDB = {
  authSource: 'test',
  protocol: 'mongodb',
  nodeList: 'mongodb.default.svc.cluster.local:27017',
  requestedParams: 'retryWrites=true&w=majority',
  db: 'test',
};
