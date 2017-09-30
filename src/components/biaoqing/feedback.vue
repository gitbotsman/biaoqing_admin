<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">反馈管理</li>
      <li class="breadcrumb-item">反馈征集列表</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>内容</th>
				      <th>来源</th>
				      <th>提交时间</th>
				      <th>联系方式</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(feed,index) in feedback.items" >
		    			<td :title="feed.subContent" class="max-width400">{{feed.subContent}}</td>
		    			<td :title="feed.device" class="max-width100">
		    				{{feed.device}}
		    			</td>
		    			<td :title="feed.createTime" class="max-width50">
		    				{{feed.createTime}}
		    			</td>
		    			<td class="max-width50">
		    				{{feed.contacts}}
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<nav v-if="feedback.lastPageNumber!=1" aria-label="Page navigation example">
			  <ul class="pagination">
			    <li v-if="!feedback.firstPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Previous" 
			      @click="goFeedback(feedback.prevPageNumber)">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>
			    <!-- 回到第一页 -->
			    <template v-if="(feedback.pageNumber-4)>1">
			    	<li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goFeedback(1)">1</a>
				    </li>
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
			    </template>
			    <template v-for="page in feedback.pageNumbers">
				    <li class="page-item" :class="{active:(page==feedback.pageNumber)}">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goFeedback(page)">{{page}}</a>
				    </li>
				</template>
				<!-- 回到最后一页 -->
				 <template v-if="(feedback.pageNumber+4+1)<feedback.lastPageNumber">
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goFeedback(feedback.lastPageNumber)">{{feedback.lastPageNumber}}</a>
				    </li>
			    </template>

			    <li v-if="!feedback.lastPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Next"
			      @click="goFeedback(feedback.nextPageNumber)">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			    <div class="input-group page-input">
				  <input type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
				  <button class="input-group-addon" id="basic-addon2" @click="goFeedback(formPage)">Go</button>
				</div>
			  </ul>
			</nav>
	    </div>
    </div>
</div>

</template>

<script>
import { TopicManage,http } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'

export default {
	data: () => ({
		loading: false,
		feedback:'',
		formPage:''
	}),
	beforeRouteEnter (to,form,next) {
		next(vm => {
			var params ={
				pageSize:15,
				pageNum:1
			}
			vm.$http.get('/feedback',{params:params}).then(response => {
				console.log(response)
				for(var i = 0;i<response.data.data.items.length;i++){
					response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime)
				}
		        vm.feedback=response.data.data;
		    })
		})
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	goFeedback(page){
    		this.$emit('loaded',true)
			var params ={
				pageSize:15,
				pageNum:page
			}
			http.get('/feedback',{params:params}).then(response => {
				this.$emit('loaded',false);
				for(var i = 0;i<response.data.data.items.length;i++){
					response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime)
				}
		        this.feedback=response.data.data;
		    })
    	}
    } 
}
</script>
