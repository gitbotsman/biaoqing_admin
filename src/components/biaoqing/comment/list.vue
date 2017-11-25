<template>
<div >
  <ol class="breadcrumb">
    <li class="breadcrumb-item">表情管理</li>
    <li class="breadcrumb-item">表情列表</li>
  </ol>
  <div class="biaoqing-container" @click="closesendGif">
    <div class="biaoqing-table">
      <div class="pb-2 clearfloat flex flex-center">
        <div class="user-disable btn btn-sm btn-outline-primary cursor mr-2" :class="{'active':commentsParams.enable === ''}"
          @click="goComments(1,'all')">全部评论</div>
        <div class="user-disable btn btn-sm btn-outline-primary cursor mr-2" :class="{'active':commentsParams.enable === '1'}"
            @click="goComments(1,'1')">正常</div>
        <div class="user-disable btn btn-sm btn-outline-primary cursor" :class="{'active':commentsParams.enable === '0'}"
          @click="goComments(1,'0')">已删除</div>


        <div class="input-group ml-5" style="width:300px;">
            <input @keyup.enter="searchComments" type="text" class="form-control" v-model="search.userId" placeholder="输入用户ID">
            <span class="input-group-btn">
              <button @click="searchComments" class="btn btn-secondary" type="button">搜索</button>
            </span>
            
        </div>
        <span @click="clearSearch" class="cursor pass-success ml-2" style="font-size:14px;line-height:38px;">清除搜索</span>
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
            <td class="max-width500 normal-td commentlist-container">
              <router-link class="commentlist-user " :to="'/userdetail/'+comment.user.id">
                <div class="commentlist-user-tx mr-1">
                  <img :src="comment.user.fullAvatar">
                </div>
                <div class="commentlist-user-name" :class="{'pass-ing':comment.user.userType === 5}">{{comment.user.name}}</div>
              </router-link >
              <!-- 评论内容 -->
              <div class="commentlist-content ml-2">
                  <p>{{comment.content}}</p>
                  <div v-if="comment.images && comment.images.length>0" class="comment-img">
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
                    <div v-if="comment.beReplyComment.images && comment.beReplyComment.images.length>0" class="comment-img">
                      <span v-for="img in comment.beReplyComment.images">
                        <img 
                        class="cursor" 
                        @click="lookimg(img.fullImage,img.imageWidth,img.imageHeight)"
                        :src="img.fullImage" :style="img.style">
                      </span>
                    </div>
                  </div>
              </div>
              <!-- 操作 -->
              <div class="commentlist-bar clearfloat">
                <span class="time fr">{{comment.createTime}}</span>
                <span v-if="comment.enable && shadow" @click="replayComment" class="replay cursor fr pr-3 pass-success">回复</span>
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
              <!-- 回复框 -->
              <div v-if="shadow && comment.enable" class="m-2 replay-input pr replay-input-close">
                <div class="comment-input-gif clearfloat">
                  <input v-model="replayContent" placeholder="请输入回复的内容" type="text" class="form-control">
                  <!-- 选中的图片 -->
                  <div v-if="childSendGif.selectGif.commentid==comment.id" class="sendGif-select-child-container mb-2 mt-2 mr-5 fr pr">
                    <span class="gif-img-box cursor">
                      <img
                      @click="lookimg(
                      childSendGif.selectGif.fullImage,
                      childSendGif.selectGif.imageWidth,
                      childSendGif.selectGif.imageHeight)"

                      :src="childSendGif.selectGif.fullImage"
                      :style="childSendGif.selectGif.style">
                    </span>
                    <i @click="deleteChildGifImg" class="gif-img-box-delete"><img src="../../../../static/img/bianjiziliao_icon_cuowu.png" ></i>
                  </div>
                </div>
                <div class="mt-2 clearfloat">
                  <div @click="childTabGif" class="btn btn-sm btn-success cursor fl" style="font-size: 12px;">
                    GIF
                  </div> 
                  <button @click="addReplayComment(comment.id,comment.user.id,comment.subjectId)" class="btn btn-sm fr btn-info ml-5">回复</button>
                </div>
                <!-- 图片回复 -->
                <div @click="stop" class="gif-container" :class="{none:childSendGif.showSendGif==false}" style="bottom:38px;">
                  <div @scroll="tabGif" class="gif-container-box gif-child-box clearfloat">
                    <span @click="selectChildGifImg(index,comment.id)" v-for="(gif,index) in gifs" class="fl gif-img pr">
                      <span class="gif-img-box"><img :style="gif.style" :src="gif.fullImage"></span>
                      <i
                      v-if="
                      childSendGif.selectGif.commentid==comment.id &&
                      childSendGif.selectGif.id==gif.id" class="gifselect-icon">
                        <img src="../../../../static/img/select_img.png">
                      </i>
                    </span>
                    <div class="loading-gif">加载中...</div>
                  </div>
                  <div class="gif-container-bar">
                    <span @click="totabGif('0')" :class="{active:gifKey=='0'}">
                      <i class="ti-star pr-2" style="position:relative;top:-1px;"></i>最新</span>
                    <span @click="totabGif('1')" :class="{active:gifKey=='1'}">
                      <i class="ti-crown pr-2" style="position:relative;top:-1px;"></i>最热</span>
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
      search:{
        userId:'',
        keyword:''
      },
      commentsParams:{
        enable:'1',
        page:1
      },
      childSendGif:{
        showSendGif:false,
        selectGif:''
      },

      replayContent:'',
      comments:"",
      gifs:"",
      gifPage:1,
      gifKey:'0',
      flag:true
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
      if(to.query.id){
        params.keyword=to.query.id;
        params.enable='';
      }
      var request = [Comment.comments(params),Subject.gif(gif)]
      Promise.all(request).then(([comments,gifs]) => {
        comments.data.data.items.forEach(function(item,index){
          item.createTime=formatTime(item.createTime);
          gifs.data.data.items.forEach(img => {
            img.style=formatStyle(img.imageWidth,img.imageHeight,100);
          })
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
          vm.commentsParams.enable =params.enable
          vm.gifs = gifs.data.data.items;
          vm.comments=comments.data.data;
        })
      })
    },
    mounted () {
      this.$emit('loaded',false)
    },
    methods: {
      // 展开回复框
      replayComment(e){
        $('.gif-container-box').perfectScrollbar({cursorwidth:'7px'});
        var replayInput = $(e.target).parents('.commentlist-container').find('.replay-input');
        if(replayInput.hasClass('replay-input-opend')){
          replayInput.removeClass('replay-input-opend')
        }else{
          $('.replay-input').removeClass('replay-input-opend');
          replayInput.addClass('replay-input-opend')
        }
        this.replayInit()
      },
      replayInit(){
        this.replayContent='';
        this.childSendGif.selectGif=""
      },
      // 回复
      addReplayComment(commentId,beReplyId,subjectId){
        var replayCommentId = commentId;
        var beReplyId = beReplyId;
        var replayContent = this.replayContent;
        var selectGif = this.childSendGif.selectGif;
        var replayUserId=Shadow.current().selectShadow.user.id;
        var data={
          "beReplyCommentId": replayCommentId,
          "beReplyId": beReplyId,
          "content": replayContent,
          "subjectId": subjectId,
          "userId": replayUserId,
          "images": [
              {
                "albumId": selectGif.id,
                "subjectId": selectGif.subjectId
              }
          ]
        }
        if(replayContent !='' || selectGif!=''){
          this.$http.post('/comment',data).then(res => {
            if(res.data.code==200){
              $('.replay-input').removeClass('replay-input-opend')
              this.replayInit();
              this.goComments(this.commentsParams.page);
              this.$notice.success(res.data.msg)
            }else{
              this.$notice.error(res.data.msg)
            }
          })
        }
      },
      // 选择图片评论
      selectChildGifImg(index,commentid){
        var selectGif = this.gifs[index];
        selectGif.commentid=commentid;
        this.childSendGif.selectGif=selectGif
      },
      // 切换图片评论
      totabGif(key){
        var gif={
          pageSize:16,
          pageNum:1,
          keyword:key
        }
        Promise.all([Subject.gif(gif)]).then(([gifs]) => {
          gifs.data.data.items.forEach(item => {
              var imgW = item.imageWidth;
            var imgH = item.imageHeight;
            item.style=formatStyle(imgW,imgH,90);
            })
          this.gifs = gifs.data.data.items;
          this.gifPage = gif.pageNum;
          this.gifKey = gif.keyword;
        })
      },
      // 滚动图片评论
      tabGif(e){
        var itemLength = $(e.target).find('.gif-img').length;
        var gifHeight = Math.ceil(itemLength/4)*90 - parseInt($(e.target).height());
        var gifScrollTop = $(e.target).scrollTop()
        var flag = this.flag;

        if(gifScrollTop>gifHeight && flag){
          this.flag=false
          var key = this.gifKey;
          var page = this.gifPage+1;
          var gif={
            pageSize:16,
            pageNum:page,
            keyword:key
          }
          $('.loading-gif').css('display','block')
          var request = [Subject.gif(gif)]
          Promise.all(request).then(([gifs]) => {
            gifs.data.data.items.forEach(item => {
                var imgW = item.imageWidth;
              var imgH = item.imageHeight;
              item.style=formatStyle(imgW,imgH,90);
              })
            $('.loading-gif').css('display','none')
            this.flag=true
            var oldGif = this.gifs;
            this.gifs = oldGif.concat(gifs.data.data.items);
            this.childSendGif.sendGifs = oldGif.concat(gifs.data.data.items);

            this.gifKey = gif.keyword;
            this.gifPage = gif.pageNum;
          })
        }
      },
      // 打开和关闭图片评论
      deleteChildGifImg(){
        this.childSendGif.selectGif=""
      },
      stop(e){
        e.stopPropagation();
      },
      closesendGif(e){
        this.childSendGif.showSendGif=false;
        this.sendGif=false
        e.stopPropagation();
      },
      childTabGif(e){
        this.childSendGif.showSendGif=!this.childSendGif.showSendGif
        e.stopPropagation();
      },
      // 搜索评论
      searchComments(userid,keyword){
        var $this = this;
        var id  = this.search.userId
        var params={
          pageSize:10,
          pageNum:1,
          userId:id
        }
        
        // if(userid && userid!='') params.userId=userid;
        // if(keyword && keyword!='') params.keyword=keyword;
        console.log(params)
        Promise.all([Comment.comments(params)]).then(([comments]) => {
          
          if(comments.data.data){
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
          }
          $this.search.userId = params.userId
          $this.commentsParams.page=params.pageNum;
          $this.commentsParams.enable='';
          $this.comments=comments.data.data;
        })
      },
      clearSearch(){
        this.search.userId=''
        this.goComments(1)
      },
      // 刷新评论
      goComments(page,enable){
        this.replayInit();
         $('.replay-input').removeClass('replay-input-opend');
        const $this=this 
        var params={
          pageSize:10,
          pageNum:page
        }
        if(this.search.userId !=''){ params.userId=this.search.userId }

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
              $this.goComments($this.commentsParams.page);
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
