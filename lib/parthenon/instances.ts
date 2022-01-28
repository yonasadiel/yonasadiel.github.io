import { ServerData } from './types';

export const RUNNING = "RUNNING"
export const TERMINATED = "TERMINATED"

export const getInstance = (ServerData: ServerData, token: string, cb: (status : string) => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${ServerData.project}/zones/${ServerData.zone}/instances/${ServerData.resourceId}`
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        const resp = JSON.parse(xhr.responseText)
        cb(resp.status)
      }
    }
  }
  xhr.send()
}

export const startInstance = (ServerData: ServerData, token: string, updateInstanceStatus: () => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${ServerData.project}/zones/${ServerData.zone}/instances/${ServerData.resourceId}/start`
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        setTimeout(updateInstanceStatus, 1000)
      }
    }
  }
  xhr.send()
}

export const stopInstance = (ServerData: ServerData, token: string, updateInstanceStatus: () => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${ServerData.project}/zones/${ServerData.zone}/instances/${ServerData.resourceId}/stop`
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        setTimeout(updateInstanceStatus, 1000)
      }
    }
  }
  xhr.send()
}