import querystring from 'querystring'
import toastr from './misc/toastr.esm'
import storage from 'localStorage'
import axios from 'axios'
import Vue from 'vue'

export const baseURL = process.env.NODE_ENV === 'production' ? '/' : '/api'  // 所有请求的根路径

export const http = axios.create({
  // baseURL:baseURL,
  baseURL: "http://support.c3e1c0e165dda47f8957716f59db25d2d.cn-hangzhou.alicontainer.com/",
  timeout: 10000,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  // transformRequest: [data => {querystring.stringify(data)}]
})

// Add a response interceptor handing global errors
http.interceptors.response.use(response => {
  return response
}, error => {
  var response = error.response
  if (!response) {
    return toastr.error('系统繁忙，请稍后再试。')
  }
  toastr.error(response.data.msg || '系统内部错误，请联系管理员。')
  return Promise.reject(error)
})



Vue.prototype.$http = http  // 为vue实例添加`$http`属性, 方便组件内随时调用
export const Auth = {
  authorizationCheck (cb) { // 身份验证, 成功后返回当前用户所有权限
    http.get('/authorization-check').then(response => {
      this.permissions = response.data.data
      if(response.data.code==401){      //code返回401,登录失效
        toastr.error('会话已过期, 请重新登录.')
        storage.removeItem('shadow')
        storage.removeItem('user')
        cb(false, error)
      }else{
        cb(true)
      }
    }).catch(error => { // 验证失败后台会抛出401异常, 注销当前用户
      toastr.error('会话已过期, 请重新登录.')
      storage.removeItem('shadow')
      storage.removeItem('user')
      cb(false, error)
    })
  },
  login: (data) => {
    data=querystring.stringify(data)
    return new Promise((resolve, reject) => {
      http.post('/login', data).then(response => {
        http.get('/shadow/all').then(res => {
          if(res.data.data){
            var shadowObj = {
              selectShadow:res.data.data[0],
              shadow:res.data.data
            }
            storage.setItem('shadow', JSON.stringify(shadowObj))
          }
          return res;
        })
        if (response.data.code==200) {
          storage.setItem('user', JSON.stringify(response.data.data))
        }
        resolve(response)
      }, reject).catch(reject)
    })
  },
  logout: (to, from, next) => {
    storage.removeItem('shadow')
    storage.removeItem('user')
    http.get('/logout')
    next('/login')
  },
  isLogin () {
    try {
      return User.current()
    } catch (e) {
      toastr.error('用户信息出错，请重新登录!')
    }
  },
  has (perm) {
    return this.permissions.includes(perm) // 权限验证
  }
}

export const Department = resource('department', http, {
  priority: (param) => http.put('department/priority', param),  // 更新排序 param: {id:权限ID, parent:权限父ID, from:fromIndex, to:toIndex}
  treetable: () => http.get('department/treetable'),
  jstree: (selected) => http.get('department/jstree', {     // 获取所有部门
    params: {
      selected: [].concat(selected || '')
    }
  }),
  tree: (map) => http.get('department/tree?map=' + !!map),  // map为true时额外返回一个{id -> 部门}的映射对象
  all: () => http.get('department/all')  // 获取所有部门
})

export const Permission = resource('permission', http, {
  treetable: () => http.get('permission/treetable'),
  priority: (param) => http.put('permission/priority', param),  // 更新排序 param: {id:权限ID, parent:权限父ID, from:fromIndex, to:toIndex}
  jstree: () => http.get('permission/jstree'),
  perms: () => http.get('permission/perms'),
  tree: () => http.get('permission/tree')
})
// 马甲号
export const Shadow = resource('Shadow',http,{
  current: request => {
    var value = storage.getItem('shadow');
    if (value) {
      return JSON.parse(value)
    }
  },
  get(){
    http.get('/shadow/all').then(res => {
      if(!res.data.data) return;
      var shadowObj = {
        selectShadow:res.data.data[0],
        shadow:res.data.data
      }
      return shadowObj;
    })
  },
  fresh(){
    var value = storage.getItem('shadow');
    http.get('/shadow/all').then(res => {
      if(!res.data.data) return;
      if(value){
        value=JSON.parse(value);
        value.shadow=res.data.data;
        storage.setItem('shadow', JSON.stringify(value))
      }else{
        var shadowObj = {
          selectShadow:res.data.data[0],
          shadow:res.data.data
        }
        storage.setItem('shadow', JSON.stringify(shadowObj))
      }
      return JSON.parse(storage.getItem('shadow'));
    })
  },
  select: params =>{
    if(params){
        var shadow=JSON.parse(storage.getItem('shadow'));
        shadow.selectShadow=params;
        storage.setItem('shadow',JSON.stringify(shadow));
        return shadow
    }else{
        var shadow=JSON.parse(storage.getItem('shadow'));
        return shadow
    }
  },
  my:params  => http.get('/shadow/all',{params:params}),
  list:params  => http.get('/shadow',{params:params})
})

export const User = resource('user', http, {
  current: request => {
    if (request) {
      return http.get('admin/current')
    }
    var value = storage.getItem('user')
    if (value) {
      return JSON.parse(value)
    }
  },
  paging: params => http.get('user', {params}),
  query: params => http.get('admin/query', {params}),
  /*
   * 搜索用户
   * keyword        搜索关键字
   * type           过滤用户类型
   * dept           过滤部门ID
   * include        需包含的用户
   * excludeCurrent 是否排除当前用户
   */
  search: params => http.get('user/search', {params}),
  roles: (id = '') => http.get('user/roles?id=' + id),  // 获取所有用户
  profile: (user) => user ? http.put('user/profile', user) : http.get('user/profile'),
  status: (id, status) => http.put('user/status', {id, status}),  // 更新状态
  role: (id, roleId) => http.put('user/role', {id, roleId}),      // 更新角色
  partial: (params) => http.put('user/partial', params)           // 局部更新用户信息
})

export const Admin = resource('admin',http,{
  current: request => {
  if (request) {
    return http.get('admin/current')
  }
  var value = storage.getItem('user')

  if (value) {
    return JSON.parse(value)
  }
},
  paging: params => http.get('admin', {params}),
  query: params => http.get('admin/query', {params}),
  /*
   * 搜索用户
   * keyword        搜索关键字
   * type           过滤用户类型
   * dept           过滤部门ID
   * include        需包含的用户
   * excludeCurrent 是否排除当前用户
   */
  search: params => http.get('admin/search', {params}),
  roles: (id = '') => http.get('admin/roles?id=' + id),  // 获取所有用户
  profile: (user) => user ? http.put('admin/profile', user) : http.get('admin/profile'),
  status: (id, enable) => http.put('admin/status', {id, enable}),  // 更新状态
  role: (id, roleId) => http.put('admin/role', {id, roleId}),      // 更新角色
  partial: (params) => http.put('admin/partial', params)           // 局部更新用户信息
})

export const Role = resource('role', http, {
  role: (id) => http.get('role'),
  owns: (id) => http.get('role/owns?id=' + id || ''),     // 获取角色所有权限ID
  perms: (id) => http.get('role/perms?id=' + id),         // 获取角色所有权限字符串
  put_perms: (params) => http.put('role/perms', params),  // 保存角色权限更改
  all: () => http.get('role/all'),                        // 获取所有角色
  map: () => http.get('role/map')                         // 获取 角色ID=>角色 的映射对象
})

export const Dict = resource('dict', http, {
  // save 与 update 方法需要传递复杂的JSON对象
  // 因此不能以默认的`application/x-www-form-urlencoded`方式传递参与
  // 要修改为`application/json`并以JSON字符串传递, 后端才可以接收整个JSON对象
  save: (data) => jsonRequest('/dict', 'post', data),
  update: (data) => jsonRequest('/dict', 'put', data),
  bycode: (code) => http.get('dict/bycode?code=' + code)  // 按字典编码查询单个字典对象
})

export const FileMapping = resource('filemapping', http, {
  parents: (id) => http.get('filemapping/parents?parent=' + id) // 获取所有父文件夹
})

/**
 * send reqeust with Content-Type: `application/json`
 * @param path request path
 * @param method  request method
 * @param data JSON data
 * @returns {AxiosPromise}
 */
export const jsonRequest = function (path, method, data) {
  return http[method](path, data, {
    headers: {'Content-Type': 'application/json'},
    transformRequest: [data => JSON.stringify(data)]
  })
}

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource (path, http, actions) {
  var obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: obj => http.put(path, obj),
    delete: id => http.delete(path + '/' + id),
    paging (vm, pn) {
      vm.loading = 1
      vm.params.pn = pn
      return new Promise((resolve, reject) => {
        http.get(path, {params: vm.params}).then(response => {
          vm.page = response.data
          vm.$nextTick(() => {
            resolve(response)
            vm.loading = 0
          })
        }, reject)
      })
    },
  }
  return Object.assign(obj, actions)
}

/**
 * 请求表情列表和tab
 * @param path request path
 * @param method  request method
 * @param data JSON data
 * @returns {AxiosPromise}
 */
export const Subject = resource('subject', http, {
  works: params => http.get('subject',{params:params}),     // 获取作品列表
  tags: params => http.get('tag/all',{params:params}),     // 获取标签
  detail: params => http.get('subject/'+params.id),
  album: params => http.get('album/'+params.id),
  comment:params => http.get('comment',{params:params}),
  gif:params=> http.get('subject/albums',{params:params})
})

export const Comment = resource("comment",http,{
  comments:params => http.get('comment',{params:params})
})

export const UserVerify = resource("verify",http,{
  verifies:params => http.get("verify",{params:params})
})

/**
 * 话题申请列表
 * @param path request path
 * @param method  request method
 * @param data JSON data
 * @returns {AxiosPromise}
 */
export const Topic = resource('topicReview', http, {
  topicReview: params => http.get('topicReview',{params:params}),     // 话题申请列表
  topicDetail: params => http.get('topic/'+params.id)
})
/**
 * 话题管理
 * @param path request path
 * @param method  request method
 * @param data JSON data
 * @returns {AxiosPromise}
 */
export const TopicManage = resource('topicManage', http, {
  topic: params => http.get('topic',{params:params}),     //
  tags: params => http.get('tag/all',{params:params})     // 获取标签
})

export const StickerManage = resource('stickerManage', http, {
  materia: params => http.get('material',{params:params}),
  category: params => http.get('category',{params:params}),
  materialHot: params => http.get('materialHot/all',{params:params}),     // 获取标签
  faceCategory: params => http.get('sticker/category',{params:params}),
  faceSticker: params => http.get('sticker',{params:params})
})

export const UserManage = resource('usermanage', http, {
  users: params => http.get('user',{params:params}),
  detail:params => http.get('user/'+params.id),
})
export const Statistics = resource('statistics', http, {
  syn: params => http.get('statistics/syn',{params:params}),
  users: params => http.get('statistics/user',{params:params})
})

export const SystemData = resource('SystemData', http, {
  system: params => http.get('systemParam',{params:params})
})

export const Tags = resource('Tags', http, {
  index: params => http.get('/tag',{params:params}),
  material: params => http.get('/materialHot',{params:params}),
  search:params => http.get('/searchHot',{params:params})

})

export const Task = resource('Task', http, {
  liked: params => http.get('/subject/liked',{params:params}),
})
export const Report = resource('Report', http, {
  list: params => http.get('/report',{params:params}),
})


