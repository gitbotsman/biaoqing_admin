<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">
      	<router-link class="aside-item" to="/subjectmanage" v-ripple.stop><span>表情管理</span></router-link>
      </li>
      <li class="breadcrumb-item">表情详情</li>
      <li class="breadcrumb-item cursor" @click="toBack">返回上一页</li>
    </ol>
    <div class="biaoqing-container flex p-2">
    	<div class="detail-img-box" :class="{'w470':albums.length!=1}">
    		<div v-if="albums.length==1" class="detail-img-single">
    			<img :src="detailData.fullCover">
    		</div>
    		<div v-else class="detail-img-do">
    			<span class="albums-container cursor" v-for="album in albums">
    				<span>
    					<img @click="lookimg(album.fullImage,album.imageWidth,album.imageHeight)" :src="album.fullImage" :style="album.style">
    				</span>
    			</span>
    		</div>
    	</div>
    	<div class="flex-item">
	    	<div class="detail-content-box row">
	        	<div class="col-sm-12" style="padding-left:0;padding-right:0;">
	              <div class="form-group-alt-attached">
	                <div class="row">
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                        <label>用户昵称</label>
	                        <span class="form-control color999 flex-center">
		                      	<router-link :to="'/userdetail/'+detailDataUser.id">{{detailDataUser.name}}</router-link>
	                  		</span>
	                    </div>
	                  </div>
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                    	<label>用户ID</label>
	                        <span class="form-control color999 flex-center">{{detailDataUser.id}}</span>
	                      	<span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-12">
	                    <div class="form-group form-group-alt">
	                      <label>内容</label>
	                      <span class="form-control color999 flex-center">{{detailData.content}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label>主题ID</label>
	                      <span class="form-control color999 flex-center">{{detailData.id}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label>专辑数量</label>
	                      <span class="form-control color999 flex-center">{{detailData.albumNum}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label class="flex-center">创建时间</label>
	                      <span class="form-control color999 flex-center">{{detailData.createTime}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-12">
	                    <div class="form-group form-group-alt">
	                      <label>发布平台</label>
	                      <span class="form-control color999 flex-center">{{detailData.source}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label>点赞数</label>
	                      <span class="form-control color999 flex-center">{{detailData.likedNum}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label>评论数</label>
	                      <span class="form-control color999 flex-center">{{detailData.commentNum}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	              </div>
	          	</div>
	        </div>
        </div>
    </div>
    <div v-if="shadow" class="comment-subject">
    	<div class="comment-subject-box">
	    	<div style="color:#666">我要评论</div>
			<textarea class="form-control mt-2" placeholder="评论内容" v-model="commentContent"></textarea>
	        <div class="mt-2 comment-subject-majia cleafloat">
				<button @click="toComment(detailData.id)" class="btn btn-sm fr btn-info ml-5">评论</button>
	        </div>
        </div>
    </div>
    <div class="detail-comment" v-if="comments.totalCount>0">
    	<div class="detail-comment-title mb-2">全部评论({{comments.totalCount}})</div>
    	<div class="comment-list" style="padding:10px;">
    		<table class="table table-bordered">
				<thead>
					<tr>
						<th class="tc">内容</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(comment,index) in comments.items">
						<td class="replay-container">
							<div class="flex flex-center">
								<router-link class="comment-user-tx" :to="'/userdetail/'+comment.user.id" >
									<img :src="comment.user.fullAvatar" />
								</router-link>
								<div class="comment-user-info">
									<router-link class="name" :to="'/userdetail/'+comment.user.id">
										{{comment.user.name}}
									</router-link>
									<p class="comment-p">
										<span class="" v-if="comment.replayUser">回复 
											<span class="pass-success">{{comment.replayUser.name}}: </span></span>
										<span :class="{'text-danger':(comment.user.userType=='5')}">{{comment.content}}</span>
									</p>
									<div class="comment-img" v-if="comment.images">
										<span v-for="img in comment.images">
											<img class="cursor"  
											     @click="lookimg(img.fullImage,img.imageWidth,img.imageHeight)" 
											     :src="img.fullImage" 
											     :style="img.style">
										</span>
									</div>
									<div class="comment-user-info-tool pr">
										<div class="pr" style="display:inline-block;">
											<div class="btn-group mr-4 ">
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
										<span @click="deleteComment(comment.id)" class="delete-comment cursor">删除评论</span>
										<span v-if="shadow" @click="replayComment" class="replay cursor">回复</span>
										<span class="time">{{comment.createTime}}</span>
									</div>
								</div>
							</div>
							<div v-if="shadow" class="mt-2 replay-input">
								<div>
									<input 
										@keyup.enter="addReplayComment(comment.id,comment.user.id)" 
										v-model="replayContent" 
										placeholder="请输入回复的内容" 
										type="text" class="form-control">
								</div>
								<div class="mt-2 clearfloat">
									<button @click="addReplayComment(comment.id,comment.user.id)" class="btn btn-sm fr btn-info ml-5">回复</button>
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
import '../../../static/css/biaoqing/biaoqing.css'
import { Subject } from '../../resources'
import { formatTime } from '../../misc/utils'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'
import {Shadow} from '../../resources'
import Pagepublic from '../../widgets/pagepublic.vue'

export default{
	data:() => ({
		shadow:Shadow.current(),
		loading: false,
		detailData:'',
		commentContent:'',
		page:1,
		albums:'',
		formPage:'',
		detailDataUser:'',
		comments:'',
		replayContent:'',
		subjectId:''
	}),
	beforeRouteEnter(to,form,next){
		var subjectId = to.params.id;
		var params = {
			id:subjectId,
			subjectId:subjectId
		}
		var request = [Subject.detail(params),Subject.album(params),Subject.comment(params)]
		Promise.all(request).then(([detail,albums,comments]) => {
			detail.data.data.createTime=formatTime(detail.data.data.createTime);
    		next(vm => {
    			albums.data.data.forEach(item => {
    				var imgW = item.imageWidth;
					var imgH = item.imageHeight;
					item.style=vm.formatStyle(imgW,imgH,150);
    			})

				comments.data.data.items.forEach(function(item,index){
					item.createTime=formatTime(item.createTime);
					if(item.images){
						item.images.forEach(img=>{
							img.style=vm.formatStyle(img.imageWidth,img.imageHeight,100);
						})
					}
				})
    			vm.subjectId=subjectId;
    			vm.comments=comments.data.data;
    			vm.albums=albums.data.data;
    			vm.detailData=detail.data.data;
    			vm.detailDataUser=detail.data.data.user;
    		})
		})
	},
	mounted () {
      	this.$emit('loaded',false)
    },
    methods: {
    	hiddenimg(){
    		$('.img-view-tc').fadeOut('fast');
    	},
    	closeReplayComment(){
    		this.replayContent='';
    	},
    	replayComment(e){
    		var replayInput = $(e.target).parents('.replay-container').find('.replay-input');
    		if(replayInput.hasClass('replay-input-opend')){
    			replayInput.removeClass('replay-input-opend')
    		}else{
    			$('.replay-input').removeClass('replay-input-opend');
    			replayInput.addClass('replay-input-opend')
    		}
    		this.closeReplayComment()
    	},
    	// 回复
    	addReplayComment(commentId,beReplyId){
    		var replayCommentId = commentId;
    		var beReplyId = beReplyId;
    		var replayContent = this.replayContent;
    		var subjectId = this.subjectId;
    		
    		var replayUserId=Shadow.current().selectShadow.user.id;
    		var data={
			  "beReplyCommentId": replayCommentId,
			  "beReplyId": beReplyId,
			  "content": replayContent,
			  "subjectId": subjectId,
			  "userId": replayUserId
			}
			this.$http.post('/comment',data).then(res => {
				if(res.data.code){
					this.closeReplayComment();
					this.goComments(this.page);
					this.$notice.success(res.data.msg)
				}else{
					this.$notice.error(res.data.msg)
				}
			})
    	},
    	// 评论
    	toComment(subjectid){
    		var commentContent = this.commentContent;
			var commentUserId=Shadow.current().selectShadow.user.id;

    		var data={
			  "content": commentContent,
			  "subjectId": subjectid,
			  "userId": commentUserId
			}
			this.$http.post('/comment',data).then(res => {
				if(res.data.code){
					this.commentContent='';
					this.goComments(this.page);
					this.$notice.success(res.data.msg)
				}else{
					this.$notice.error(res.data.msg)
				}
			})
			
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
    	},
    	goComments(page){
    		var $this = this;
    		this.$emit('loaded',true)
    		var subjectId=this.subjectId;
    		var params = {
				subjectId:subjectId,
				pageNum:page
			}
			Promise.all([Subject.comment(params)]).then(([comments]) => {
				this.$emit('loaded',false)
				$('body,html').animate({scrollTop:0},10);

				comments.data.data.items.forEach(function(item,index){
					item.createTime=formatTime(item.createTime);
					if(item.images){
						item.images.forEach(img=>{
							img.style=$this.formatStyle(img.imageWidth,img.imageHeight,100);
						})
					}
				})

				this.page=page;
				this.comments=comments.data.data;
			})
    	},
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
    	toBack(){
	        history.go(-1)
	     },
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
    	formatStyle(imgW,imgH,width){
			if (imgW>imgH){
				var ml = ((imgW/imgH)*width)/2
				var style="height:100%;left:50%;top: 0;margin-left: -"+ml+"px";
			}else if(imgW<imgH){
				var mt = ((imgH/imgW)*width)/2
				var style="width:100%;left:0;top: 50%;margin-top: -"+mt+"px";
			}else{
				var style="width:100%;height:100%";
			}
			return style;
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