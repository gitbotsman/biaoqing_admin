<template>
  <div class="d-flex flex-column">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">定时任务</li>
    </ol>
    <div class="biaoqing-container p-2">
      <!-- <div class="task-title">批量点赞</div> -->
      <div class="biaoqing-table">
        <table class="table table-hover">
            <thead>
              <tr>
                <th>目标</th>
                <th>目标ID</th>
                <th>目标用户</th>
                <th>操作类型</th>
                <th>执行人</th>
                <th>执行时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(like,index) in likes.items">
                <td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">
                  <div class="biaoqing-list-cover">
                    <img class="biaoqing-list-cover-img" :data-height="like.subject.coverHeight" :data-width="like.subject.coverWidth" :src="[like.subject.fullCover+'!thumb240']">
                  </div>
                </td>
                <td>
                  <router-link :to="'/subjectdetail/'+like.subject.id">{{like.subject.id}}</router-link>
                </td>
                <td>  
                  <router-link :title="like.subject.user.name" :to="'/userDetail/'+like.subject.user.id"
                  >
                    {{like.subject.user.name}}
                  </router-link>
                </td>
                <td>点赞</td>
                <td>
                  <router-link class="text-success" :title="like.user.name" :to="'/userDetail/'+like.user.id"
                  >
                    {{like.user.name}}
                  </router-link>
                </td>
                <td>{{like.taskTime}}</td>
                <td style="width: 70px !important;">
                  <span class="cursor hover-line text-danger" @click="deleteTask(like.cacheKey)">移除</span>
                </td>
              </tr>
            </tbody>
        </table>
        <Pagepublic :pages="likes" @paging="goPage"></Pagepublic>
      </div>
    </div>
  </div>
</template>
<script>
  import { Task } from '../../resources'
  import Pagepublic from '../../widgets/pagepublic.vue'
  import { formatTime,viewImg, clearViewImg } from '../../misc/utils'
  import $ from 'jquery'

  export default {
    data: () => ({
      loading: 0,
      likes:'',
      pageCurrent:1
    }),
    beforeRouteEnter (to, from, next) {
      var params={
        pageSize:10,
        sort:"task_time",
        asc:true
      }
      var request = [Task.liked(params)]
      Promise.all(request).then(([likes]) => {
        likes.data.data.items.forEach(item => {
          item.taskTime=formatTime(item.taskTime)
        })
        next(vm =>{
          vm.likes=likes.data.data;
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
        Promise.all([Task.liked(params)]).then(([likes]) => {
          this.$emit('loaded',false)
          likes.data.data.items.forEach(item => {
            item.taskTime=formatTime(item.taskTime)
          })
          this.pageCurrent = page;
          this.likes=likes.data.data;
        })
      },
      deleteTask(key){
        var $this =this;
        swal({
          type: 'warning',
          title: '您确定?',
          text: '移除该任务吗!',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          confirmButtonColor: '#DD6B55',
          showLoaderOnConfirm: true,
          closeOnConfirm: false
        },function(){
          swal.close()
          var params={
            cacheKey:key
          }
          
          $this.$http.delete('/subject/liked',{params:params}).then(res =>{
            if(res.data.code==200){
              $this.goPage($this.pageCurrent)
              $this.$notice.success("移除成功")
            }else{
              $this.$notice.error(res.data.msg)
            }
          })

        })
        
      }
    },
    components:{Pagepublic}
  }
</script>

