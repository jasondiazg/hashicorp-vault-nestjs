# Hashicorp Vault with NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A functional implementation example of Hashicorp Vault and MongoDB to handle dynamic secrets on Kubernetes.</p>
    <p align="center">
    
## Description

This application is a functional example of Hashicorp Vault integration with NestJS in Kubernetes with MongoDB to handle static and dynamic secrets.

## Installation

```bash
$ npm install
```

## Node version

Note that the [package.json](./package.json) file will force you to have a specific version of `npm` and `node` or higher.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Infrastructure

### Kubernetes sandbox

For Kubernetes deployment you need to install a local sandbox Kubernetes environment like `minikube` and `kind` or even use the Kubernetes functionality that now is included in the Docker installation.

You can find very good  guides to put your local Kubernetes environment up and running here:

- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Kubernetes with Docker Desktop](https://birthday.play-with-docker.com/kubernetes-docker-desktop/)

### MongoDB

**Installation**

To get an standalone MongoDB server in your Kubernetes environment you just need to execute:

```bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo update
$ helm install mongodb bitnami/mongodb
```

For more information about the Helm chart and also the prerequisites, and also other kind of information, please visit the official [Bitnami Helm Chart github page](https://github.com/bitnami/charts/tree/master/bitnami/mongodb).

**User static configuration**

Now in order to test static credentils, let's to create a user/password in mongodb:

```bash
$ kubectl run --namespace default mongodb-client --rm --tty -i --image docker.io/bitnami/mongodb:4.4.12-debian-10-r12 --command -- bash

use test
db.createUser(
  {
    user: "vaultuser",
    pwd:  "vaultpass!",
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "test2" } ]
  }
)
```

Notice that this user only has `readWrite` permissions in `test` db and `read` permissions in `test2`.

### Vault

**Installation**

To get an standalone Hashicorp Vault server in your Kubernetes environemnt you just need to execute:

```bash
$ helm repo add hashicorp https://helm.releases.hashicorp.com
$ helm repo update
$ helm install vault hashicorp/vault --set "server.dev.enabled=true"
```

Notice that we are installing a development instance only for dev purposes, for production environment please follow the [best practices](https://learn.hashicorp.com/tutorials/vault/ha-with-consul?in=vault/operations) about security, High Availability and so on.

For more information about the Helm chart and also the prerequisites, and also other kind of information, please visit the official [Hashicorp Vault Helm Chart github page](https://github.com/hashicorp/vault-helm).

**Configuration for MongoDB Dynamic Screts**

Now you need to configure your Vault server to be able to connect to MongoDB and generate secrets dynamically.

Basically you need to enable de database secrets, then configure the mongodb connection and finally configure a vault role for mongodb.

```bash
$ kubectl exec -it vault-0 -- /bin/sh

$ vault secrets enable database

$ vault write database/config/mongodb \
    plugin_name=mongodb-database-plugin \
    allowed_roles="mongodb-role" \
    connection_url="mongodb://mongodb.default.svc.cluster.local:27017/admin" \
    username="vaultuser" \
    password="vaultpass!"

$ vault write database/roles/mongodb-role \
    db_name=mongodb \
    creation_statements='{ "db": "test", "roles": [{ "role": "readWrite" }, {"role": "read", "db": "test2"}, {"role": "read", "db": "test3"}] }' \
    default_ttl="5m" \
    max_ttl="5m"

```

In order to test your installation you can run:

`$ vault read database/creds/mongodb-role`

You can find full information about this in the [MongoDB Database Secrets Engine](https://www.vaultproject.io/docs/secrets/databases/mongodb) documentation.

**Configuration for MongodB Static Screts**

To have static secrets in Vault the process is easier, so in order to configure them, we need to enable the kv engine and then configure the secrets... basically that's all.

```bash
$ vault secrets enable -path=internal kv-v2
$ vault kv put internal/database/config username="vaultuser" password="vaultpass!"
```

In order to test your installation you can run:

`$ vault kv get internal/database/config`

**Configuration for Kubernetes authentication**

Now we need to provide access to Vault Agent for listening to the Kubernetes API in order to mutate pods and inject the Vault agent sidecar who will be responsible for getting secrets and render them, and also to to renew them.

First we need to access to the `vault-0` pod and enable the kubernetes auth:

```bash
$ kubectl exec -it vault-0 -- /bin/sh
$ vault auth enable kubernetes
```

Now we need to configure the kubernetes access for the vault server: 

```bash
$ vault write auth/kubernetes/config \
    kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" \
    token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \
    kubernetes_ca_cert="$(cat /var/run/secrets/kubernetes.io/serviceaccount/ca.crt)" \
    issuer="https://kubernetes.default.svc.cluster.local"

```

Notice that the `$KUBERNETES_PORT_443_TCP_ADDR` is automatically defined and it references the internal network address of the Kubernetes host.

Now we need to write the vault policies for MongoDB dynamic and static secrets:

```bash
$ vault policy write hashicorp-vault-nestjs - <<EOF
path "database/creds/mongodb-role" {
  capabilities = ["read"]
}
path "internal/data/database/config" {
  capabilities = ["read"]
}
EOF

$ vault write auth/kubernetes/role/hashicorp-vault-nestjs \
    bound_service_account_names=hashicorp-vault-nestjs \
    bound_service_account_namespaces=default \
    policies=hashicorp-vault-nestjs \
    ttl=24h

```

## Deployment

Now all the necessary infrastructure components are ready to be used, so in order to deploy the application we have a [helm chart](./chart/hashicorp-vault-nestjs/README.md) that contains the following Kubernetes objects:

- Deployment
- Service
- Service Account
- Role
- Role Binding
- Pod Disruption Budget

All of them are necessary to have a real deployment example for production. The chart contains all the necessary documentation to understand what configurations are available to customize the service.

### Installation

You can install the chart from this repo running the following commands:

```bash
$ cd chart
$ helm install <my-release> hashicorp-vault-nestjs
```
