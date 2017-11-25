<template>
  <div class="app-aside">
    <router-link class="navbar-brand" to="/" style="width: 219px;text-align: center;line-height:41px;">
      <img src="/static/img/logos/logo-xmin.png" style="margin-right: 31px;" class="logo-xs">
      <img src="/static/img/logos/logo-min.png" class="logo">
    </router-link>
    <div class="aside-title">SYSTEM</div>
    <router-link class="aside-item" to="/" title="Dashboard" v-ripple exact>
      <i class="fa fa-dashboard"></i><span>控制台</span>
    </router-link>
    <router-link class="aside-item" to="/permission" v-permission="'permission.view'" v-ripple.stop><i class="fa fa-lock"></i><span>权限</span></router-link>
    <router-link class="aside-item" to="/roles" v-permission="'role.view'" v-ripple.stop><i class="fa fa-vcard"></i><span>角色</span></router-link>
    <router-link class="aside-item" to="/users" v-permission="'user.view'" v-ripple.stop><i class="fa fa-users"></i><span>用户</span></router-link>
    <!-- <router-link class="aside-item" to="/department" v-permission="'department.view'" v-ripple.stop><i class="fa fa-building-o"></i><span>部门</span></router-link> -->
    <router-link class="aside-item" to="/systemdata" v-permission="'dict.view'" v-ripple.stop><i class="fa fa-book"></i><span>系统参数</span></router-link>
    <router-link class="aside-item" to="/shadowmanage" v-permission="'shadow.view'" v-ripple.stop><i class="fa fa-address-book"></i><span>马甲管理</span></router-link>
    <router-link class="aside-item" to="/myshadow" v-ripple.stop><i class="fa fa-user-secret"></i><span>我的马甲</span></router-link>

    <div class="aside-divider"></div>
    <div class="aside-title">LIST</div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-tint"></i><span>表情管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/subjectmanage" v-ripple.stop><span>表情列表</span></router-link>
        <router-link class="aside-item" to="/topicmanage" v-ripple.stop><span>专题列表</span></router-link>
        <router-link class="aside-item" to="/comments" v-ripple.stop><span>评论列表</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-object-group"></i><span>审核管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/topicexamine" v-ripple.stop><span>专题审核</span></router-link>
        <router-link class="aside-item" to="/verifies" v-ripple.stop><span>认证审核</span></router-link>
        <router-link class="aside-item" to="/report" v-ripple.stop><span>举报管理</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-meetup"></i><span>贴纸管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/stickerlist" v-ripple.stop><span>贴纸列表</span></router-link>
      </div>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/facesticker" v-ripple.stop><span>脸部贴纸</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-user-circle"></i><span>用户管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/userlist" v-ripple.stop><span>用户列表</span></router-link>
      </div>
    </div>
    <router-link class="aside-item" to="/task" title="Dashboard" v-ripple exact>
      <i class="fa fa-bell"></i><span>定时任务</span>
    </router-link>
    <router-link class="aside-item" to="/banner" title="Dashboard" v-ripple exact>
      <i class="fa fa-map"></i><span>广告管理</span>
    </router-link>
    <router-link class="aside-item" to="/tags" title="Dashboard" v-ripple exact>
      <i class="fa fa-motorcycle"></i><span>热词管理</span>
    </router-link>
    <router-link class="aside-item" to="/feedback" title="Dashboard" v-ripple exact>
      <i class="fa fa-grav"></i><span>反馈管理</span>
    </router-link>

  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    data: () => ({
      title: '表情'
    }),
    mounted () {
      var $el = $(this.$el)
      function activeAncestors ($el) {
        var $parent = $el.parent()
        if ($parent.hasClass('parent')) {
          $parent.parent().addClass('opened')
          activeAncestors($parent.parent())
        }
      }

      function setAsideActiveItem () {
        var parts = window.location.href.split('/')
        var page = parts[0] + '//' + parts[2] + '/' + parts[3]
        $el.find('div a').each(function () {
          if (page === this.href) {
            var $parent = $(this).parent()
            $parent.addClass('active')
            activeAncestors($parent)
            return false
          }
        })
      }

      $el.on('click.aside', '.aside-item', function (e) {
        var $this = $(this)
        if ($this.hasClass('parent')) {
          if ($this.hasClass('opened')) {
            $this.removeClass('opened')
          } else {
            $this.siblings().removeClass('opened')
            $this.addClass('opened')
          }
        } else {
          $el.find('.aside-item.active').removeClass('active')
          $this.toggleClass('active')
        }
      })
      setAsideActiveItem()
    }
  }
</script>
