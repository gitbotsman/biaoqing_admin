<template>
  <div>
    <app-quickview></app-quickview>
    <app-settings></app-settings>
    <app-search></app-search>
    <app-aside></app-aside>
    <div class="app-content">
      <app-header :shadow="shadow"></app-header>

      <div class="layer-loading" v-show="loading"><i></i><i></i><i></i></div>

      <!-- <transition name="scale" mode="out-in" appear> -->
        <router-view class="app-content-view" @loaded="loaded" @fresh="fresh"></router-view>
      <!-- </transition> -->

      <div class="app-footer">
        <small>Copyright © 2004-2017 BiaoQing.com 表情网 | 闽ICP备16039073号-1</small>
        <span class="float-right">
          <small>APP_VERSION</small>
          <a href><i class="fa fa-long-arrow-up"></i></a>
        </span>
      </div>
    </div>

    <div id="toast-container" class="toast-bottom-left"></div>

  </div>
</template>

<script>
  import AppQuickview from './partials/app.quickview.vue'
  import AppSettings from './partials/app.settings.vue'
  import AppSearch from './partials/app.search.vue'
  import AppHeader from './partials/app.header.vue'
  import AppAside from './partials/app.aside.vue'
  import {Auth,Shadow} from '../resources'
  import $ from 'jquery'
  import storage from 'localStorage'
  export default {
    data: () => ({
      transitionName: 'slide-left',
      loading: 1,
      shadow:Shadow.current()
    }),
    beforeRouteEnter (to, form, next) {
      // 进入首页前先进行登录验证
      Auth.authorizationCheck(function (success) {
        if (!success) {
          return next('/login?redirect=' + to.path) // 登录验证操失败, 转到登录页并带上当前请求路径
        }
        next()
      })
    },
    beforeRouteUpdate (to, from, next) {
      this.loading = 1  // 路由变化时显示加载动画
      next()
    },
    methods: {
      // 子组件加载完成应向上触发`loaded`事件, 在这里捕获后隐藏加载动画. (有没有更好的实现办法?)
      loaded (state) {
        this.loading = state
      },
      fresh(id){
        this.$http.get('/shadow/all').then(res => {
          if(!res.data.data) {
            //删除
            storage.removeItem('shadow');
            this.shadow=''
            return;
          };
          var value = storage.getItem('shadow');
          if(value){
            value=JSON.parse(value);
            // 如果所删除的是被选择的马甲则重新计算
            if(id && id==value.selectShadow.id){
              value.selectShadow=res.data.data[0];
            }

            value.shadow=res.data.data;
            storage.setItem('shadow', JSON.stringify(value))
          }else{
            var shadowObj = {
              selectShadow:res.data.data[0],
              shadow:res.data.data
            }
            storage.setItem('shadow', JSON.stringify(shadowObj))
          }
          this.shadow=JSON.parse(storage.getItem('shadow'))
        })
      }
    },
    components: {AppHeader, AppAside, AppSearch, AppSettings, AppQuickview}
  }
</script>
