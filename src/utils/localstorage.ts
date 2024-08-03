// localStorage.ts
interface StorageAPI {
  getItem<T>(key: string): T | null
  setItem(key: string, value: any): void
  removeItem(key: string): void
  clear(): void
}

const safeJSONParser = (json: string): any => {
  try {
    return JSON.parse(json)
  } catch (err) {
    return json
  }
}

const storageAPI: StorageAPI = {
  getItem: <T>(key: string): T | null => {
    const item = window.localStorage.getItem(key)
    return item ? safeJSONParser(item) : null
  },
  setItem: (key: string, value: any): void => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string): void => {
    window.localStorage.removeItem(key)
  },
  clear: (): void => {
    window.localStorage.clear()
  }
}

export default storageAPI
