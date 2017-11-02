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
	                      <span class="form-control color999 flex-center">{{detailDataUser.name}}</span>
	                      <span></span>
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
    <div class="comment-subject">
    	<div class="comment-subject-box">
	    	<div style="color:#666">我要评论</div>
			<textarea class="form-control mt-2" placeholder="评论内容" v-model="commentContent"></textarea>
	        <div class="mt-2 comment-subject-majia cleafloat">
	        	<input type="text" class="form-control fl comment-subject-majia-input" style="padding: .3rem .75rem;" placeholder="马甲号ID" v-model="commentUserId">
				<button @click="toComment(detailData.id)" class="btn btn-sm fr btn-info ml-5">评论</button>
	        </div>
        </div>
    </div>
    <div class="detail-comment" v-if="comments.totalCount>0">
    	<div class="detail-comment-title mb-2">全部评论({{comments.totalCount}})</div>
    	<div class="comment-list">
    		<table class="table table-bordered">
				<thead>
					<tr>
						<th class="select-comment" style="width:50px;">选择</th>
						<th class="tc">内容</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(comment,index) in comments.items">
						<td class="select-comment">
							<div class="select-comment-input">
								<input  type="checkbox" name="select">
							</div>
						</td>
						<td>
							<div class="flex flex-center">
								<div class="comment-user-tx">
									<img :src="comment.user.fullAvatar" />
								</div>
								<div class="comment-user-info">
									<p class="name">{{comment.user.name}}</p>
									<p class="comment-p">
										<span class="" v-if="comment.replayUser">回复 <span class="pass-success">{{comment.replayUser.name}}: </span></span>
										{{comment.content}}
									</p>
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
										<span @click="replayComment(comment.id,comment.user.id)" class="replay cursor">回复</span>
										<span class="time">{{comment.createTime}}</span>
									</div>
								</div>
							</div>
							

						</td>
					</tr>
				</tbody>
    		</table>
    		<nav v-if="comments.lastPageNumber!=1" aria-label="Page navigation example " class="">
			  <ul class="pagination">
			    <li v-if="!comments.firstPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Previous" 
			      @click="goComments(comments.prevPageNumber)">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>
			    <!-- 回到第一页 -->
			    <template v-if="(comments.pageNumber-4)>1">
			    	<li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goComments(1)">1</a>
				    </li>
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
			    </template>
			    <template v-for="page in comments.pageNumbers">
				    <li class="page-item" :class="{active:(page==comments.pageNumber)}">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goComments(page)">{{page}}</a>
				    </li>
				</template>
				<!-- 回到最后一页 -->
				 <template v-if="(comments.pageNumber+4+1)<comments.lastPageNumber">
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goComments(comments.lastPageNumber)">{{comments.lastPageNumber}}</a>
				    </li>
			    </template>

			    <li v-if="!comments.lastPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Next"
			      @click="goComments(comments.nextPageNumber)">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			    <div class="input-group page-input">
				  <input @keyup.enter="goComments(formPage)" type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
				  <button class="input-group-addon" id="basic-addon2" @click="goComments(formPage)">Go</button>
				</div>
			  </ul>
			</nav>
    	</div>
    </div>
    <div @click='hiddenimg' class="img-view-tc cursor"><img src=""></div>
	<div class="mask replay-comment-container" :class="{'block':(replayCommentId!='')}">
		<div @click="closeReplayComment" class="mask-bg"></div>
		<div class="mask-main replay-comment">
			<div class="add-banner-mask-input mb-3 mt-2">
				<div  class="md-form-group pr" :class="[replayContent==''?'md-float-label':'']" style="padding-bottom:0;">
		          <input @keyup.enter="" class="md-input pr" v-model="replayContent" > <label>回复的内容</label>
		        </div>
				<div  class="md-form-group pr mt-2" :class="[replayUserId==''?'md-float-label':'']" style="padding-bottom:0;">
		          <input @keyup.enter="" class="md-input pr" v-model="replayUserId" > <label>马甲号ID</label>
		        </div>
			</div>
			<div class="add-banner-mask-btn mt-3">
				<button @click="closeReplayComment" class="btn mr-3 btn-secondary">取消</button>
				<button @click="addReplayComment" class="btn btn-primary">评论</button>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { Subject } from '../../resources'
import { formatTime } from '../../misc/utils'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'

export default{
	data:() => ({
		loading: false,
		detailData:'',
		commentContent:'',
		commentUserId:'',
		page:1,
		albums:'',
		formPage:'',
		detailDataUser:'',
		comments:'',
		replayCommentId:'',
		replayUserId:'',
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
			for(var i=0;i<albums.data.data.length;i++){
				var imgW = albums.data.data[i].imageWidth;
				var imgH = albums.data.data[i].imageHeight;
				if (imgW>imgH){
					var ml = ((imgW/imgH)*150)/2
					var style="height:100%;left:50%;top: 0;margin-left: -"+ml+"px";
				}else if(imgW<imgH){
					var mt = ((imgH/imgW)*150)/2
					var style="width:100%;left:0;top: 50%;margin-top: -"+mt+"px";
				}else{
					var style="width:100%;height:100%";
				}
				albums.data.data[i].style=style;
			}
			for(var j=0;j<comments.data.data.items.length;j++){
				comments.data.data.items[j].createTime=formatTime(comments.data.data.items[j].createTime);
			}
    		next(vm => {
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
    		this.replayCommentId='';
    		this.replayContent='';
    		this.replayUserId='';
    		this.beReplyId = '';
    	},
    	replayComment(commentId,beReplyId){
    		this.replayCommentId=commentId;
    		this.beReplyId = beReplyId;
    	},
    	// 回复
    	addReplayComment(){
    		var replayCommentId = this.replayCommentId;
    		var replayContent = this.replayContent;
    		var replayUserId = this.replayUserId;
    		var subjectId = this.subjectId;
    		var beReplyId = this.beReplyId;
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
			var commentUserId = this.commentUserId;
    		var data={
			  "content": commentContent,
			  "subjectId": subjectid,
			  "userId": commentUserId
			}
			this.$http.post('/comment',data).then(res => {
				if(res.data.code){
					this.commentUserId='';
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
    		this.$emit('loaded',true)
    		var subjectId=this.subjectId;
    		var params = {
				subjectId:subjectId,
				pageNum:page
			}
			Promise.all([Subject.comment(params)]).then(([comments]) => {
				this.$emit('loaded',false)
				$('body,html').animate({scrollTop:0},10);
				for(var j=0;j<comments.data.data.items.length;j++){
					comments.data.data.items[j].createTime=formatTime(comments.data.data.items[j].createTime);
				}
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
    	}
    }
}


</script>