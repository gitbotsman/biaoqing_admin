<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">系统管理</li>
      <li class="breadcrumb-item">
        <router-link to="/department">部门管理</router-link>
      </li>
      <li class="breadcrumb-item active">新增部门</li>
    </ol>
    <form class="mx-3" autocomplete="off" @submit.prevent="submit">
      <div class="card p-3 mb-3">
        <div class="mb-3">
          <h4 class="card-title">必填项</h4>
          <span class="text-muted">These fileds are <code>required</code>.</span>
        </div>
        <div class="form-group row" v-styling="'name'">
          <label class="col-form-label col-sm-2">部门名称</label>
          <div class="col-sm-10">
            <input name="name" v-model="department.name" v-validate="'required'" title="部门名称" class="form-control" placeholder="部门名称" maxlength="32">
            <i></i>
            <span class="form-control-feedback">{{ errors.first('name') }}</span>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">负责人</label>
          <div class="col-sm-10 d-flex align-items-center">
            <selectize v-model="department.leader"></selectize>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">上级部门</label>
          <div class="col-sm-10">
            <input class="form-control" id="departmentName" placeholder="上级部门" readonly>
            <jstree class="mt-0" attach="#departmentName" :treenodes="treenodes" v-model="department.parent" dropdown="down"></jstree>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-form-label col-sm-2">优先级</label>
          <div class="col-sm-10">
            <input name="priority" v-model="department.priority" class="form-control" type="number" placeholder="优先级" maxlength="5">
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
  import {Department, User} from '../../resources'
  import selectize from '../../widgets/selectize.vue'
  import jstree from '../../widgets/jstree.vue'
  import dict from '../../widgets/dict.vue'
  import {showResponse} from '../../misc/utils'

  export default {
    data: () => ({
      department: {
        leader: User.current().id,
        parent: '',
        name: ''
      },
      treenodes: []
    }),
    beforeRouteEnter (to, from, next) {
      Department.jstree(to.query.parent).then(tree => {
        next(vm => {
          vm.treenodes = tree.data
          vm.department.parent = to.query.parent
          vm.$nextTick(() => vm.$emit('loaded'))
        })
      })
    },
    methods: {
      submit () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          Department.save(this.department).then(response => {
            showResponse(response, () => this.$router.back())
          })
        })
      }
    },
    components: {selectize, jstree, dict}
  }
</script>
