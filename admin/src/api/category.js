import request from '@/utils/request'

export function getChildrenList(params) {
  return request({
    url: `/categories/children`,
    method: 'get',
    params
  })
}

