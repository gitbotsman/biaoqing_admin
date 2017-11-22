import Vue from 'vue'
import VueRouter from 'vue-router'
import toastr from './misc/toastr.esm'
import {Auth} from './resources'
import axios from 'axios'

Vue.use(VueRouter)

// 专门用来展示静态HTML文件的组件
const Html = {
  template: '<div v-html="html"></div>',
  data: () => ({
    html: ''
  }),
  beforeRouteEnter (to, from, next) {
    axios.get('/static/html/' + to.params.file).then(response => {
      next(vm => {
        vm.html = response.data
        vm.$nextTick(() => vm.$emit('loaded'))
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.$emit('loaded', 1)
    axios.get('/static/html/' + to.params.file).then(response => {
      this.html = response.data
      this.$nextTick(() => {
        this.$emit('loaded', 0)
        next()
      })
    })
  }
}
toastr.options.positionClass = 'toast-bottom-left'
toastr.options.containerId = 'toast-container'
toastr.options.newestOnTop = false
toastr.options.closeButton = true
toastr.options.extendedTimeOut = 5000 // How long the toast will display after a user hovers over it
toastr.options.timeOut = 5000 // How long the toast will display without user interaction

const routes = [
  {
    path: '/',
    component: require('./components/index.vue'),
    children: [
      {path: '', component: resolve => require(['./components/dashboard.vue'], resolve)},
      {path: '/html/:file', component: Html},
      {path: '/users/:type?/:dept?', component: resolve => require(['./components/user/users.vue'], resolve)},
      {path: '/user/new', component: resolve => require(['./components/user/new.vue'], resolve)},
      {path: '/user/profile', component: resolve => require(['./components/user/profile.vue'], resolve)},
      {path: '/user/:id', component: resolve => require(['./components/user/edit.vue'], resolve)},
      {path: '/roles/:id?', component: resolve => require(['./components/role/roles.vue'], resolve)},
      {path: '/dict', component: resolve => require(['./components/dict/list.vue'], resolve)},
      {path: '/dict/new', component: resolve => require(['./components/dict/new.vue'], resolve)},
      {path: '/dict/:id', component: resolve => require(['./components/dict/edit.vue'], resolve)}, // 这里的id对应`code`属性
      {path: '/permission', component: resolve => require(['./components/permission/list.vue'], resolve)},
      {path: '/permissions', component: resolve => require(['./components/permission/lists.vue'], resolve)},
      {path: '/permission/new', component: resolve => require(['./components/permission/new.vue'], resolve)},
      {path: '/permission/:id', component: resolve => require(['./components/permission/edit.vue'], resolve)},
      {path: '/department', component: resolve => require(['./components/department/list.vue'], resolve)},
      {path: '/departments', component: resolve => require(['./components/department/lists.vue'], resolve)},
      {path: '/department/new', component: resolve => require(['./components/department/new.vue'], resolve)},
      {path: '/department/:id', component: resolve => require(['./components/department/edit.vue'], resolve)},
      {path: '/files/:parent?', component: resolve => require(['./components/files/files.vue'], resolve)},
      {path: '/filess/:type?', component: resolve => require(['./components/files/filess.vue'], resolve)},

      {path: '/subjectmanage', component: resolve => require(['./components/biaoqing/subject-manage.vue'], resolve)},
      {path: '/subjectdetail/:id', component: resolve => require(['./components/biaoqing/subject-detail.vue'], resolve)},
      {path: '/topicmanage', component: resolve => require(['./components/biaoqing/topic-manage.vue'], resolve)},
      {path: '/topicexamine', component: resolve => require(['./components/biaoqing/topic-examine.vue'], resolve)},
      {path: '/topicdetail/:id', component: resolve => require(['./components/biaoqing/topic-detail.vue'], resolve)},
      {path: '/comments', component: resolve => require(['./components/biaoqing/comment/list.vue'], resolve)},

      {path: '/userlist', component: resolve => require(['./components/biaoqing/user-manage.vue'], resolve)},
      {path: '/userdetail/:id', component: resolve => require(['./components/user/user-detail.vue'], resolve)},
      // 贴纸
      {path: '/stickerlist', component: resolve => require(['./components/sticker/sticker-list.vue'], resolve)},
      {path: '/facesticker', component: resolve => require(['./components/sticker/face-sticker.vue'], resolve)},
      //反馈
      {path: '/feedback', component: resolve => require(['./components/biaoqing/feedback.vue'], resolve)},
      {path: '/banner', component: resolve => require(['./components/sticker/banner-manage.vue'], resolve)},

      {path: '/systemdata', component: resolve => require(['./components/role/systemdata.vue'], resolve)},
      {path: '/shadowmanage', component: resolve => require(['./components/user/shadow.vue'], resolve)},
      {path: '/myshadow', component: resolve => require(['./components/user/my-shadow.vue'], resolve)},
      {path: '/tags', component: resolve => require(['./components/tags/tags-manage.vue'], resolve)},

      //用户认证审核
      {path: '/verifies', component: resolve => require(['./components/user/verify/list.vue'], resolve)},
      {path: '/verify/:id', component: resolve => require(['./components/user/verify/edit.vue'], resolve)},

      {path: '/task', component: resolve => require(['./components/task/task-list.vue'], resolve)},
    ]
  },
  {path: '/login', component: resolve => require(['./components/login.vue'], resolve)},
  {path: '/logout', beforeEnter: Auth.logout}
]

// 不需要鉴权的路径
const permissive = ['/login', '/logout']

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: routes,
  // mode: 'history',
  mode: 'hash',
  base: '/'
})

router.beforeEach((to, from, next) => {
  if (permissive.includes(to.path) || Auth.isLogin()) {
    return next()
  }
  // toast.info('您需要先登录.')
  next({
    path: '/login',
    query: {redirect: to.path}
  })
})

export default router
