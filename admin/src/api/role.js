import request from '@/utils/request'

export function getRoleAuth(params) {
  return request({
    url: '/roles/authorities',
    method: 'get',
    params
  })
}

