<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">系统管理</li>
      <li class="breadcrumb-item">
        <router-link to="/permission">权限管理</router-link>
      </li>
      <li class="breadcrumb-item active">{{permission.name}}</li>
    </ol>
    <form autocomplete="off" @submit.prevent="submit" class="mx-3">
      <div class="card mb-3 p-3 b-0">
        <div class="mb-3">
          <h4 class="card-title">必填项</h4>
          <span class="text-muted">These fileds are <code>required</code>.</span>
        </div>

        <div class="form-group row" v-styling="'name'">
          <label class="col-form-label col-sm-2">名称</label>
          <div class="col-sm-10">
            <input name="name" class="form-control" v-model="permission.name" v-validate="'required'" placeholder="名称" title="权限名称">
            <span class="form-control-feedback">{{ errors.first('name') }}</span>
          </div>
        </div>

        <div class="form-group row" v-styling="'code'">
          <label class="col-form-label col-sm-2">编码(权限唯一标识)</label>
          <div class="col-sm-10">
            <input name="code" v-model="permission.code" v-validate="'required|min:2|max:64'" class="form-control" title="编码" placeholder="权限编码">
            <span class="form-control-feedback">{{ errors.first('code') }}</span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-form-label col-sm-2">图标</label>
          <div class="col-sm-10 d-flex align-items-center">
            <span class="fa-2x text-themepink" :class="permission.icon ? permission.icon : 'fa fa-fonticons'"></span>
            <span class="mx-2 text-grey">{{permission.icon || '您可以为' + (permission.type == 1 ? '菜单' : '权限') + '指定一个图标:'}}</span>
            <button class="btn btn-sm btn-outline-info" title="选择图标" type="button" @click="showModal">选择图标</button>
            <span class="font-xs text-muted ml-2">(双击确认)</span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-form-label col-sm-2">指定父级权限</label>
          <div class="col-sm-10">
            <input class="form-control" id="parent" placeholder="父级权限" readonly>
            <jstree class="mt-0" attach="#parent" :treenodes="treenodes" v-model="permission.parent" dropdown="down"></jstree>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-form-label col-sm-2">排序</label>
          <div class="col-sm-10">
            <input name="priority" v-model="permission.priority" class="form-control" type="number" max="9999" min="-9999" placeholder="排序越大越靠前">
          </div>
        </div>

        <div class="form-group row">
          <label class="col-form-label col-sm-2">描述</label>
          <div class="col-sm-10">
            <textarea name="description" v-model="permission.description" class="form-control" placeholder="权限描述" rows="2"></textarea>
          </div>
        </div>
      </div>

      <div class="modal" ref="modal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">选择图标</h4>
              <a class="close" @click="modal.hide()">&times;</a>
            </div>
            <div class="modal-body p-0" ref="content">
              <div class="text-grey p-3">正在加载...</div>
            </div>
            <div class="modal-footer">
              <a class="btn btn-secondary" @click="modal.hide()">Close</a>
            </div>
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
  import {Permission} from '../../resources'
  import {showResponse, Modal} from '../../misc/utils'
  import jstree from '../../widgets/jstree.vue'
  import axios from 'axios'

  export default {
    data: () => ({
      permission: {
        icon: ''
      },
      treenodes: [],
      modal: 0
    }),
    beforeRouteEnter (to, from, next) {
      Promise.all([Permission.get(to.params.id), Permission.jstree()]).then(([perm, tree]) => {
        next(vm => {
          vm.permission = perm.data
          vm.treenodes = tree.data
          vm.$nextTick(() => vm.$emit('loaded'))
        })
      })
    },
    beforeRouteUpdate (to, from, next) {
      this.$nextTick(() => this.$emit('loaded', 1))
      Permission.get(to.params.id).then(perm => {
        this.permission = perm.data
        this.$nextTick(() => this.$emit('loaded'))
        next()
      })
    },
    mounted () {
      this.modal = new Modal(this.$refs.modal)
    },
    methods: {
      showModal () {
        if (!this.modal.loaded) {
          axios.get('/static/html/ui.font-awesome-icons.html').then(response => {
            this.$refs.content.innerHTML = response.data
            this.$refs.content.addEventListener('dblclick', (e) => {
              if (e.target.classList.contains('fa-hover')) {
                this.permission.icon = e.target.childNodes[0].className
                this.modal.hide()
              }
            })
            this.modal.loaded = true
          })
        }
        this.modal.show()
      },
      submit () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          Permission.update(this.permission).then(response => {
            showResponse(response, () => this.$router.back())
          })
        })
      }
    },
    components: {jstree}
  }
</script>
