import crypto from 'crypto';
import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { clearInterval } from 'timers';

type ClientData = {
  privateKey: string
  email: string
  project: string
  zone: string
  resourceId: string
}

const RUNNING = "RUNNING"
const TERMINATED = "TERMINATED"

const displayStatus: {[status: string]: string} = {
  [TERMINATED]: "OFFLINE",
  [RUNNING]: "ONLINE",
}

const getAccessToken = (clientData: ClientData, cb: (accessToken: string) => void) => {
  const now = Math.floor(new Date().getTime() / 1000)
  const claim = {
    "iss": clientData.email,
    "scope": "https://www.googleapis.com/auth/compute",
    "aud": "https://oauth2.googleapis.com/token",
    "exp": now + 120,
    "iat": now,
  }
  const jwtHeader = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString('base64')
  const jwtClaim = Buffer.from(JSON.stringify(claim)).toString('base64')
  const jwtUnsigned = [jwtHeader, jwtClaim].join(".")
  const jwtSign = crypto.createSign("RSA-SHA256").update(jwtUnsigned).sign(clientData.privateKey, 'base64')
  const jwt = [jwtHeader, jwtClaim, jwtSign].join(".")

  const formData = new FormData()
  formData.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
  formData.append("assertion", jwt)

  const url = "https://oauth2.googleapis.com/token"
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        const resp = JSON.parse(xhr.responseText)
        console.log(resp.access_token)
        cb(resp.access_token)
      }
    }
  }
  xhr.send(formData)
}

const getInstance = (clientData: ClientData, token: string, cb: (status : string) => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${clientData.project}/zones/${clientData.zone}/instances/${clientData.resourceId}`
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

const startInstance = (clientData: ClientData, token: string, updateInstanceStatus: () => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${clientData.project}/zones/${clientData.zone}/instances/${clientData.resourceId}/start`
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log(xhr.responseText)
        // const resp = JSON.parse(xhr.responseText)
        // cb(resp.access_token)
        // cb(["ab"])
        updateInstanceStatus()
      }
    }
  }
  xhr.send()
}

const stopInstance = (clientData: ClientData, token: string, updateInstanceStatus: () => void) => {
  const url = `https://compute.googleapis.com/compute/v1/projects/${clientData.project}/zones/${clientData.zone}/instances/${clientData.resourceId}/stop`
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url)
  xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log(xhr.responseText)
        // const resp = JSON.parse(xhr.responseText)
        // cb(resp.access_token)
        // cb(["ab"])
        updateInstanceStatus()
      }
    }
  }
  xhr.send()
}

const Parthenon: NextPage = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [accessToken, setAccessToken] = useState<string>("")
  const [instanceStatus, setInstanceStatus] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [encodedClientData, setEncodedClientData] = useState<string>("")
  const updateInstanceStatus = useCallback(() => {
    if (accessToken === "") return
    if (clientData === null) return;
    getInstance(clientData, accessToken, (status) => {
      setInstanceStatus(status)
      setLastUpdated(new Date())
    })
  }, [accessToken, clientData, setInstanceStatus, setLastUpdated])
  const updateClientData = () => {
    setClientData(JSON.parse(Buffer.from(encodedClientData, "base64").toString()))
  }

  // auto update every 5 seconds
  useEffect(() => {
    if (clientData === null) return
    const timer = setInterval(updateInstanceStatus, 5000)
    return () => clearInterval(timer)
  }, [clientData])
  useEffect(updateInstanceStatus, [accessToken])

  if (clientData === null) {
    return <div>
      <textarea onChange={(e) => setEncodedClientData(e.target.value)}></textarea>
      <button type="button" onClick={updateClientData}>ACCESS</button>
    </div>
  }

  if (accessToken === "") {
    return (
      <div>
        <button onClick={() => getAccessToken(clientData, setAccessToken)} type="button">Run!</button>
      </div>
    )
  }

  return (
    <div>
      <div>
        {"STATUS: "}
        {!!instanceStatus
          ? displayStatus[instanceStatus] || instanceStatus
          : "Checking status..."
        } <button type="button" onClick={updateInstanceStatus}>RELOAD</button>
      </div>
      <div>Last updated: {lastUpdated.toLocaleDateString() + " " + lastUpdated.toLocaleTimeString()}</div>
      {instanceStatus === TERMINATED && (<button type="button" onClick={() => startInstance(clientData, accessToken, updateInstanceStatus)}>START</button>)}
      {instanceStatus === RUNNING && (<button type="button" onClick={() => stopInstance(clientData, accessToken, updateInstanceStatus)}>STOP</button>)}
    </div>
  )
}

export default Parthenon
