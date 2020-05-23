# lwt “老顽童”老人社交系统
> 基于Vue.js的由移动端网站和后台管理系统两个子系统构成

## 技术栈
* 移动端网站：Vue2 + Vant + Sass + Axios + Vue Router + Vuex
* 后台管理系统：Vue2 + Element UI + vue-admin-template + Sass
* 服务端：Express.js + Mongoose

## 项目总结
### 移动端网站
* 提取公共样式文件，快速实现页面布局
* 登录信息存在cookie中，来实现登录校验
* 使用Vuex进行状态管理，并在sessionStorage中进行存取

### 后台管理系统
* 在vue-admin-template的基础上进行了二次开发
* 菜单显示由角色控制改为了权限控制，后台返回用户拥有的权限列表，路由再进行匹配
* 使用了vue2-editor、js-cookie等插件

### 服务端
* 分为前端网站接口web和后台管理系统接口admin两部分
* 提取了权限管理、获取模型的中间件
* 提取了增、删、改、查公共接口

## 项目部分截图
### 移动端网站

### 后台管理系统


