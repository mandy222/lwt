import request from '@/utils/request'

export function getAuthList(params) {
  return request({
    url: `/authorities/list`,
    method: 'get',
    params
  })
}

export function getAuthMenu() {
  return request({
    url: `/authorities/menu`,
    method: 'get'
  })
}
