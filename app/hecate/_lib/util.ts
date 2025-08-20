const LOCAL_STORAGE_KEY = 'hecate-session';

export function convertSessionIdToTitle(sessionId: string) {
  return sessionId.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


export function loadLocalStorage<SessionData>(sessionId: string): Promise<SessionData> {
  return new Promise<SessionData>((resolve, reject) => {
    try {
      const storedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${sessionId}`);
      if (storedData) {
        resolve(JSON.parse(storedData) as SessionData);
      }
    } catch (error) {
      reject('Error loading from localStorage: ' + error)
    }
  })
};

export function storeLocalStorage<SessionData>(sessionId: string, sessionData: SessionData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-${sessionId}`, JSON.stringify(sessionData));
      resolve();
    } catch (error) {
      reject('Error saving to localStorage: ' + error)
    }
  })
}
