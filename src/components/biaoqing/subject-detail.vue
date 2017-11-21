<template>
<div class="detail-container" @click="closesendGif">
	<ol class="breadcrumb">
      <li class="breadcrumb-item">
      	<router-link class="aside-item" to="/subjectmanage" v-ripple.stop><span>表情管理</span></router-link>
      </li>
      <li class="breadcrumb-item">表情详情</li>
      <li class="breadcrumb-item cursor" @click="toBack">返回上一页</li>
    </ol>
    <div v-if="shadow" class="biaoqing-container pt-2 pb-2">
    	<button @click="openPrise" class="btn btn-sm btn-info">一键点赞</button>
    </div>
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
    <div v-if="shadow" class="comment-subject clearfloat">
    	<div class="comment-subject-box pr fl">
	    	<div style="color:#666">我要评论</div>
			<textarea class="form-control mt-2" placeholder="评论内容" v-model="commentContent"></textarea>
	        <div class="mt-2 comment-subject-majia clearfloat">
	        	<div @click="showGif" class="btn  btn-sm btn-success cursor fl"><i class="ti-heart pr-2"></i>GIF</div>
				<button @click="toComment(detailData.id)" class="btn btn-sm fr btn-info ml-5">评论</button>
	        </div>

	        <div @click="stop" class="gif-container" :class="{none:sendGif==false}">
	        	<div @scroll="tabGif" class="gif-container-box clearfloat">
	        		<span @click="selectGifImg(index)" v-for="(gif,index) in gifs" class="fl gif-img pr">
	        			<span class="gif-img-box "><img :style="gif.style" :src="gif.fullImage"></span>
	        			<i v-if="selectGif.id==gif.id" class="gifselect-icon"><img src="../../../static/img/select_img.png"></i>
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
        <div v-if="selectGif!=''" class="sendGif-select-container fl pr">
        	<span class="gif-img-box cursor">
        		<img @click="lookimg(selectGif.fullImage,selectGif.imageWidth,selectGif.imageHeight)" :src="selectGif.fullImage" :style="selectGif.style">
        	</span>
        	<div class="color999" style="text-align:center;font-size:12px;">（点击放大）</div>
        	<i @click="deleteGifImg" class="gif-img-box-delete"><img src="../../../static/img/bianjiziliao_icon_cuowu.png" ></i>
        </div>
    </div>
    <div class="detail-comment" v-if="comments.totalCount>0">
    	<div class="detail-comment-title mb-2">全部评论({{comments.totalCount}})</div>

      <div @click="goComments(1)" class="user-disable btn btn-sm btn-outline-primary" :class="{active:enable == ''}" style="margin-right:10px;">全部评论{{enable}}</div>
      <div @click="goComments(1,1)" class="user-disable btn btn-sm btn-outline-primary" :class="{active:enable == 1}" style="margin-right:10px;">正常</div>
      <div @click="goComments(1,0)" class="user-disable btn btn-sm btn-outline-primary" :class="{active:enable == 0}" style="margin-right:10px;">已删除</div>
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
									<router-link class="name" :class="{'text-success':(comment.user.userType=='5')}" :to="'/userdetail/'+comment.user.id">
										{{comment.user.name}}
									</router-link>
									<p class="comment-p">
										<span v-if="comment.beReplayUser">回复
											<router-link class="pass-success" :to="'/userdetail/'+comment.beReplayUser.id">
												{{comment.beReplayUser.name}}:
											</router-link>
										</span>
										<span>{{comment.content}}</span>
									</p>
									<span v-if="comment.images">
									<div v-for="img in comment.images"  v-if="img" class="comment-img">
										<span>
											<img class="cursor"
											     @click="lookimg(img.fullImage,img.imageWidth,img.imageHeight)"
											     :src="img.fullImage"
											     :style="img.style">
										</span>
									</div>
									</span>
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
							<div v-if="shadow" class="mt-2 replay-input pr">
								<div class="comment-input-gif clearfloat">
									<input
										@keyup.enter="addReplayComment(comment.id,comment.user.id)"
										v-model="replayContent"
										placeholder="请输入回复的内容"
										type="text" class="form-control">
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
							        	<i @click="deleteChildGifImg" class="gif-img-box-delete"><img src="../../../static/img/bianjiziliao_icon_cuowu.png" ></i>
							        </div>
								</div>
								<div class="mt-2 clearfloat">
									<div @click="childTabGif" class="btn btn-sm btn-success cursor fl" style="font-size:12px;">
										<i class="ti-heart pr-2"></i>GIF
									</div>
									<button @click="addReplayComment(comment.id,comment.user.id)" class="btn btn-sm fr btn-info ml-5">回复</button>
								</div>
								<!-- 回复图片 -->
								<div @click="stop" class="gif-container" :class="{none:childSendGif.showSendGif==false}" style="bottom:38px;">
						        	<div @scroll="tabGif" class="gif-container-box gif-child-box clearfloat">
						        		<span @click="selectChildGifImg(index,comment.id)" v-for="(gif,index) in gifs" class="fl gif-img pr">
						        			<span class="gif-img-box"><img :style="gif.style" :src="gif.fullImage"></span>
						        			<i
						        			v-if="
						        			childSendGif.selectGif.commentid==comment.id &&
						        			childSendGif.selectGif.id==gif.id" class="gifselect-icon">
						        				<img src="../../../static/img/select_img.png">
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

	<div v-if="shadow" class="mask" :class="{none: openShadow}">
		<div class="mask-bg" @click="closePrise"></div>
		<div class="praise-all mask-main">
			<div class="praise-item flex">
				<span class="praise-title mt-1">选择马甲:</span>
				<div class="ml-1 flex-item">
				    <div class="praise-shadow-select-box  clearfloat">
				    	<div v-for="(item,index) in shadow.shadow" @click="selectPrise(item.id)" class="praise-shadow-select clearfloat cursor">
				    		<span class="fl" :title="item.user.name">{{item.user.name}}</span>
				    		<i class="check-shadow mt-1" :class="{'active':(praiseShadow.indexOf(item.id)>=0)}"></i>
				    	</div>
				    </div>
			    </div>
			</div>
			<div class="praise-item mt-2 flex">
				<span class="praise-title mt-1">指定天数:</span>
				<input v-model="days" type="text" class="form-control ml-2 flex-item border" placeholder="指定天内随机">
			</div>
			<div class="praise-btn mt-3">
				<button @click="closePrise" class="btn btn-sm btn-secondary mr-3">取消</button>
				<button @click="toPrise" class="btn btn-sm btn-primary">确定</button>
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
import { Shadow } from '../../resources'
import Pagepublic from '../../widgets/pagepublic.vue'
import "../../../static/js/divscroll.js"

export default{
	data:() => ({
		shadow:Shadow.current(),
		loading: false,
		flag:true,
		sendGif:false,
		detailData:'',
		commentContent:'',
		page:1,
		albums:'',
		formPage:'',
		detailDataUser:'',
		comments:'',
		replayContent:'',
		subjectId:'',
		praiseShadow:[],
		openShadow:true,
		days:'',
		gifs:'',
		gifPage:1,
		gifKey:'0',
		selectGif:'',
    enable:'',
		childSendGif:{
			showSendGif:true,
			selectGif:"",
		}
	}),
	beforeRouteEnter(to,form,next){
		var subjectId = to.params.id;
		var params = {
			id:subjectId,
			subjectId:subjectId
		}
		var gif={
			pageSize:16,
			pageNum:1,
			keyword:'0'
		}
		var request = [
		Subject.detail(params),
		Subject.album(params),
		Subject.comment(params),
		Subject.gif(gif)]
		Promise.all(request).then(([detail,albums,comments,gifs]) => {
			detail.data.data.createTime=formatTime(detail.data.data.createTime);
    		next(vm => {
    			albums.data.data.forEach(item => {
    				var imgW = item.imageWidth;
					var imgH = item.imageHeight;
					item.style=vm.formatStyle(imgW,imgH,150);
    			})
    			gifs.data.data.items.forEach(item => {
    				var imgW = item.imageWidth;
					var imgH = item.imageHeight;
					item.style=vm.formatStyle(imgW,imgH,90);
    			})

				comments.data.data.items.forEach(function(item,index){
					item.createTime=formatTime(item.createTime);
					if(item.images){
						item.images.forEach(img=>{
							if(img){
								img.style=vm.formatStyle(img.imageWidth,img.imageHeight,100);
							}
						})
					}
				})
				console.log(comments)
				vm.gifs = gifs.data.data.items;
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
      	$('.gif-container-box').perfectScrollbar({cursorwidth:'7px'});
    },
    methods: {
    	// 图片评论
    	selectGifImg(index){
    		var gifs = this.gifs;
			var imgW = this.gifs[index].imageWidth;
			var imgH = this.gifs[index].imageHeight;
			var selectGif = this.gifs[index];
			selectGif.style=this.formatStyle(imgW,imgH,120);

    		this.selectGif=this.gifs[index]
    	},
    	selectChildGifImg(index,commentid){
    		var selectGif = this.gifs[index];
    		selectGif.commentid=commentid;
    		this.childSendGif.selectGif=selectGif
    	},
    	deleteChildGifImg(){
    		this.childSendGif.selectGif=""
    	},
    	deleteGifImg(){
    		this.selectGif=''
    	},
    	stop(e){
    		e.stopPropagation();
    	},
    	childTabGif(e){
			this.childSendGif.showSendGif=!this.childSendGif.showSendGif
    		e.stopPropagation();
    	},
    	showGif(e){
    		this.sendGif=!this.sendGif;
    		e.stopPropagation();
    	},
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
					item.style=this.formatStyle(imgW,imgH,90);
    			})
				this.gifs = gifs.data.data.items;
				this.gifPage = gif.pageNum;
				this.gifKey = gif.keyword;
			})
    	},
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
						item.style=this.formatStyle(imgW,imgH,90);
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
    	closesendGif(e){
    		this.childSendGif.showSendGif=false;
    		this.sendGif=false
    		e.stopPropagation();
    	},
    	// 一键点赞
    	openPrise(){this.openShadow=false},
    	closePrise(){
    		this.openShadow=true;
    		this.days="";
			this.praiseShadow=[];
			$('.check-input').removeAttr('checked')
    	},
    	selectPrise(id){
    		var praiseShadow = this.praiseShadow;
    		var index = praiseShadow.indexOf(id);
			if(index>=0){
				praiseShadow.splice(index,1)
			}else{
				praiseShadow.push(id)
			}
    	},
    	toPrise(){
    		var subjectId = this.subjectId;
    		var praiseShadow = this.praiseShadow;
    		var days = this.days;
    		if (praiseShadow.length>0 && days!=''){
    			var params = {
    				shadowIds:praiseShadow,
    				subjectId:subjectId,
    				day:days
    			}
    			params=querystring.stringify(params)
    			this.$http.post('/subject/liked',params).then(res => {
    				if(res.data.code==200){
    					this.closePrise();
    					this.$notice.success('请求成功')
    				}else{
    					this.$notice.error(res.data.msg)
    				}
    			})
    		}else{
    			this.$notice.error('信息不完整')
    		}
    	},
    	// 一键点赞 end
    	closeShadow(index){
    		this.praiseShadow.splice(index,1)
    	},
    	hiddenimg(){
    		$('.img-view-tc').fadeOut('fast');
    	},
    	closeReplayComment(){
    		this.replayContent='';
    	},
    	replayComment(e){
    		this.deleteChildGifImg()
    		$('.gif-container-box').perfectScrollbar({cursorwidth:'7px'});
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
			if(replayCommentId!='' || selectGif!=''){
				this.$http.post('/comment',data).then(res => {
					if(res.data.code){
						$('.replay-input').removeClass('replay-input-opend')
						this.closeReplayComment();
						this.goComments(this.page);
						this.$notice.success(res.data.msg)
					}else{
						this.$notice.error(res.data.msg)
					}
				})
			}
    	},
    	// 评论
    	toComment(subjectid){
    		var commentContent = this.commentContent;
			var commentUserId=Shadow.current().selectShadow.user.id;
			var selectGif=this.selectGif;
			if(commentContent!='' || selectGif!=''){
				var data={
				  "content": commentContent,
				  "subjectId": subjectid,
				  "userId": commentUserId,
				  "images": [
					    {
					      "albumId": selectGif.id,
					      "subjectId": selectGif.subjectId
					    }
					]
				}
				this.$http.post('/comment',data).then(res => {
					if(res.data.code){
						$('.replay-input').removeClass('replay-input-opend')
						this.commentContent='';
						this.selectGif="";
						this.goComments(this.page);
						this.$notice.success(res.data.msg)
					}else{
						this.$notice.error(res.data.msg)
					}
				})
			}
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
    	goComments(page,enable){
    		var $this = this;
    		this.$emit('loaded',true)
    		var subjectId=this.subjectId;
    		var params = {
          subjectId:subjectId,
          pageNum:page
        }

        if (enable != null || enable != '') {
    		  params.enable = enable
        }

        console.dir(params)

        Promise.all([Subject.comment(params)]).then(([comments]) => {
          this.$emit('loaded',false)
          $('body,html').animate({scrollTop:0},10);

          comments.data.data.items.forEach(function(item,index){
            item.createTime=formatTime(item.createTime);
            if(item.images){
              item.images.forEach(img=>{
                if(img){
                  img.style=$this.formatStyle(img.imageWidth,img.imageHeight,100);
                }
              })
            }
          })

				this.page=page;
				this.comments=comments.data.data;

				this.enable = enable
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
    	},
    },//methods
    components:{Pagepublic}
}


</script>
<style>
.orange{
	color: #f47110;
}
</style>
