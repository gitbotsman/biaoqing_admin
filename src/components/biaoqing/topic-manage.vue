<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item">专题列表</li>
    </ol>
    <div class="biaoqing-container pr">
    	<div class="biaoqing-table ">
    		<div class="clearfloat search-container flex-center">
    			<div class="btn-group btn-group-sm fl">
	    			<button @click="goTopics(topics.pageNumber,sort,asc,'all')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='' && isSlider!='1')}" >所有</button>
		          	<button  @click="goTopics(topics.pageNumber,sort,asc,'1')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='1')}" >热门</button>
		          	<button  @click="goTopics(topics.pageNumber,sort,asc,'0')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='0')}" >正常</button>
		          	<button  @click="goTopics(topics.pageNumber,sort,asc,'all','1')" type="button" class="btn btn-outline-primary" :class="{active:(isSlider=='1')}" >轮播</button>
		        </div>
		        <div class="input-group search-topic fl">
			     	<input @keyup.enter="searchTopic" type="text" class="form-control" v-model="searchTopicKey" placeholder="输入关键词" aria-label="Search for...">
			      	<span class="input-group-btn">
			          <button @click="searchTopic" class="btn btn-secondary" type="button">Search</button>
			        </span>
			    </div>
    		</div>
    		
	        <div class="cursor btn btn-warning pb" @click="freshTopicCache" style="color:#fff;font-size:13px;right:223px;top:7px;">刷新热门缓存</div>
	        <div class="pb biaoqing-topic-info" style="right:13px"><i class="operation-icon fa fa-info-circle"></i>只有热门才能设置首页显示</div>
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>Banner</th>
				      <th>封面</th>
				      <th>专题ID</th>
				      <th>标题</th>
				      <th>描述</th>
				      <th>主持人</th>
				      <th>提交时间
				      		<span class="biaoqing-sort clearfloat" @click="goTopics(topics.pageNumber,'create_time',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='create_time' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='create_time' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				      <th><div>首页显示</div><div style="font-weight:normal;font-size:12px;">(点击修改)</div></th>
				      <th>
				      	是否热门
				      	<span class="biaoqing-sort clearfloat" @click="goTopics(topics.pageNumber,'sort_',!asc)">
			      			<span class="fa fa-sort-up fl" :class="{active:(sort=='sort_' && asc==false)}" style="display:block;"></span>
			      			<span class="fa fa-sort-down fl" :class="{active:(sort=='sort_' && asc==true)}" style="display:block;"></span>
			      		</span>
				      	<div style="font-weight:normal;font-size:12px;">(点击修改)</div>

				      </th>
				      <th>APP轮播<div style="font-weight:normal;font-size:12px;">(点击修改)</div></th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(topic,index) in topics.items">
		    			<td class="img-view"  @mouseenter="bigImg($event,750)"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img" data-height="300" data-width="750" :src="[topic.fullBanner]">
		    				</div>
		    			</td>
		    			<td class="img-view"  @mouseenter="bigImg($event,300)"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img" data-height="300" data-width="300" :src="[topic.fullCover]">
		    				</div>
		    			</td>
		    			<td>{{topic.id}}</td>
		    			<td class="max-width100">
		    				<router-link class="biaoqing-table-content hover-line" :title="topic.name":to="'/topicdetail/'+topic.id+'?keyword='+topic.name" v-ripple.stop># {{topic.name}} #</router-link>
		    			</td>
		    			<td class="max-width100">
		    				<span class="biaoqing-table-content" :title="topic.summary">{{topic.summary}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<router-link 
		    					target="_blank"
		    					:title="topic.ownerName" 
		    					:to="'/userdetail/'+topic.ownerId"
		    					>{{topic.ownerName}}</router-link>
		    			</td>

		    			<td class="max-width100 publish-time">
		    				<span>{{topic.createTime}}</span>
		    			</td>
		    			<td class="max-width20" style="width:20px;">
		    				<span @click="setIndex(topic.id,index,topic.tags)" class="pass-success cursor" v-if="topic.tags" title="topic.tags">{{topic.tags}}</span>
							<span @click="setIndex(topic.id,index,topic.tags)" class="pass-ing cursor" 
							v-if="(!topic.tags || topic.tags==' ') && topic.isHot==true" title="设置"><i class="operation-icon fa fa-pencil"></i>设置</span>
		    			</td>
		    			<td style="width:40px;" class="max-width100 cursor" @click="setHot(!topic.isHot,topic.id,index,topic.sort)">
		    				<span class="pass-success" v-if="topic.isHot==true">热门({{topic.sort}})</span>
		    				<span class="pass-ing" v-else>正常</span>
		    			</td>
		    			<td style="width:20px;" class="max-width100 cursor" @click="setSlider(!topic.isSlider,topic.id,index)">
		    				<span class="pass-success" v-if="topic.isSlider==true">是</span>
		    				<span class="pass-ing" v-else>否</span>
		    			</td>
		    			<td style="width:80px;">
		    				<span @click="editOpen(index)" class="cursor hover-line text-danger">修改</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<Pagepublic :pages="topics" @paging="goTopics"></Pagepublic>
	    </div>	
    </div>
    <div class="selecTagContainer">
    	<div class="selecTag-bg" @click="selectCancle"></div>
    	<div class="selecTag-main">
    		<div class="selecTag-title">选择所展示的频道：</div>
    		<div class="clearfloat">
    			<div v-for="tag in tags" 
    			class="tag-name" 
    			:class="{active:(ch==tag.name)}" 
    			@click="selectTag"
    			v-if="tag.name !=='最新'"
    			>{{tag.name}}</div>
    		</div>
    		<div class="selecTag-btn-box">
    			<div class="selecTag-btn selecTag-cancle" @click="selectCancle">取消</div>
    			<div @click="setIndexView(topicId,ch)" class="selecTag-btn selecTag-ok">确定</div>
    		</div>
    	</div>
    </div>
    <!-- 修改话题 -->
    <div class="add-banner-mask" :class="{'none':add==false}">
		<div class="add-banner-mask-bg" @click="closeAdd"></div>
		<div class="add-banner-mask-main">
			<div class="add-banner-mask-container pr flex">
				<input class="up-banner" type="file" accept="image/png,image/gif,image/jpeg" @change="upBanner"  multiple>
				<img class="add-img" :src="editBanner" alt="750*300">
			</div>
			<div class="add-banner-mask-input flex mt-2">
				<div class="add-banner-mask-cover mr-2 flex pr">
					<input @change="upCover" class="up-banner" type="file" accept="image/png,image/gif,image/jpeg"   multiple>
					<img class="add-img-cover " :src="editCover" alt="300*300">
				</div>
				<div class="flex-item">
					<textarea class="editSummary" v-model="editSummary" placeholder="修改话题描述"></textarea>
		        </div>
			</div>
			<div  class="md-form-group pr mt-2" :class="[editOwnerId==''?'md-float-label':'']" style="padding-bottom:0;">
			    <input class="md-input pr" v-model="editOwnerId" ><label>修改主持人Id</label>
			</div>
			<div class="add-info mt-2">
				<i class="operation-icon fa fa-info-circle"></i>
				Banner尺寸为750*300，封面尺寸300*300
			</div>
			<div class="add-banner-mask-btn mt-3">
				<button @click="closeAdd" class="btn mr-3 btn-secondary">取消</button>
				<button @click="editTopic" class="btn btn-primary">创建</button>
			</div>
		</div>
	</div>
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { TopicManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import swal2 from 'sweetalert2'
import Uploader from '../../misc/uploader'
var uploader = new Uploader('https://v0.api.upyun.com/biaoqingimg')
import Pagepublic from '../../widgets/pagepublic.vue'

export default {
	data: () => ({
		loading: false,
		searchTopicKey:'',
		currentPage:1,
		topicId:'',
		add:false,
		index:'',
		ch:'',
		tags:'',
		formPage:'',
		audit:'2',
		topics:'',
		sort:'',
		isSlider:'',
		isHot:'',
		asc:'',
		editOwnerId:'',
		editSummary:'',
		editBanner:'',
		editCover:'',
		editTopicId:'',
		upFileArray:[]
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageNum:1,
			pageSize:10,
			audit:'2',
			sort:'',
			asc:''
		}
		Promise.all([TopicManage.topic(params),TopicManage.tags()]).then(([topics,tags]) => {
			if(topics.data.data && topics.data.code==200){
				for(var i = 0;i<topics.data.data.items.length;i++){
					topics.data.data.items[i].createTime=formatTime(topics.data.data.items[i].createTime)
				}
				next(vm => {
					if(topics.data.data && topics.data.code==200){
						vm.topics = topics.data.data;
						vm.tags=tags.data.data;
					}
				})
			}else{
				next(vm=>{
					vm.$notice.error(topics.data.msg)
				})
			}
		})
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e,maxWidth){viewImg(e,maxWidth)},
    	goTopics(page,sort,asc,isHot,isSlider){
    		var params = {
				pageNum:page,
				pageSize:10,
				audit:'2'
			}
			if(sort){
				params.sort=sort;
				params.asc=asc;
			}else{
				params.sort=this.sort;
				params.asc=this.asc;
			}
			if(isHot){
				if(isHot=='all'){params.isHot=''}else{params.isHot=isHot;}
			}else{params.isHot=this.isHot;}
			if(isSlider){params.isSlider=isSlider;}else{params.isSlider='';}

			this.$emit('loaded',true)
			Promise.all([TopicManage.topic(params)]).then(([topics]) => {
				this.$emit('loaded',false)
				if(topics.data.data && topics.data.code==200){
					for(var i = 0;i<topics.data.data.items.length;i++){
						topics.data.data.items[i].createTime=formatTime(topics.data.data.items[i].createTime)
					}
					if(topics.data.data && topics.data.code==200){
						this.sort=params.sort;
						this.asc=params.asc;
						this.isSlider=params.isSlider;
						this.isHot=params.isHot;
						this.topics = topics.data.data;
						this.currentPage=params.pageNum;
					}
				}else{
					toastr.error(topics.data.msg)
				}
			})
    	},
    	setSlider(type,id,index){
			var that = this;
    		var params = {
			  "id": id,
			  "isSlider": type
			}
			if(type){var msg = '设置成功'}else{var msg = '取消成功'}
			that.$http.post('/topic/update', params).then(response => {
		        if(response.data.code==200){
		        	var topics = that.topics;
		        	topics.items[index].isSlider=params.isSlider;
        			toastr.success(msg);
		        }else{
		        	toastr.error(response.data.msg);
		        }
		    })
    	},
    	setHot(type,id,index,sort){
			var that = this;
			swal2({
			  text:'请选择排序值,数字越小越靠前,设置-1取消热门',
			  input: 'number',
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  showLoaderOnConfirm: true,
			  showCancelButton: true,
			  reverseButtons:true,
			  inputAttributes: {
			    min: -1,
			    step: 1
			  },
			  inputValue: sort,
			  preConfirm:function(num){
			  	return new Promise(function(resolve,reject){
			  		swal2.close();
			  		if(num !=''){
						var params = {
						  "id": id,
						  "isHot": type,
						  "sort":num
						}
						if(num==-1){
							params.isHot=false;
							var msg = '取消成功';
						}else{
							params.isHot=true;
							var msg = '设置成功';
						}
						that.$http.post('/topic/update', params).then(response => {
					        if(response.data.code==200){
					        	var topics = that.topics;
					        	topics.items[index].isHot=params.isHot;
					        	if(num!=-1){
					        		topics.items[index].sort=num;
					        	}
			        			toastr.success(msg);
					        }else{
					        	toastr.error(response.data.msg);
					        }
					    })
			  		}else{
			  			reject('请输入排序值')
			  		}
			  	})
			  }
			}).catch(swal2.noop)
    	},
    	selectTag(e){
    		var $this= $(e.target);
    		var ch = $this.text();
    		if($this.hasClass('active')){
    			$this.removeClass('active');
    			$this.css({
    				'borderColor':'#ddd',
					'color': '#333',
					'background':'#fff'
    			})
    			this.ch = '';
    			return;
    		}
    		$this.addClass('active').siblings().removeClass('active');
    		this.ch = ch;
    	},
    	selectCancle(e){$('.selecTagContainer').fadeOut('fast')},
    	setIndex(id,index,tags){
    		this.topicId = id;
    		this.index = index;
    		if(tags){
    			this.ch = tags;
    		}else{
    			this.ch = '';
    		}
    		$('.selecTagContainer').fadeIn('fast')
    	},
    	setIndexView(id,ch){
    		var index = this.index;
    		var that = this;
    		var params = {
			  "id": id,
			  "tags": ch
			}
			if(ch !=''){var msg = '设置成功'}else{var msg = '取消成功'}
			that.$http.post('/topic/update', params).then(response => {
		        if(response.data.code==200){
		        	var topics = that.topics;
		        	topics.items[index].tags=params.tags;
		        	toastr.success(msg);
        			that.ch='';
        			that.topicId=''
        			$('.selecTagContainer').fadeOut('fast');
		        }else{
		        	toastr.error(response.data.msg);
		        }
		    })
    	},
    	searchTopic(){
    		var searchTopicKey = this.searchTopicKey;
    		this.$emit('loaded',true)
    		var params = {
				pageNum:1,
				pageSize:10,
				audit:'2',
				keyword:searchTopicKey
			}
			Promise.all([TopicManage.topic(params)]).then(([topics]) => {
				this.$emit('loaded',false)
				if(topics.data.data && topics.data.code==200){
					for(var i = 0;i<topics.data.data.items.length;i++){
						topics.data.data.items[i].createTime=formatTime(topics.data.data.items[i].createTime)
					}
					if(topics.data.data && topics.data.code==200){
						this.topics = topics.data.data;
					}
				}else{
					this.$notice.error(topics.data.msg)
				}
			})
    	},
    	freshTopicCache(){
    		var that = this;
    		that.$http.get('/topic/updateCacheHots').then(response => {
		        if(response.data.code==200){
		        	toastr.success(response.data.msg);
		        }else{
		        	toastr.error(response.data.msg);
		        }
		    })
    	},
    	upCover(e){
    		var that = this;
			var key="topic/cover/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([img,file,fileOption])=>{
				if(img.width==300 && img.height==300){
		        	that.upFileArray.push(fileOption);
		        	that.editCover = img.src;
		        }else{
		        	that.$notice.error('图片尺寸错误')	
		        }
			})
    	},
    	upBanner(e){
    		var that = this;
			var key="topic/banner/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([img,file,fileOption])=>{
				if(img.width==750 && img.height==300){
		        	that.upFileArray.push(fileOption);
		        	that.editBanner = img.src;
		        }else{
		        	that.$notice.error('图片尺寸错误')	
		        }
			})
    	},
    	closeAdd(){
    		this.add=false;
    		this.editBanner='';
    		this.editCover='';
    		this.editOwnerId='';
    		this.editSummary='';
    		this.editTopicId='';
    		this.upFileArray=[];
    	},
    	editOpen(index){
    		this.add=true;
    		var topics = this.topics;
    		this.editBanner=topics.items[index].fullBanner;
    		this.editCover=topics.items[index].fullCover;
    		this.editOwnerId = topics.items[index].ownerId;
			this.editSummary = topics.items[index].summary;
			this.editTopicId=topics.items[index].id;
    	},
    	editTopic(){
    		var that = this;
    		var editBanner=this.editBanner;
    		var editCover=this.editCover;
    		var editOwnerId=this.editOwnerId;
    		var editSummary=this.editSummary;
    		var editTopicId=this.editTopicId;
    		var upFileArray = this.upFileArray;
    		var upOk={}
    		editCover=editCover.replace('http://img.biaoqing.com/','');
    		editBanner=editBanner.replace('http://img.biaoqing.com/','');
    		var params={
    		  "coverHeight": 300,
			  "coverWidth": 300,
			  "enable": true,
			  "id": editTopicId,
			  "ownerId": editOwnerId,
			  "summary": editSummary,
			  "banner": editBanner,
			  "cover": editCover
			}
			that.$emit('loaded',true);
			if(upFileArray.length>0){
				upFileArray.forEach((item,index)=>{
    				uploader.start(item.file, item.options,function(res){
    					if(res.url.includes('topic/banner')){
    						params.banner=res.url;
    						upOk.banner='ok'
    					}else if(res.url.includes('topic/cover')){
    						params.cover=res.url;
    						upOk.cover='ok'
    					}
    					// 检测是否长传成功
    					if(upFileArray.length==1){
    						if(upOk.cover=='ok' || upOk.banner=='ok'){
	    						that.$http.post('/topic/update',params).then( res =>{
									that.$emit('loaded',false);
									if(res.data.code==200){
										that.closeAdd();
										that.goTopics(that.currentPage);
										that.$notice.success('修改成功')
									}else{
										that.$notice.error(res.data.msg);
									}
								})
	    					}
    					}else{
    						if(upOk.cover=='ok' && upOk.banner=='ok'){
	    						that.$http.post('/topic/update',params).then( res =>{
									that.$emit('loaded',false);
									if(res.data.code==200){
										that.closeAdd();
										that.goTopics(that.currentPage);
										that.$notice.success('修改成功')
									}else{
										that.$notice.error(res.data.msg);
									}
								})
	    					}
    					}
    					
				    })
				    
    			})
			}else{
				that.$http.post('/topic/update',params).then( res =>{
					that.$emit('loaded',false);
					if(res.data.code==200){
						that.closeAdd();
						that.goTopics(that.currentPage);
						that.$notice.success('修改成功')
					}else{
						that.$notice.error(res.data.msg);
					}
				})
			}

    	}
    },
    components:{Pagepublic}
}
</script>
