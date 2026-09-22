const STORAGE_KEY = 'linear.auth.token'

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

let currentToken: string | null = readStoredToken()

export function getToken(): string | null {
  return currentToken
}

export function setToken(token: string | null): void {
  currentToken = token
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // 存储不可用时 token 只保留在内存里，刷新页面后需要重新登录
  }
}
