import { SessionData } from "./type"

const api = "https://script.google.com/macros/s/AKfycbz11n9wLzejuRmsciTtnyH2FNmhiX0W0v8_f0BivCm-uA2pY0jnGpEW_FDp7WLIKsn6/exec"

export function getSessionData(sessionId: string, travelerName: string, token: string): Promise<SessionData> {
  return fetch(`${api}?action=getSession&session=${sessionId}&name=${travelerName}&token=${token}`)
    .then((res) => res.json())
}
