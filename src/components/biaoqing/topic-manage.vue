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
				      <!-- <th>操作</th> -->
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
		    				<span :title="topic.ownerName">{{topic.ownerName}}</span>
		    			</td>

		    			<td class="max-width100 publish-time">
		    				<span>{{topic.createTime}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span @click="setIndex(topic.id,index,topic.tags)" class="pass-success cursor" v-if="topic.tags" title="topic.tags">{{topic.tags}}</span>
							<span @click="setIndex(topic.id,index,topic.tags)" class="pass-ing cursor" 
							v-if="(!topic.tags || topic.tags==' ') && topic.isHot==true" title="设置"><i class="operation-icon fa fa-pencil"></i>设置</span>
		    			</td>
		    			<td class="max-width100 cursor" @click="setHot(!topic.isHot,topic.id,index,topic.sort)">
		    				<span class="pass-success" v-if="topic.isHot==true">热门({{topic.sort}})</span>
		    				<span class="pass-ing" v-else>正常</span>
		    			</td>
		    			<td class="max-width100 cursor" @click="setSlider(!topic.isSlider,topic.id,index)">
		    				<span class="pass-success" v-if="topic.isSlider==true">是</span>
		    				<span class="pass-ing " v-else>否</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<nav v-if="topics.lastPageNumber!=1" aria-label="Page navigation example">
			  <ul class="pagination">
			    <li v-if="!topics.firstPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Previous" 
			      @click="goTopics(topics.prevPageNumber)">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>
			    <!-- 回到第一页 -->
			    <template v-if="(topics.pageNumber-4)>1">
			    	<li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goTopics(1)">1</a>
				    </li>
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
			    </template>
			    <template v-for="page in topics.pageNumbers">
				    <li class="page-item" :class="{active:(page==topics.pageNumber)}">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goTopics(page)">{{page}}</a>
				    </li>
				</template>
				<!-- 回到最后一页 -->
				 <template v-if="(topics.pageNumber+4+1)<topics.lastPageNumber">
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goTopics(topics.lastPageNumber)">{{topics.lastPageNumber}}</a>
				    </li>
			    </template>

			    <li v-if="!topics.lastPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Next"
			      @click="goTopics(topics.nextPageNumber)">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			    <div class="input-group page-input">
				  <input type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
				  <button class="input-group-addon" id="basic-addon2" @click="goTopics(formPage)">Go</button>
				</div>
			  </ul>
			</nav>
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
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { TopicManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import swal2 from 'sweetalert2'

export default {
	data: () => ({
		loading: false,
		searchTopicKey:'',
		currentPage:1,
		topicId:'',
		index:'',
		ch:'',
		tags:'',
		formPage:'',
		audit:'2',
		topics:'',
		sort:'',
		isSlider:'',
		isHot:'',
		asc:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageNum:1,
			pageSize:15,
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
				pageSize:15,
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
				pageSize:15,
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
    	}
    } 
}
</script>
