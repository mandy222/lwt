import request from '@/utils/request'

export function getInfo(name) {
  return request({
    url: `/rest/${name}/list`,
    method: 'get'
  })
}

export function getPageInfo(name, params) {
  return request({
    url: `/rest/${name}/page/list`,
    method: 'get',
    params
  })
}

export function createInfo(name, data) {
  return request({
    url: `/rest/${name}/create`,
    method: 'post',
    data
  })
}

export function updateInfo(name, data) {
  console.log('data', data)
  return request({
    url: `/rest/${name}/update/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteInfo(name, id) {
  return request({
    url: `/rest/${name}/delete/${id}`,
    method: 'delete'
  })
}

export function upload(data) {
  return request({
    url: `/upload`,
    method: 'post',
    data
  })
}

