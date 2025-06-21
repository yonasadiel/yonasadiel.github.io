import { SessionData } from "./type"

const api = "https://script.google.com/macros/s/AKfycbw0oyp5QbpRFkU3WiockTZ3bSukYBEJDx_AZR7WiAVKUB0ug_RD0OnSpYIuGB4--wHq/exec"

export function getSessionData(sessionId: string, travelerName: string, token: string): Promise<SessionData> {
  return fetch(`${api}?action=getSession&session=${sessionId}&name=${travelerName}&token=${token}`)
    .then((res) => res.json())
}
