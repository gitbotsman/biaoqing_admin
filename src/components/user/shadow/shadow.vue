<template>
<div>
  <ol class="breadcrumb">
    <li class="breadcrumb-item">马甲管理</li>
  </ol>
  <div class="biaoqing-container">
    <div @click="tagShadow()" class="user-disable btn btn-sm btn-outline-primary mb-2 mr-3" :class="{active:(isAllot==='')}">所有马甲</div>
    <div @click="tagShadow('0')" class="user-disable btn btn-sm btn-outline-primary mb-2 mr-3" :class="{active:(isAllot==='0')}">未分配马甲</div>
    <!-- <div @click="tagShadow('1')" class="user-disable btn btn-sm btn-outline-primary mb-2 mr-3" :class="{active:(isAllot==='1')}">已分配马甲</div> -->
    <div class="biaoqing-table" v-if="shadowList.items">
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
              <th>头像</th>
              <th>用户ID</th>
              <th>用户名</th>
              <th>账号</th>
              <th>密码</th>
              <th>注册时间</th>
              <th>粉丝数</th>
              <th>关注数</th>
              <th>作品数</th>
              <th>操作<div style="font-weight:normal;font-size:12px;">(点击姓名取消绑定)</div></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user,index) in shadowList.items">
              <td class="img-view" style="vertical-align: middle;">
                <div class="full-avatar pr">
                  <img class="biaoqing-list-cover-img" style="display:block;" :src="[user.user.fullAvatar]">
                  <span v-if="user.userType=='3' || user.userType=='2'" class="auth_icon_wb"></span>
                </div>
              </td>
              <td>{{user.user.id}}</td>
              <td class="max-width100">
                <span class="biaoqing-table-content" :title="user.name">{{user.user.name}}</span>
              </td>
              <td class="max-width20" :title="user.phone">
                {{user.user.account}}
              </td>
              <td>{{user.passwd}}</td>
              <td class="max-width100 publish-time">
                <span>{{user.createTime}}</span>
              </td>
              <td class="max-width20">
                {{user.user.fansNum}}
              </td>
              <td class="max-width20">
                {{user.user.followNum}}
              </td>
              <td class="max-width20">
                {{user.user.workNum}}
              </td>
              <td>
                <span v-if="user.sysUser" @click="deleteShadow(user.id)" class="pass-ing cursor hover-line">
                  {{user.sysUser.nick}}
                </span>
                <span v-else @click="showSelect(user.id)" class="hover-line cursor pass-success">分配</span>
              </td>
            </tr>
          </tbody>
      </table>
      <Pagepublic :pages="shadowList" @paging="goUser"></Pagepublic>
    </div>
    <div class="selecTagContainer" :class="{show:(shadowShow==true)}">
      <div class="selecTag-bg" @click="cancleSelect"></div> 
      <div class="selecTag-main"  style="top:40%;">
        <div class="selecTag-title">搜索用户：<input v-model="adminUser" placeholder="输入用户名称" type="text" class="select-shadow-input"></div> 
        <div class="clearfloat">
          <table class="table table-bordered">
            <thead>
              <th>用户名</th>
              <th>ID</th>
              <th>操作</th>
            </thead>
            <tbody>
              <tr v-for="model in modelUser.items">
                <td class="text-overflow max-width200">{{model.nick}}</td>
                <td>{{model.id}}</td>
                <td class="select-user cursor hover-line" @click="selectModelUser(model.id)">分配</td>
              </tr>
            </tbody>
          </table>
        </div> 
        <div class="selecTag-btn-box">
          <div class="selecTag-btn selecTag-cancle" @click="cancleSelect">取消</div> 
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import '../../../../static/css/biaoqing/user.css'
import '../../../../static/css/biaoqing/biaoqing.css'
import { Shadow } from '../../../resources'
import { formatTime } from '../../../misc/utils'
import Pagepublic from '../../../widgets/pagepublic.vue'
export default {
  data: () => ({
    loading: false,
    shadowList:'',
    formPage:'',
    shadowShow:false,
    modelUser:'',
    shadowId:'',
    adminUser:'',
    page:1,
    isAllot:''
  }),
  beforeRouteEnter (to,form,next) {
    var params={
      pageNum:1
    }
    var request = [Shadow.list(params)]
    Promise.all(request).then(([shadowList]) => {
      for(var i = 0;i<shadowList.data.data.items.length;i++){
        shadowList.data.data.items[i].createTime=formatTime(shadowList.data.data.items[i].createTime)
      }
      next(vm=>{
        vm.shadowList=shadowList.data.data;
      })
    })
  },
  mounted () {
    this.$emit('loaded')
  },
  watch:{
    adminUser:function(newAdminUser){
      if(newAdminUser !=''){
        this.searchAdminUser(newAdminUser)
      }else{
        this.modelUser=''
      }
    }
  },
  methods: {
    tagShadow(isAllot){
      if(isAllot==='0') isAllot=0;
      if(isAllot==='1') isAllot=1;
      if(isAllot==='') isAllot='';
      var params={
        pageNum:1,
        isAllot:isAllot
      }
      this.$emit('loaded',true)
      this.$http.get('/shadow',{params:params}).then(shadowList => {
        this.$emit('loaded',false)
        if(shadowList.data.data){
          for(var i = 0;i<shadowList.data.data.items.length;i++){
            shadowList.data.data.items[i].createTime=formatTime(shadowList.data.data.items[i].createTime)
          }
        }
        this.isAllot=params.isAllot
        this.page=params.pageNum
        this.shadowList=shadowList.data.data;
      })
    },
    goUser(page){
      this.$emit('loaded',true)
      var params={
        pageNum:page,
        isAllot:this.isAllot
      }
      this.$http.get('/shadow',{params:params}).then(shadowList => {
        this.$emit('loaded',false)
        if(shadowList.data.data){
          for(var i = 0;i<shadowList.data.data.items.length;i++){
            shadowList.data.data.items[i].createTime=formatTime(shadowList.data.data.items[i].createTime)
          }
        }
        this.page=page
        this.shadowList=shadowList.data.data;
      })
    },
    selectModelUser(id){
      var shadowId = this.shadowId;
      var params ={
        "sysUserId":id,
        "id": shadowId
      }
     this.$http.put('/shadow',params).then(res => {
        if(res.data.code==200){
          this.$notice.success('分配成功');
          this.$emit('fresh');
          this.goUser(this.page)
          this.cancleSelect()
        }else{
          this.$notice.error(res.data.msg);
        }
     })
    },
    searchAdminUser(newAdminUser){
      var params = {
        keyword:newAdminUser
      }
      this.$http.get('/admin/search',{params:params}).then( response => {
        if(response.data.code==200 && response.data.data.items.length>0){
          this.modelUser=response.data.data;
        }else{
          this.modelUser=''
        }
      })
    },
    showSelect(id){
      this.shadowShow=true;
      this.shadowId = id;
    },
    cancleSelect(){
      this.modelUser=''
      this.shadowId=''
      this.adminUser=''
      this.shadowShow=false
    },
    deleteShadow(id){
      this.$http.delete('/shadow/'+id).then(res => {
        if(res.data.code==200){
          this.goUser();
          this.$emit('fresh',id);
          this.$notice.success('移除成功')
          this.goUser(this.page)
        }else{
          this.$notice.error(res.data.msg)
        }
      })
    }
  },
  components:{Pagepublic}
}
</script>
<style>
  .table td, .table th{
    padding: 5px;
    font-size: 13px;
  }
  .selecTagContainer .table thead th{
    border-bottom: 1px;
  }
  .show{
    display: block;
  }
  .select-user{
    font-size: 13px;
    color: #58c6ff;
  }
  .select-user:hover{
    color: #17b0ff;
  }
  .clear-model-user{
    font-size: 14px;
    line-height: 38px;
    margin-left: 20px;
  }
  .select-shadow-input{
    outline: none;
    border: 1px solid #ddd;
    padding: 5px 10px;
    font-size: 13px;
  }
</style>