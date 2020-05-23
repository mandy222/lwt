const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => {
    state.user.avatar = sessionStorage.getItem('avatar')
    return state.user.avatar
  },
  name: state => {
    state.user.name = sessionStorage.getItem('name')
    return state.user.name
  },
  id: state => {
    state.user.id = sessionStorage.getItem('id')
    return state.user.id
  },
  fans: state => {
    state.user.fans = sessionStorage.getItem('fans') ? sessionStorage.getItem('fans').split(',') : []
    return state.user.fans
  },
  follower: state => {
    state.user.follower = sessionStorage.getItem('follower') ? sessionStorage.getItem('follower').split(',') : []
    return state.user.follower
  }
}
export default getters