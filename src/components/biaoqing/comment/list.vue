<template>
<div >
  <ol class="breadcrumb">
    <li class="breadcrumb-item">表情管理</li>
    <li class="breadcrumb-item">表情列表</li>
  </ol>
  <div class="biaoqing-container">
    <div class="biaoqing-table">
      <div class="pb-2">
        <div class="user-disable btn btn-sm btn-outline-primary cursor mr-2" :class="{'active':commentsParams.enable === ''}"
          @click="goComments(1,'all')">全部评论</div>
        <div class="user-disable btn btn-sm btn-outline-primary cursor mr-2" :class="{'active':commentsParams.enable === '1'}"
            @click="goComments(1,'1')">正常</div>
        <div class="user-disable btn btn-sm btn-outline-primary cursor" :class="{'active':commentsParams.enable === '0'}"
          @click="goComments(1,'0')">已删除</div>
      </div>
      <table class="table table-bordered ">
        <thead>
          <tr>
            <th>作品ID</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(comment,index) in comments.items">
            <td style="width:100px;">
              <router-link class="hover-line" :to="'/subjectdetail/'+comment.subjectId">{{comment.subjectId}}</router-link>
            </td>
            <td class="max-width500 normal-td">
              <router-link class="commentlist-user " :to="'/userdetail/'+comment.user.id">
                <div class="commentlist-user-tx mr-1">
                  <img :src="comment.user.fullAvatar">
                </div>
                <div class="commentlist-user-name" :class="{'pass-ing':comment.user.userType === 5}">{{comment.user.name}}</div>
              </router-link >
              <div class="commentlist-content ml-2">
                  <p>{{comment.content}}</p>
                  <div v-if="comment.images" class="comment-img">
                    <span v-for="img in comment.images">
                      <img 
                      @click="lookimg(img.fullImage,img.imageWidth,img.imageHeight)"
                      :src="img.fullImage" class="cursor" :style="img.style">
                    </span>
                  </div>
                  <!-- 被回复的人 -->
                  <div v-if="comment.beReplayUser" class="commentlist-replay-content ml-2 mt-2">
                    <router-link class="commentlist-user " :to="'/userdetail/'+comment.beReplayUser.id">
                      <div class="commentlist-user-tx mr-1">
                        <img :src="comment.beReplayUser.fullAvatar">
                      </div>
                      <div class="commentlist-user-name" :class="{'pass-ing':comment.beReplayUser.userType === 5}">{{comment.beReplayUser.name}}</div>
                    </router-link >
                    <p>{{comment.beReplyComment.content}}</p>
                    <div v-if="comment.beReplyComment.images" class="comment-img">
                      <span v-for="img in comment.beReplyComment.images">
                        <img 
                        class="cursor" 
                        @click="lookimg(img.fullImage,img.imageWidth,img.imageHeight)"
                        :src="img.fullImage" :style="img.style">
                      </span>
                    </div>
                  </div>
              </div>
              <div class="commentlist-bar clearfloat">
                <span class="time fr">{{comment.createTime}}</span>
                <span v-if="comment.enable" class="replay cursor fr pr-3 pass-success">回复</span>
                <span v-if="comment.enable" @click="deleteComment(comment.id)" class="delete-comment cursor fr hover-line">删除评论</span>
                <div class="pr fr" style="display:inline-block;">
                  <div class="btn-group mr-4">
                    <button type="button" data-toggle="dropdown" class="btn btn-outline-info  btn-sm dropdown-toggle" aria-expanded="false">
                      <span>禁言</span>
                    </button>
                    <div class="dropdown-menu">
                      <a @click="userBan(comment.user.id,'1',index,'ban')" class="dropdown-item">1天</a>
                      <a @click="userBan(comment.user.id,'3',index,'ban')" class="dropdown-item">3天</a>
                      <a @click="userBan(comment.user.id,'15',index,'ban')" class="dropdown-item">15天</a>
                      <a @click="userBan(comment.user.id,'-1',index,'ban')" class="dropdown-item">永久</a>
                      <div class="dropdown-divider"></div>
                      <a @click="deleteBan(comment.user.id,index,'ban')" class="dropdown-item">解除禁言</a>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagepublic :pages="comments" @paging="goComments"></Pagepublic>
    </div>


  </div>
  <div @click='hiddenimg' class="img-view-tc cursor"><img src=""></div>
</div>
</template>
<script>
  import '../../../../static/css/biaoqing/biaoqing.css'
  import '../../../../static/css/biaoqing/comments.css'
  import "../../../../static/js/divscroll.js"

  import { Subject,Comment,Shadow } from '../../../resources'
  import { formatTime,formatStyle } from '../../../misc/utils'
  import querystring from 'querystring'
  import swal2 from 'sweetalert2'
  import $ from 'jquery'
  import Pagepublic from '../../../widgets/pagepublic.vue'
  
  export default{
    data:() => ({
      shadow:Shadow.current(),
      loading: false,
      commentsParams:{
        enable:'1',
        page:1
      },
      
      comments:"",
      gifs:""
    }),
    beforeRouteEnter(to,form,next){
      var gif={
        pageSize:16,
        pageNum:1,
        keyword:'0'
      }
      var params = {
        pageSize:10,
        enable:'1'
      }
      var request = [Comment.comments(params),Subject.gif(gif)]
      Promise.all(request).then(([comments,gifs]) => {
        comments.data.data.items.forEach(function(item,index){
          item.createTime=formatTime(item.createTime);
          if(item.images){
            item.images.forEach(img=>{
              if(img){
                img.style=formatStyle(img.imageWidth,img.imageHeight,100);
              }
            })
          }
          if(item.beReplyComment && item.beReplyComment.images){
            item.beReplyComment.images.forEach(img=>{
              if(img){
                img.style=formatStyle(img.imageWidth,img.imageHeight,100);
              }
            })
          }

        })
        next(vm => {

        console.log(comments.data.data)
          vm.gifs = gifs.data.data.items;
          vm.comments=comments.data.data;
        })
      })
    },
    mounted () {
      this.$emit('loaded',false)
    },
    methods: {


      goComments(page,enable){
        const $this=this 
        var params={
          pageSize:10,
          pageNum:page
        }
        if(enable){
          enable=='all'? params.enable='' : params.enable=enable
        }else{
          params.enable=this.commentsParams.enable;
        }
        Promise.all([Comment.comments(params)]).then(([comments]) => {
          comments.data.data.items.forEach(function(item,index){
            item.createTime=formatTime(item.createTime);
            if(item.images){
              item.images.forEach(img=>{
                if(img){
                  img.style=formatStyle(img.imageWidth,img.imageHeight,100);
                }
              })
            }
            if(item.beReplyComment && item.beReplyComment.images){
              item.beReplyComment.images.forEach(img=>{
                if(img){
                  img.style=formatStyle(img.imageWidth,img.imageHeight,100);
                }
              })
            }
          })
          $this.commentsParams.page=page;
          $this.commentsParams.enable=params.enable;
          $this.comments=comments.data.data;
        })
      },
      // 删除评论
      deleteComment(id){
        var $this = this;
        var params={
          enable:true
        }
        swal({
          type: 'warning',
          title: '您确定?',
          text: '删除的记录将不能恢复!',
          showCancelButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '是的, 我要删除!',
          confirmButtonColor: '#DD6B55',
          showLoaderOnConfirm: true,
          closeOnConfirm: false
        }, function(){
          $this.$http.delete('/comment/'+id,{params:params}).then(response => {
            if(response.data.code==200){
              $this.goComments($this.page);
              $this.$notice.success('删除成功');
            }else{
              $this.$notice.error('删除失败');
            }
          })
          swal.close()
        })
      },
      // 禁言操作
      deleteBan(id,index,type){
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
      userBan(id,days,index,type){
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
      hiddenimg(){
        $('.img-view-tc').fadeOut('fast');
      },
      lookimg(src,width,height){
        var ml = width/2;
        var mt = height/2;
        $('.img-view-tc img').attr('src',src);
        $('.img-view-tc').fadeIn('fast');
        $('.img-view-tc img').css({
          'marginLeft':'-'+ml+'px',
          'marginTop':'-'+mt+'px'
        })
      }
    },//methods
    components:{Pagepublic}
  }


</script>
<style>
  .orange{
    color: #f47110;
  }
</style>
