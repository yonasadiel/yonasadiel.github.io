import { SessionData } from "./type"

const api = "https://script.google.com/macros/s/AKfycbyCfPCWL1CigwT2bhFw9DG2084x4AkaV-3FYxtflqH7ft8HHU-WOlobMwzLYpJiBZoT/exec"

export function getSessionData(sessionId: string, travelerName: string, token: string): Promise<SessionData> {
  return fetch(`${api}?action=getSession&session=${sessionId}&name=${travelerName}&token=${token}`)
    .then((res) => res.json())
}
