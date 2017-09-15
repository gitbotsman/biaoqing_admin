<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">系统管理</li>
      <li class="breadcrumb-item">
        <router-link to="/users">用户</router-link>
      </li>
      <li class="breadcrumb-item active">新增用户</li>
    </ol>
    <form autocomplete="off" @submit.prevent="submit()" class="mx-3">
      <div class="card mb-3 p-3 b-0 col-12">
        <div class="mb-3">
          <h4 class="card-title">必填项</h4>
          <span class="text-muted">These fileds are <code>required</code>.</span>
        </div>

        <div class="form-group row" v-styling="'name'">
          <label class="col-form-label col-sm-2">用户名</label>
          <div class="col-sm-10">
            <input name="name" class="form-control" v-model="user.name" v-validate="'required|min:2|max:32|remote:guest/exists'" placeholder="用户名" title="用户名">
            <span class="form-control-feedback">{{ errors.first('name') }}</span>
          </div>
        </div>

        <div class="form-group row" v-styling="'pass'">
          <label class="col-form-label col-sm-2">密码</label>
          <div class="col-sm-10">
            <input type="password" name="pass" v-model="user.pass" class="form-control" v-validate="'required|max:32'" placeholder="密码" title="用户密码">
            <span class="form-control-feedback">{{ errors.first('pass') }}</span>
          </div>
        </div>
        <div class="form-group row" v-styling="'email'">
          <label class="col-form-label col-sm-2">邮箱</label>
          <div class="col-sm-10">
            <input name="email" v-model="user.email" class="form-control" v-validate="'required|email'" placeholder="邮箱" title="邮箱">
            <span class="form-control-feedback">{{ errors.first('email') }}</span>
          </div>
        </div>
        <div class="form-group row" v-styling="'phone'">
          <label class="col-form-label col-sm-2">手机号</label>
          <div class="col-sm-10">
            <input name="phone" v-model="user.phone" class="form-control" data-vv-delay="400" placeholder="手机号" title="手机号"
                   v-validate="{rules: { required: true, regex: /^\d{11}$/, remote: 'guest/exists'} }">
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
          <date-select class="col-sm-4" v-model="user.birthday"></date-select>
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
            <input class="form-control" id="departmentName" placeholder="所属部门" readonly>
            <jstree attach="#departmentName" :treenodes="depts" v-model="user.departmentId" dropdown="up"></jstree>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">用户状态</label>
          <div class="col-sm-10">
            <select v-model="user.status" title="用户状态" class="form-control">
              <option value="1">启用</option>
              <option value="0">停用</option>
            </select>
          </div>
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
  import {User, Department} from '../../resources'
  import {showResponse} from '../../misc/utils'

  export default {
    data: () => ({
      depts: [],
      roles: [],
      user: {
        departmentId: -1,
        roleId: 0,  // 默认为普通用户角色
        status: 1,
        name: '',
        type: 1
      }
    }),
    beforeRouteEnter (to, from, next) {
      Promise.all([User.roles(), Department.jstree()]).then(([user, depts]) => {
        next(vm => {
          vm.roles = user.data.roles
          vm.depts = depts.data
          vm.$nextTick(() => vm.$emit('loaded'))
        })
      })
    },
    methods: {
      submit () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          this.user.birthday = this.birth.join('-')
          User.save(this.user).then(response => {
            showResponse(response, () => this.$router.back())
          })
        })
      }
    },
    components: {DateSelect, jstree}
  }
</script>
