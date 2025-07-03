import { SessionData } from 'app/electric-state/_lib/type';

export function storeSessionData(sessionData: SessionData) {
	localStorage.setItem('electric-state', JSON.stringify(sessionData))
}

export function loadSessionData(): SessionData {
	return JSON.parse(localStorage.getItem('electric-state') ?? '') as SessionData
}
