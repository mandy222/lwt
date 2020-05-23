import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: () => import('../views/Main.vue'),
    children: [{
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/activity',
        name: 'Activity',
        component: () => import('../views/Activity.vue')
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('../views/News.vue')
      },
      {
        path: '/trends',
        name: 'Trends',
        component: () => import('../views/Trends.vue')
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('../views/My.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetail',
    component: () => import('../views/ActivityDetail.vue'),
    props: true
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('../views/NewsDetail.vue'),
    props: true
  },
  {
    path: '/trendsIssue',
    name: 'TrendsIssue',
    component: () => import('../views/TrendsIssue.vue')
  },
  {
    path: '/myTrends/:id',
    name: 'MyTrends',
    component: () => import('../views/MyTrends.vue'),
    props: true
  }, {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }, {
    path: '/category/:type',
    name: 'NewsCategory',
    component: () => import('../views/NewsCategory.vue'),
    props: true
  }, {
    path: '/trends/:id',
    name: 'TrendsDetail',
    component: () => import('../views/TrendsDetail.vue'),
    props: true
  }, {
    path: '/trends/comment/:id',
    name: 'TrendsComment',
    component: () => import('../views/TrendsComment.vue'),
    props: true
  }, {
    path: '/user/information',
    name: 'UserInfo',
    component: () => import('../views/UserInfo.vue'),
  }, {
    path: '/info/follower/:id',
    name: 'InfoFollower',
    component: () => import('../views/InfoFollower.vue'),
    props: true
  }, {
    path: '/info/comments/:id',
    name: 'InfoComment',
    component: () => import('../views/InfoComment.vue'),
    props: true
  }, {
    path: '/info/likes/:id',
    name: 'InfoLike',
    component: () => import('../views/InfoLike.vue'),
    props: true
  }, {
    path: '/myActivity/:id',
    name: 'MyActivity',
    component: () => import('../views/MyActivity.vue'),
    props: true
  }, {
    path: '/user/setting',
    name: 'UserSetting',
    component: () => import('../views/UserSetting.vue')
  }, {
    path: '/update/password',
    name: 'UserPassword',
    component: () => import('../views/UserPassword.vue')
  }, {
    path: '/user/follow',
    name: 'UserFollow',
    component: () => import('../views/UserFollow.vue')
  }, {
    path: '/user/fans',
    name: 'UserFans',
    component: () => import('../views/UserFans.vue')
  }, {
    path: '/user/like',
    name: 'UserLike',
    component: () => import('../views/UserLike.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router