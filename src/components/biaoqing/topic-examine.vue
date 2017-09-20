<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">审核管理</li>
      <li class="breadcrumb-item">专题审核</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
		    		  <th>Banner</th>
				      <th>封面</th>
				      <th>专题ID</th>
				      <th>描述</th>
				      <th>审核人</th>
				      <th>提交时间<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>分享次数<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>热门在线</th>
				      <th>操作人</th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="review in reviews.items">
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
		    			<td>4545221</td>
		    			<td class="max-width100">
		    				<span class="biaoqing-table-content">#斗图# #蘑菇头#</span>
		    			</td>
		    			<td class="max-width20">
		    				<span>斗图蘑菇头</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>2017-08-24 16:00</span>
		    			</td>
		    			<td class="share-num">
		    				<span>8220</span>
		    			</td>
		    			<td class="publish-hot">
		    				<span>上线</span>
		    			</td>
		    			<td class="operation">
		    				<span>小猫</span>
		    			</td>
		    			<td class="operation-item">
		    				<span><i class="operation-icon fa fa-send"></i>详情</span>
		    				<span class="text-danger"><i class="operation-icon fa fa-trash-o"></i>删除</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
	    </div>	
    </div>
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { Topic } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'


export default {
	data: () => ({
		loading: false,
		reviews:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {

		}
		Promise.all([Topic.topicReview(params)]).then(([reviews]) => {
			console.log(reviews)
			next(vm => {
				if(reviews.data.data && reviews.data.code==200){
					vm.reviews = reviews.data.data;
				}
			})
		})
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e,maxWidth){
    		viewImg(e,maxWidth)
    	},
    } 
}
</script>
