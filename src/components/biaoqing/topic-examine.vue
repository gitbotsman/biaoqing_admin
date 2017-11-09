<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">审核管理</li>
      <li class="breadcrumb-item">专题审核</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table">
    		<div class="clearfloat search-container flex-center">
	    		<div class="btn-group btn-group-sm fl">
	    		  <button  @click="goTopicReview(reviews.pageNumber,sort,asc,'all')" type="button" class="btn btn-outline-primary" :class="{active:(audit=='')}">全部</button>
		          <button  @click="goTopicReview(reviews.pageNumber,sort,asc,'1')" type="button" class="btn btn-outline-primary" :class="{active:(audit=='1')}" >审核中</button>
		          <button  @click="goTopicReview(reviews.pageNumber,sort,asc,'2')" type="button" class="btn btn-outline-primary" :class="{active:(audit=='2')}" >审核成功</button>
		          <button @click="goTopicReview(reviews.pageNumber,sort,asc,'-1')" type="button" class="btn btn-outline-primary" :class="{active:(audit=='-1')}" >审核失败</button>
		        </div>
		    </div>
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
		    		  <th>Banner</th>
				      <th>封面</th>
				      <th>专题ID</th>
				      <th>标题</th>
				      <th>描述</th>
				      <th>申请人</th>
				      <th>审核人</th>
				      <th>提交时间
				      		<span class="biaoqing-sort clearfloat" @click="goTopicReview(reviews.pageNumber,'create_time',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(selectSort && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(selectSort && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				      <th>状态</th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(review,index) in reviews.items">
		    			<td class="img-view"  @mouseenter="bigImg($event,750)"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img" data-height="300" data-width="750" :src="[review.fullBanner]">
		    				</div>
		    			</td>
		    			<td class="img-view"  @mouseenter="bigImg($event,300)"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img" data-height="300" data-width="300" :src="[review.fullCover]">
		    				</div>
		    			</td>
		    			<td>{{review.topicId}}</td>
		    			<td class="max-width100">
		    				<router-link class="biaoqing-table-content hover-line" :title="review.topicName":to="'/topicdetail/'+review.topicId+'?keyword='+review.topicName" v-ripple.stop># {{review.topicName}} #</router-link>
		    			</td>
		    			<td class="max-width200">
		    				<span class="biaoqing-table-content" :title="review.summary">{{review.summary}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<router-link 
		    				  target="_blank"
			                  :title="review.ownerName" 
			                  :to="'/userdetail/'+review.ownerId"
			                  >{{review.ownerName}}</router-link>
		    			</td>
						<td class="max-width20">
		    				<span :title="review.auditUserName">{{review.auditUserName}}</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>{{review.createTime}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span class="pass-fail" v-if="review.audit=='-1'">审核失败</span>
		    				<span class="pass-ing" v-if="review.audit=='1'">审核中</span>
		    				<span class="pass-success" v-if="review.audit=='2'">审核通过</span>
		    			</td>
		    			<td class="operation-item">
		    				<template v-if="review.audit=='-1'">
		    					<span @click="pass('pass',review.id,index)"><i class="operation-icon fa fa-check"></i>重新审核</span>
		    				</template>
		    				<template v-if="review.audit=='1'">
		    					<span @click="pass('pass',review.id,index)"><i class="operation-icon fa fa-check"></i>通过</span>
		    					<span @click="pass('refuse',review.id,index)" class="text-danger"><i class="operation-icon fa fa-times"></i>驳回</span>
		    				</template>
		    				<template v-if="review.audit=='2'">
		    					<span @click="pass('refuse',review.id,index)" class="text-danger"><i class="operation-icon fa fa-times"></i>驳回</span>
		    				</template>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<Pagepublic :pages="reviews" @paging="goTopicReview"></Pagepublic>
	    </div>	
    </div>
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { Topic,TopicManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import axios from 'axios'
import Pagepublic from '../../widgets/pagepublic.vue'
export default {
	data: () => ({
		searchTopicKey:'',
		loading: false,
		selectSort:false,
		currentPage:1,
		formPage:'',
		audit:'',
		reviews:'',
		sort:'',
		asc:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageNum:1,
			pageSize:15,
			sort:'create_time',
			audit:'',
			asc:false
		}
		Promise.all([Topic.topicReview(params)]).then(([reviews]) => {
			if(reviews.data.data && reviews.data.code==200){
				for(var i = 0;i<reviews.data.data.items.length;i++){
					reviews.data.data.items[i].createTime=formatTime(reviews.data.data.items[i].createTime)
				}
				next(vm => {
					if(reviews.data.data && reviews.data.code==200){
						console.log(reviews)
						vm.reviews = reviews.data.data;
						vm.sort = params.sort;
						vm.asc=params.asc
					}
				})
			}else{
				toastr.error(reviews.data.msg)
				next()
			}
		})
	},
    mounted () {
      this.$emit('loaded');
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e,maxWidth){viewImg(e,maxWidth)},
    	goTopicReview (page,sort,asc,audit){
    		var sortdata =this.sort;
    		var ascdata =this.asc;
    		this.$emit('loaded',true)
    		var params = {
				pageNum:page,
				pageSize:15
			}
			if(audit){
				if(audit=='all'){ params.audit = ''; }else{params.audit = audit}
			}else{
				params.audit = this.audit
			}
			if(sort){
				this.selectSort = true;
				params.sort = sort;
				params.asc = asc;
			}else{
				params.sort = sortdata;
				params.asc = ascdata;
			}

			Promise.all([Topic.topicReview(params)]).then(([reviews]) => {
				this.$emit('loaded',false)
				if(reviews.data.data && reviews.data.code==200){
					for(var i = 0;i<reviews.data.data.items.length;i++){
						reviews.data.data.items[i].createTime=formatTime(reviews.data.data.items[i].createTime)
					}

					this.audit=	params.audit;
					this.sort = params.sort;
					this.asc = params.asc;
					this.currentPage = params.pageNum;
					this.reviews=reviews.data.data;
				}else{
					toastr.error(reviews.data.msg)
				}
			})
    	},
    	// 审核
    	pass(stau,id,index){
    		var that = this;
    		if(stau=='pass'){
    			var msg="确定审核通过?";
    			var type ='info';
    			var data={
				  "audit": '2',
				  "id": id
				}
    		}else{
    			var msg="确定审核驳回?";
    			var type ='warning';
    			var data={
				  "audit": '-1',
				  "id": id
				}
    		}
    		swal({
			    type: type,
			    title: msg,
			    showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '通过',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
			}, function(){
				that.$http.post('/topicReview/audit', data).then(response => {
			        if(response.data.code==200){
			        	var reviews = that.reviews;
			        	reviews.items[index].audit=data.audit;
						swal.close();
	        			toastr.success('审核成功');
			        }else{
			        	swal.close();
			        	toastr.error(response.data.msg);
			        }
			    })
			})
    	},
    	searchTopic(){
    		var searchTopicKey = this.searchTopicKey;
    		if(searchTopicKey!=''){
	    		this.$emit('loaded',true)
	    		var params = {
					pageNum:1,
					pageSize:15,
					audit:'1',
					keyword:searchTopicKey
				}
				Promise.all([TopicManage.topic(params)]).then(([topics]) => {
					this.$emit('loaded',false)
					if(topics.data.data && topics.data.code==200){
						for(var i = 0;i<topics.data.data.items.length;i++){
							topics.data.data.items[i].createTime=formatTime(topics.data.data.items[i].createTime)
						}
						if(topics.data.data && topics.data.code==200){
							this.reviews = topics.data.data;
						}
					}else{
						this.$notice.error(topics.data.msg)
					}
				})
			}
    	}
    },
    components:{Pagepublic}
}
</script>
