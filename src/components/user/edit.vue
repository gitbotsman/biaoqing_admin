<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">系统管理</li>
      <li class="breadcrumb-item">
        <router-link to="/users">用户</router-link>
      </li>
      <li class="breadcrumb-item active">{{user.name}}</li>
    </ol>
    <form autocomplete="off" @submit.prevent="submit" class="mx-3">
      <div class="card mb-3 p-3 b-0 col-12">
        <div class="mb-3">
          <h4 class="card-title">必填项</h4>
          <span class="text-muted">These fileds are <code>required</code>.</span>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">名称</label>
          <div class="col-sm-10">
            <input name="name" class="form-control" placeholder="名称" v-model="user.name" disabled>
          </div>
        </div>
        <div class="form-group row" v-styling="'pass'">
          <label class="col-form-label col-sm-2">密码</label>
          <div class="col-sm-10">
            <input type="password" name="pass" v-model="user.pass" class="form-control" v-validate="'max:32'" placeholder="密码 (无需修改请留空)">
            <span class="form-control-feedback">{{ errors.first('pass') }}</span>
          </div>
        </div>
        <!--<div class="form-group row" v-styling="'email'">-->
          <!--<label class="col-form-label col-sm-2">邮箱</label>-->
          <!--<div class="col-sm-10">-->
            <!--<input name="email" v-model="user.email" class="form-control" v-validate="'required|email'" placeholder="邮箱">-->
            <!--<span class="form-control-feedback">{{ errors.first('email') }}</span>-->
          <!--</div>-->
        <!--</div>-->
        <div class="form-group row" v-styling="'phone'">
          <label class="col-form-label col-sm-2">手机号</label>
          <div class="col-sm-10">
            <input name="phone" v-model="user.phone" class="form-control" v-validate="{rules: { required: true, regex: /^\d{11}$/} }" title="手机号码" placeholder="手机号码">
            <span class="form-control-feedback">{{ errors.first('phone') }}</span>
          </div>
        </div>
        <div class="form-group row" v-styling="'nick'">
          <label class="col-form-label col-sm-2">呢称</label>
          <div class="col-sm-10">
            <input name="nick" v-model="user.nick" class="form-control" v-validate="'max:32'" placeholder="呢称" title="呢称">
            <span class="form-control-feedback">{{ errors.first('nick') }}</span>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">生日</label>
          <date-select class="col-sm-10" v-model="user.birthday"></date-select>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">选择角色</label>
          <div class="col-sm-10">
            <select class="form-control" title="选择角色" v-model="user.roleId">
              <option v-for="item in roles" :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">所属部们</label>
          <div class="col-sm-10">
            <input id="departmentName" class="form-control" placeholder="所属部们" readonly>
            <jstree attach="#departmentName" :treenodes="depts" v-model="user.departmentId" dropdown="up"></jstree>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">用户状态</label>
          <div class="col-sm-10">
            <select v-model="user.enable" title="用户状态" class="form-control">
              <option value="true">启用</option>
              <option value="false">停用</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">最近登录：</label>
          <div class="form-control-static col-sm-10"><code class="text-info">{{user.visited}}</code></div>
        </div>
      </div>
      <div class="px-3">
        <a class="btn btn-outline-secondary rounded mr-2" href="javascript:history.back()"><i class="fa fa-arrow-circle-left"></i> 返回</a>
        <button class="btn btn-outline-info rounded" :disabled="errors.any()"><i class="fa fa-cloud-upload"></i> 提交</button>
      </div>
    </form>
  </div>
</template>

<script>
  import DateSelect from '../../widgets/dateselect.vue'
  import jstree from '../../widgets/jstree.vue'
  import {Admin, Department} from '../../resources'
  import {showResponse} from '../../misc/utils'

  export default {
    data: () => ({
      loading: 1,
      depts: [],
      roles: [],
      user: {},
      owns: []
    }),
    beforeRouteEnter (to, from, next) {
      var id = to.params.id
      Promise.all([Admin.get(id), Admin.roles(id), Department.jstree()]).then(([user, roles, depts]) => {
        next(vm => {
          console.log(roles)
          vm.depts = depts.data.data
          vm.roles = roles.data.data.roles
          vm.user = user.data.data
          vm.owns = roles.data.data.owns || []
          vm.$nextTick(() => vm.$emit('loaded'))
        })
      })
    },
    beforeRouteUpdate (to, from, next) {
      var id = to.params.id
      Promise.all([Admin.get(id), Admin.roles(id), Department.jstree()]).then(([user, roles, depts]) => {
        this.depts = depts.data.data
        this.roles = roles.data.data.roles
        this.owns = roles.data.data.owns
        this.user = user.data.data
      })
    },
    methods: {
      submit () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          this.user.roles = this.owns
          Admin.update(this.user).then(response => {
            showResponse(response, () => this.$router.back())
          })
        })
      }
    },
    components: {DateSelect, jstree}
  }
</script>
