<template>
  <div class="app-aside">
    <router-link class="navbar-brand" to="/" style="width: 219px;text-align: center;line-height:41px;">
      <img src="/static/img/logos/logo-xmin.png" style="margin-right: 31px;" class="logo-xs">
      <img src="/static/img/logos/logo-min.png" class="logo">
    </router-link>
    <div class="aside-title">SYSTEM</div>
    <router-link class="aside-item" to="/" title="Dashboard" v-ripple exact>
      <i class="fa fa-dashboard"></i><span>Dashboard</span>
    </router-link>
    <router-link class="aside-item" to="/permission" v-permission="'permission.view'" v-ripple.stop><i class="fa fa-lock"></i><span>权限</span></router-link>
    <!-- <router-link class="aside-item" to="/roles" v-permission="'role.view'" v-ripple.stop><i class="fa fa-vcard"></i><span>角色</span></router-link> -->
    <!-- <router-link class="aside-item" to="/users" v-permission="'user.view'" v-ripple.stop><i class="fa fa-users"></i><span>用户</span></router-link> -->
    <!-- <router-link class="aside-item" to="/department" v-permission="'department.view'" v-ripple.stop><i class="fa fa-building-o"></i><span>部门</span></router-link> -->
    <router-link class="aside-item" to="/systemdata" v-permission="'dict.view'" v-ripple.stop><i class="fa fa-book"></i><span>系统参数</span></router-link>
    <!-- <router-link class="aside-item" to="/files" v-permission="'files'" v-ripple><i class="fa fa-files-o"></i><span>文件库</span></router-link> -->
    <div class="aside-divider"></div>
    <div class="aside-title">LIST</div>
    <!-- <div class="aside-item parent" v-ripple>
      <i class="fa fa-star-o"></i><span>UI</span>
      <div class="children">
        <div class="fold-header">UI</div>
        <router-link class="aside-item" to="/html/ui.general.html" v-ripple.stop><span>General</span></router-link>
        <router-link class="aside-item" to="/html/ui.buttons.html" v-ripple.stop><span>Buttons</span></router-link>
        <router-link class="aside-item" to="/html/ui.tabs-accordions.html" v-ripple.stop><span>Tabs &amp Accordions</span></router-link>
        <router-link class="aside-item" to="/html/ui.typography.html" v-ripple.stop><span>Typography</span></router-link>
        <router-link class="aside-item" to="/html/ui.font-awesome-icons.html" v-ripple.stop><span>FontAwesome Icons</span></router-link>
        <router-link class="aside-item" to="/html/ui.themify-icons.html" v-ripple.stop><span>Themify Icons</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-file-text-o"></i><span>Forms</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/html/forms.elements.html" v-ripple.stop><span>Elements</span></router-link>
        <router-link class="aside-item" to="/html/forms.layouts.html" v-ripple.stop><span>Layouts</span></router-link>
        <router-link class="aside-item" to="/html/forms.wizard.html" v-ripple.stop><span>Form wizard</span></router-link>
      </div>
    </div> -->
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-tint"></i><span>表情管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/subjectmanage" v-ripple.stop><span>表情列表</span></router-link>
        <router-link class="aside-item" to="/topicmanage" v-ripple.stop><span>专题列表</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-object-group"></i><span>审核管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/topicexamine" v-ripple.stop><span>专题审核</span></router-link>
        <!-- <router-link class="aside-item" to="/subjectreport" v-ripple.stop><span>表情举报</span></router-link> -->
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-meetup"></i><span>贴纸管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/stickerlist" v-ripple.stop><span>贴纸列表</span></router-link>
      </div>
    </div>
    <div class="aside-item parent" v-ripple>
      <i class="fa fa-user-circle"></i><span>用户管理</span>
      <div class="children">
        <div class="fold-header">Forms</div>
        <router-link class="aside-item" to="/userlist" v-ripple.stop><span>用户列表</span></router-link>
      </div>
    </div>
    <router-link class="aside-item" to="/banner" title="Dashboard" v-ripple exact>
      <i class="fa fa-map"></i><span>广告管理</span>
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
