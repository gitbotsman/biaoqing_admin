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
				      <th style="width:100px;">提交用户</th>
				      <th>提交时间</th>
				      <th>联系方式</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(feed,index) in feedback.items" >
		    			<td :title="feed.subContent" class="max-width100">{{feed.subContent}}</td>
		    			<td :title="feed.device" class="max-width100">
		    				{{feed.device}}
		    			</td>
		    			<td class="">
		    				<router-link v-if="feed.user" :to="'/userdetail/'+feed.user.id">
			    				<span class="user-tx mr-1"><img :src="feed.user.fullAvatar"></span>
			    				<span class="overflow" style="max-width:150px;display:inline-block;">{{feed.user.name}}</span>
		    				</router-link>
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
			<Pagepublic :pages="feedback" @paging="goFeedback"></Pagepublic>
	    </div>
    </div>
</div>

</template>

<script>
import { TopicManage,http } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import Pagepublic from '../../widgets/pagepublic.vue'

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
    },
    components:{Pagepublic}
}
</script>
<style>
.user-tx{
	display: inline-block;
    width: 20px;
    height: 20px;
    min-width: 20px;
    border-radius: 100%;
}
.user-tx img{
	border-radius: 100%;
    width: 100%;
    height: 100%;
}
</style>