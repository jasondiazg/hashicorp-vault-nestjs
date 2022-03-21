# Hashicorp Vault NestJS

This chart is aimed to deploy hashicorp-vault-nestjs.

## First steps
Before installing the Chart, it is necessary to setup you environment by following the next steps:
1. Clone this repository
    ```
    git clone https://github.com/jasondiazg/hashicorp-vault-nestjs.git
    ```
2. Open the chart folder
    ```
    cd hashicorp-vault-nestjs/chart
    ```

Now, you may proceed with the installation.

## Installation

To install the chart, execute:

```
helm install hashicorp-vault-nestjs hashicorp-vault-nestjs -f values.yaml
```

or

```
helm upgrade hashicorp-vault-nestjs hashicorp-vault-nestjs --install -f values.yaml
```
In these cases, `hashicorp-vault-nestjs` is the name given to the deployment, the same of the chart. Notice that, it may be necessary to provide the [required parameters](#required-parameters) to get the deployment installed. These values may be set via file using `-f` option (as shown in the previous examples) or as parameters using `--set` option.

## Uninstalling the Chart

To uninstall the chart, execute:
```
helm uninstall hashicorp-vault-nestjs
```
In this case, `hashicorp-vault-nestjs` is the name given to the deployment.

## Parameters
The following table lists the configurable parameters of this chart:

| Parameter | Description | Default |
| --- | --- | --- |
| `container.image.registry` | Container image registry | `jasondiazg` |
| `container.image.repository` | Container image repository name | `hashicorp-vault-nestjs` |
| `container.image.tag` | Container image tag | `latest` |
| `container.image.pullPolicy` | Image pull policy | `Always` |
| `container.image.pullSecrets` | Specify docker-registry secret names as a string | `deployment-docker-registry-secret` |
| `container.resources.limits.memory` | Limit memory resources assigned to the container | `128Mi` |
| `container.resources.limits.cpu` | Limit CPU resources assigned to the container | `100m` |
| `container.resources.requests.memory` | Requested memory resources assigned to the container | `128Mi` |
| `container.resources.requests.cpu` | Requested CPU resources assigned to the container | `50m` |
| `container.additionalVariables` | Additional environment variables to be set | `NODE_ENV=production` |
| `deployment.name` | Name of the deployment | `hashicorp-vault-nestjs` |
| `deployment.replicas` | Number of replicas to deploy initially | `3` |
| `deployment.minAvailable` | Minumun number of available replicas for the pod disruption budget | `1` |
| `deployment.servicePort.number` | Port to access the service | `3000` |
| `deployment.servicePort.name` | name givent to the service port | `http` |
| `deployment.containerPort.number` | Port exposed by the container | `3000` |
| `deployment.containerPort.protocol` | Protocol of the container port | `TCP` |
| `deployment.readinessProbe.endpoint` | Endpoint to be checked by the readiness probe | `/api/health` |
| `deployment.readinessProbe.successThreshold` | Successfull threshold for the readiness probe | `1` |
| `deployment.readinessProbe.failureThreshold` | Failure threshold for the readiness probe | `120` |
| `deployment.readinessProbe.periodSeconds` | Execution period of the readiness probe in seconds | `5` |
| `deployment.livenessProbe.endpoint` | Endpoint to be checked by the liveness probe | `/api/health` |
| `deployment.livenessProbe.successThreshold` | Successfull threshold for the liveness probe | `1` |
| `deployment.livenessProbe.failureThreshold` | Failure threshold for the liveness probe | `2` |
| `deployment.livenessProbe.periodSeconds` | Execution period of the liveness probe in seconds | `30` |
| `deployment.affinity` | Affinity for pod assignment. [See documentation](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) | Anti-affinity Expression: `matchExpressions: app In values(hashicorp-vault-nestjs)` |
| `deployment.annotations` | Annotations to pass to the deployment | `{}` |
| `role.pod.apiGroups` | API Groups to apply to the App Pod Role | `[""]` |
| `role.pod.resources` | Resources to apply to the App Pod Role | `["pods"]` |
| `role.pod.verbs` | Verbs to apply to the App Pod Role | `["delete"]` |
| `role.deployment.apiGroups` | API Groups to apply to the App Deployment Role | `["extensions", "apps"]` |
| `role.deployment.resources` | Resources to apply to the App Deployment Role | `["deployments"]` |
| `role.deployment.verbs` | Verbs to apply to the App Deployment Role | `["get", "list"]` |
| `role.namespace` | The namespace to use in the Role Binding Subject | `default` |

The values file may be found [here](./values.yaml)

## Required Parameters
There are no required parameters
