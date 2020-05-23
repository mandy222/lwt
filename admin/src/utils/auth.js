import Cookies from 'js-cookie'

const TokenKey = 'lwt_admin_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAuthHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`
  }
}
