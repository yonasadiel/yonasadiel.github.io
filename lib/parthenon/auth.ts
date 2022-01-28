import crypto from 'crypto';
import { ServerData } from './types';

export const getAccessToken = (ServerData: ServerData, cb: (accessToken: string) => void) => {
  const now = Math.floor(new Date().getTime() / 1000)
  const claim = {
    "iss": ServerData.email,
    "scope": "https://www.googleapis.com/auth/compute",
    "aud": "https://oauth2.googleapis.com/token",
    "exp": now + 120,
    "iat": now,
  }
  const jwtHeader = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString('base64')
  const jwtClaim = Buffer.from(JSON.stringify(claim)).toString('base64')
  const jwtUnsigned = [jwtHeader, jwtClaim].join(".")
  const jwtSign = crypto.createSign("RSA-SHA256").update(jwtUnsigned).sign(ServerData.privateKey, 'base64')
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
