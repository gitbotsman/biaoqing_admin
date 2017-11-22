<template>
  <div class="d-flex flex-column">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">认证申请列表</li>
    </ol>
    <div class="biaoqing-container p-2">
      <!-- <div class="task-title">批量点赞</div> -->
      <div class="biaoqing-table">
        <table class="table table-hover">
          <thead>
          <tr>
            <th>申请用户</th>
            <th>姓名</th>
            <th>电话</th>
            <th>认证描述</th>
            <th>审核状态</th>
            <th>审核</th>
            <th>IP地址</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in records.items">
            <td><router-link :title="item.user.name" :to="'/userDetail/'+item.user.id">{{item.user.name}}</router-link></td>
            <td>{{item.name}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.summary}}</td>
            <td>
              <span class="text-info" v-if="item.audit == 0"> 审核中 </span>
              <span class="pass-ing" v-if="item.audit == 1"> 通过 </span>
              <span class="text-danger" v-if="item.audit == -1"> 失败 </span>
            </td>
            <td>
              <router-link :title="item.id" :to="'/verify/'+item.id">
                <span v-if="item.audit == 1"> {{item.admin.name}} </span>
                <span v-if="item.audit == 0"> 审核 </span>
              </router-link>
            </td>
            <td>{{item.clientHost}}</td>

            <!--<td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">-->
              <!--<div class="biaoqing-list-cover">-->
                <!--<img class="biaoqing-list-cover-img" :data-height="like.subject.coverHeight" :data-width="like.subject.coverWidth" :src="[like.subject.fullCover+'!thumb240']">-->
              <!--</div>-->
            <!--</td>-->
            <td>{{item.createTime}}</td>
            <td style="width: 70px !important;">
              <span class="cursor hover-line text-danger" @click="">演习</span>
            </td>
          </tr>
          </tbody>
        </table>
        <Pagepublic :pages="records" @paging="goPage"></Pagepublic>
      </div>
    </div>
  </div>
</template>
<script>
  import { UserVerify } from '../../../resources'
  import Pagepublic from '../../../widgets/pagepublic.vue'
  import { formatTime,viewImg, clearViewImg } from '../../../misc/utils'
  import $ from 'jquery'

  export default {
    data: () => ({
      loading: 0,
      records:'',
      pageCurrent:1
    }),
    beforeRouteEnter (to, from, next) {
      var params={
        pageSize:10
      }
      var request = [UserVerify.verifies(params)]
      Promise.all(request).then(([res]) => {
        res.data.data.items.forEach(item => {
          item.createTime=formatTime(item.createTime)
        })
        next(vm =>{
          vm.records=res.data.data;
        })
      })

    },
    mounted () {
      this.$emit('loaded',false)
    },
    methods: {
      clearbigImg(e){clearViewImg(e)},
      bigImg(e){viewImg(e,300)},
      goPage(page){
        this.$emit('loaded',true)
        var params={
          pageSize:10,
          pageNum:page
        }
        Promise.all([Task.liked(params)]).then(([res]) => {
          this.$emit('loaded',false)
          res.data.data.items.forEach(item => {
            item.createTime=formatTime(item.createTime)
          })
          this.pageCurrent = page;
          this.records=res.data.data;
        })
      },
      setAudit(userId,audit) {
        console.log(userId,audit)
      }


    },
    components:{Pagepublic}
  }
</script>

