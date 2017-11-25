<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">举报管理</li>
    </ol>
    <div class="biaoqing-container">
      <div class="biaoqing-table">
        <div 
          @click="goReport(page,'1')"
          class="btn cursor btn-outline-primary btn-sm mb-2" 
          :class="{'active':status=='1'}"
        >处理中</div>

        <div 
          @click="goReport(page,'0')"
          class="btn cursor btn-outline-primary btn-sm ml-2 mb-2"
          :class="{'active':status=='0'}"
        >已处理</div>

        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>举报目标</th>
              <th>举报类型</th>
              <th>举报内容</th>
              <th>处理状态</th>
              <th>提交时间</th>
              <th>提交用户</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report,index) in reports.items">
                <td class="max-width200">
                  <router-link 
                    v-if="report.type==1" 
                    :to="'/subjectdetail/'+report.valId">
                    {{report.valId}}
                  </router-link>

                  <router-link 
                    v-if="report.type==2" 
                    :to="'/comments?id='+report.valId"
                    :title="report.comments.content"
                    >
                    {{report.comments.content}}
                  </router-link>

                  <router-link 
                    v-if="report.type==3" 
                    :class="{'pass-ing':report.beReportUser.userType==5}"
                    :to="'/userdetail/'+report.valId">{{report.beReportUser.name}}</router-link>
                </td>
                <td>
                  <span v-if="report.type==1">表情</span>
                  <span v-if="report.type==2">评论</span>
                  <span v-if="report.type==3">用户</span>
                </td>
                <td class="max-width100">
                  <span :title="report.subContent">{{report.subContent}}</span>
                </td>
                <td>
                  <span v-if="report.status==0" class="pass-success">已处理</span>
                  <span @click="editReport(report.id)" v-if="report.status==1" class="pass-ing cursor">   处理中
                  </span>
                </td>
                <td>
                  <span>{{report.createTime}}</span>
                </td>
                <td style="width:200px;">
                  <router-link 
                    :to="'/userdetail/'+report.userId" 
                    :title="report.user.name"
                    :class="{'pass-ing':report.user.userType==5}"
                    >
                    {{report.user.name}}
                  </router-link>
                </td>
            </tr>
          </tbody>
        </table>
        <Pagepublic :pages="reports" @paging="goReport"></Pagepublic>
      </div>
    </div>
  </div>
</template>

<script>
  import { Report } from '../../resources'
  import {formatTime} from '../../misc/utils'
  import $ from 'jquery'
  import swal2 from 'sweetalert2'
  import Pagepublic from '../../widgets/pagepublic.vue'
  import querystring from 'querystring'
  export default {
    data: () => ({
      loading: false,
      reports:'',
      page:1,
      status:'1'
    }),
    beforeRouteEnter (to, from, next) {
      var params = {
        pageSize:10,
        pageNum:1,
        status:'1'
      }
      Promise.all([Report.list(params)]).then(([reports]) => {
        reports.data.data.items.forEach(item => {
          item.createTime=formatTime(item.createTime)
        })
        next(vm => {
          vm.reports = reports.data.data
        })
      })
    },
    mounted () {
      this.$emit('loaded')
    },
    methods: {
      goReport(page,status){
        this.$emit('loaded',true);
        var params = {
          pageSize:10,
          pageNum:page
        }
        if(status){
          params.status=status;
        }else{
          params.status=this.status;
        }

        Promise.all([Report.list(params)]).then(([reports]) => {
          this.$emit('loaded',false);
          reports.data.data.items.forEach(item => {
            item.createTime=formatTime(item.createTime)
          })
          this.status=params.status
          this.page=params.page;
          this.reports = reports.data.data
        })
      },
      editReport(id){
        var that = this;
        var params = {
          id:id,
          status:0
        }
        swal2({
          title: '请输入回复给用户的消息',
          text:'谨慎操作！',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showLoaderOnConfirm: true,
          reverseButtons:true,
            preConfirm:function(reason){
              return new Promise(function(resolve,reject){
                if(reason !=''){
                    params.replyContent=reason
                    params=querystring.stringify(params)
                    that.$http.put('/report/'+id,params).then(response => {
                        swal2.close();
                        if(response.data.code==200){
                          that.goReport(that.page)
                          that.$notice.success('删除成功');
                        }else{
                          that.$notice.error(response.data.msg);
                        }

                    })
                }else{
                  reject('请填写内容')
                }
              })
            }
        }).catch(swal2.noop);
      } //处理
    },
    
    components: {Pagepublic}
  }
</script>
