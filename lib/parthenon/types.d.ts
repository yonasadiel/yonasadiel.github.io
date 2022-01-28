export type ServerData = {
  privateKey: string
  email: string
  project: string
  zone: string
  resourceId: string
}

export type InstanceStatus = {
  status: string
  ip: string
}

export type GetInstanceResponse = {
  status: string
  networkInterfaces: {
    accessConfigs: {
      natIP: string
    }[]
  }[]
}
