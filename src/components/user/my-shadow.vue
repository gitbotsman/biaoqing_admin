<template>
<div>
  <ol class="breadcrumb">
    <li class="breadcrumb-item">我的马甲</li>
  </ol>
  <div class="biaoqing-container">
    <div class="biaoqing-table" v-if="shadowList !==''">
      <table class="table table-bordered table-hover">
        <thead>
            <tr>
              <th>头像</th>
              <th>马甲ID</th>
              <th>用户名</th>
              <th>账号</th>
              <th>注册时间
              </th>
              <th>粉丝数
              </th>
              <th>关注数
              </th>
              <th>作品数
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user,index) in shadowList">
              <td class="img-view" style="vertical-align: middle;">
                <div class="full-avatar pr">
                  <img class="biaoqing-list-cover-img" style="display:block;" :src="[user.user.fullAvatar]">
                  <span v-if="user.user.userType=='3' || user.user.userType=='2'" class="auth_icon_wb"></span>
                </div>
              </td>
              <td>{{user.id}}</td>
              <td class="max-width100">
                <span class="biaoqing-table-content" :title="user.name">{{user.user.name}}</span>
              </td>
              <td class="max-width20" :title="user.phone">
                {{user.user.phone}}
              </td>
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
              <td><span @click="deleteShadow(user.id)" class="hover-line cursor text-danger">移除</span></td>
            </tr>
          </tbody>
      </table>
    </div>
    <div class="biaoqing-table" v-else>
      <h6 class="text-success">您还没有马甲号</h6>
    </div>
  </div>
</div>

</template>

<script>
import '../../../static/css/biaoqing/user.css'
import '../../../static/css/biaoqing/biaoqing.css'
import { Shadow } from '../../resources'
import { formatTime } from '../../misc/utils'

export default {
  data: () => ({
    loading: false,
    formPage:'',
    page:'1',
    shadowList:''
  }),
  beforeRouteEnter (to,form,next) {
    var params={}
    var request = [Shadow.my(params)]
    Promise.all(request).then(([shadowList]) => {
      for(var i = 0;i<shadowList.data.data.length;i++){
        shadowList.data.data[i].createTime=formatTime(shadowList.data.data[i].createTime)
      }
      next(vm=>{
        vm.shadowList=shadowList.data.data;
      })
    })
  },
  mounted () {
    this.$emit('loaded')
  },
  methods: {
    goUser(page){
      this.$emit('loaded',true)
      var params={
        pageNum:page
      }
      this.$http.get('/shadow/all',{params:params}).then(shadowList => {
        this.$emit('loaded',false)
        for(var i = 0;i<shadowList.data.data.length;i++){
          shadowList.data.data[i].createTime=formatTime(shadowList.data.data[i].createTime)
        }
        this.page=page;
        this.shadowList=shadowList.data.data;
      })
    },
    deleteShadow(id){
      this.$http.delete('/shadow/'+id).then(res => {
        if(res.data.code==200){
          this.goUser(this.page);
          this.$notice.success('移除成功')
        }else{
          this.$notice.error(res.data.msg)
        }
      })
    }
  }
}
</script>
