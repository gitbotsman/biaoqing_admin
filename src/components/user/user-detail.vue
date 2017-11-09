<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/userlist">用户管理</router-link></li>
      <li class="breadcrumb-item">用户详情</li>
      <li class="breadcrumb-item cursor" @click="toBack">返回上一页</li>
    </ol>
    <div class="users-container clearfloat row">
      <div class="users-d-tx col-sm-2">
        <div class="users-d-tx-img pr">
          <img :src="detail.fullAvatar">
          <span v-if="detail.userType=='2' || detail.userType=='3'" class="user-auth "></span>
        </div>
        <div class="users-d-statu">
          <div v-if="detail.userType=='2' || detail.userType=='3'" class="mb-2 mt-3 color999 "style="font-size:13px;">认证信息：{{detail.verifiedReason}}</div>
          <div class="btn-group mt-3 mb-2">
            <button type="button" class="btn btn-outline-info  btn-sm dropdown-toggle" data-toggle="dropdown">
              <span>禁言</span>
            </button>
            <div class="dropdown-menu">
              <a @click="userBan(detail.id,'1')" class="dropdown-item">1天</a>
              <a @click="userBan(detail.id,'3')" class="dropdown-item">3天</a>
              <a @click="userBan(detail.id,'15')" class="dropdown-item">15天</a>
              <a @click="userBan(detail.id,'-1')" class="dropdown-item">永久</a>
              <div class="dropdown-divider"></div>
              <a @click="deleteBan(detail.id)" class="dropdown-item">解除禁言</a>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group-alt-attached col-sm-10" style="padding-right:0;">
          <div class="row">
            <div class="col-sm-4 ">
              <div class="form-group form-group-alt">
                <label>昵称</label>
                <span class="form-control color999 flex-center text-over" :title="detail.name">{{detail.name}}</span>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group form-group-alt">
                <label>性别</label>
                  <span class="form-control color999 flex-center">
                    <span class="users-d-info-value"><span v-if="detail.sex=='1'">男</span></span>
                    <span class="users-d-info-value"><span v-if="detail.sex=='2'">女</span></span>
                  </span>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group form-group-alt">
                <label>注册时间</label>
                <span class="form-control color999 flex-center">{{detail.createTime}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group form-group-alt">
                <label>描述</label>
                <span class="form-control color999 flex-center" style="height:auto;">{{detail.summary}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3">
              <div class="form-group form-group-alt">
                <label>地区</label>
                <span class="form-control color999 flex-center">{{detail.address}}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group form-group-alt">
                <label>注册平台</label>
                <span class="form-control color999 flex-center">{{detail.loginDevice}}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group form-group-alt">
                <label>生日</label>
                <span class="form-control color999 flex-center">{{detail.birthday}}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group form-group-alt">
                <label>手机号</label>
                <span class="form-control color999 flex-center">{{detail.phone}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            
            <div class="col-sm-12">
              <div class="form-group form-group-alt">
                <label>注册IP</label>
                <span class="form-control color999 flex-center">{{detail.clientHost}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group form-group-alt">
                <label>关注数</label>
                <span class="form-control color999 flex-center">{{detail.followNum}}</span>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group form-group-alt">
                <label>粉丝数</label>
                <span class="form-control color999 flex-center">{{detail.fansNum}}</span>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="form-group form-group-alt">
                <label>喜欢的作品</label>
                <span class="form-control color999 flex-center">{{detail.myLikeWorkNum}}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import '../../../static/css/biaoqing/user.css'
  import { UserManage } from '../../resources'
  import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
  import swal2 from 'sweetalert2'
  import $ from 'jquery'
  import querystring from 'querystring'
  export default {
    data: () => ({
      loading: false,
      detail:''
    }),
    beforeRouteEnter (to, from, next) {
      var id = to.params.id;
      var params={
        id:id
      }
      var req = [UserManage.detail(params)]
      Promise.all(req).then(([detail])=>{
        detail.data.data.createTime=formatTime(detail.data.data.createTime)
        next(vm=>{
          vm.detail = detail.data.data;
        })
      })
      
    },
    mounted () {
        this.$emit('loaded',false)
    },
    methods: {
      toBack(){
        history.go(-1)
      },
      deleteBan(id){
        var params = {
          t:1
        }
        var $this=this;
        this.$http.delete('/ban/'+id,{params:params}).then(response => {
          if(response.data.code==200){
            $this.$notice.success('解除成功')
          }
        })
      },
      userBan(id,days){
        var $this = this;
        if(days=='-1'){
          var days = '永久';
          var expire = '-1';
        }else{
          var expire = days*24*60*60;
          var days = days+'天';
        }
        var params = {
          t:1,
          userId:id,
          expire:expire,
          reason:'违规'
        }
        swal2({
          title: '请输入禁言理由',
          text:'谨慎操作！',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showLoaderOnConfirm: true,
          reverseButtons:true,
          preConfirm: function (text) {
            return new Promise(function (resolve,reject) {
                  if (text != '') {
                    params.reason=text;
                    params=querystring.stringify(params)
                    $this.$http.post('/ban',params).then(response => {
                      if(response.data.code==200){
                        params=querystring.parse(params)
                        var detail = $this.detail;
                        detail.reason=params.reason;
                        $this.$notice.success('禁言成功：'+days)
                      }
                    })
                    swal2.close()
                  } else {
                    reject('请输入禁言理由！')
                  }
              })
          },
        }).catch(swal2.noop)
      },
    }
  }
</script>
