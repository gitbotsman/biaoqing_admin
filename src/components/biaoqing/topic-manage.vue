<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item">专题列表</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table">
    		<div class="btn-group btn-group-sm mb-2">
    			<button @click="goTopics(topics.pageNumber,sort,asc,'all')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='' && isSlider!='1')}" >所有</button>
	          	<button  @click="goTopics(topics.pageNumber,sort,asc,'1')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='1')}" >热门</button>
	          	<button  @click="goTopics(topics.pageNumber,sort,asc,'0')" type="button" class="btn btn-outline-primary" :class="{active:(isHot=='0')}" >正常</button>
	          	<button  @click="goTopics(topics.pageNumber,sort,asc,'all','1')" type="button" class="btn btn-outline-primary" :class="{active:(isSlider=='1')}" >轮播</button>
	        </div>
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
				      <th>状态</th>
				      <th>是否热门</th>
				      <th>APP轮播</th>
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
		    				<span class="biaoqing-table-content" :title="topic.topicName"># {{topic.name}} #</span>
		    			</td>
		    			<td class="max-width200">
		    				<span class="biaoqing-table-content" :title="topic.summary">{{topic.summary}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span :title="topic.ownerName">{{topic.ownerName}}</span>
		    			</td>

		    			<td class="max-width100 publish-time">
		    				<span>{{topic.createTime}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span class="pass-fail" v-if="topic.audit=='-1'">审核失败</span>
		    				<span class="pass-ing" v-if="topic.audit=='1'">审核中</span>
		    				<span class="pass-success" v-if="topic.audit=='2'">审核通过</span>
		    			</td>
		    			<td class="max-width100">
		    				<span class="pass-success" v-if="topic.isHot==true">热门</span>
		    				<span class="" v-else>正常</span>
		    			</td>
		    			<td class="max-width100">
		    				<span class="pass-success" v-if="topic.isSlider==true">是</span>
		    				<span class="" v-else>否</span>
		    			</td>
		    			<td class="operation-item">
		    				<template v-if="topic.isSlider==false">
		    					<span @click="setSlider(true,topic.id,index)" class=""><i class="operation-icon fa fa-fire"></i>设为轮播</span>
		    				</template>
		    				<template v-if="topic.isSlider==true">
		    					<span @click="setSlider(false,topic.id,index)" class="text-danger"><i class="operation-icon fa fa-fire"></i>取消轮播</span>
		    				</template>
		    				<template v-if="topic.isHot==false">
		    					<span @click="setHot(true,topic.id,index)" class=""><i class="operation-icon fa fa-fire"></i>设为热门</span>
		    				</template>
		    				<template v-if="topic.isHot==true">
		    					<span @click="setHot(false,topic.id,index)" class="text-danger"><i class="operation-icon fa fa-fire"></i>取消热门</span>
		    					<!-- <span @click="setIndex(false,topic.id,index)" class="pass-ing"><i class="operation-icon fa fa-level-up"></i>首页展示</span> -->
		    				</template>


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
    <!-- <div class="selecTagContainer">
    	<div class="selecTag-bg"></div>
    	<div class="selecTag-main">
    		<div class="tag-name">热门</div>
			<div class="tag-name">搞笑</div>
			<div class="tag-name">二次元</div>
			<div class="tag-name">宠物</div>
    	</div>
    </div> -->
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { TopicManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import $ from 'jquery'
export default {
	data: () => ({
		loading: false,
		currentPage:1,
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
			console.log(topics)
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
				toastr.error(topics.data.msg)
				next()
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
					next()
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
    	setHot(type,id,index){
			var that = this;
    		var params = {
			  "id": id,
			  "isHot": type
			}
			if(type){var msg = '设置成功'}else{var msg = '取消成功'}
			that.$http.post('/topic/update', params).then(response => {
		        if(response.data.code==200){
		        	var topics = that.topics;
		        	topics.items[index].isHot=params.isHot;
        			toastr.success(msg);
		        }else{
		        	toastr.error(response.data.msg);
		        }
		    })
    	},
    	selecTag(e){
    		var $this= $(e.target);
    		console.log($this.html())
    	},
    	setIndex(){
    		
    	}
    } 
}
</script>
