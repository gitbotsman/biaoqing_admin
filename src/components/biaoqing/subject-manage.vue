<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item">表情列表</li>
    </ol>
    <div class="biaoqing-container">
    	<ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
			<li class="nav-item " v-for="tag in tags.data">
				<a 
				:class="{active:(keyword==tag.code || keyword==tag.name)}" 
				@click="goSubject(1,tag.name)">
				{{tag.name}}
				</a>
			</li>
		</ul>
    	<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>封面</th>
				      <th>表情ID</th>
				      <th>内容</th>
				      <th>发布人</th>
				      <th>发布时间<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>浏览量<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>点赞<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>评论数<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>来源</th>
				      <!-- <th>最后回复<span class="biaoqing-sort fa fa-sort"></span></th> -->
				      <th>权重</th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="work in works.items">
		    			<td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img"  :data-height="work.coverHeight" :data-width="work.coverWidth" :src="[work.fullCover+'!thumb240']" alt="">
		    				</div>
		    			</td>
		    			<td>{{work.id}}</td>
		    			<td class="max-width200">
		    				<span class="biaoqing-table-content" :title="work.content">{{work.content}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span :title="work.userName">{{work.userName}}</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>{{work.createTime}}</span>
		    			</td>
		    			<td class="view-num">
		    				<span>{{work.viewNum}}</span>
		    			</td>
		    			<td class="like-num">
		    				<span>{{work.likedNum}}</span>
		    			</td>
		    			<td class="pl-num">
		    				<span>{{work.commentNum}}</span>
		    			</td>
		    			<td class="change-num">
		    				<span>{{work.source}}</span>
		    			</td>
		    			<!-- <td class="max-width100 last-comment">
		    				<span>2017-08-25 16:00</span>
		    			</td> -->
		    			<td class="publish-hot">
		    				<span v-if="work.isHot=='-1'">仅作者可见</span>
		    				<span v-if="work.isHot=='0'">正常</span>
		    				<span v-if="work.isHot=='1'">热门</span>
		    			</td>
		    			<td class="operation-item">
		    				<span><i class="operation-icon fa fa-send"></i>详情</span>
		    				<span class="text-danger"><i class="operation-icon fa fa-trash-o"></i>删除</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<nav aria-label="Page navigation example">
			  <ul class="pagination">
			    <li v-if="!works.firstPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Previous" 
			      @click="goSubject(works.prevPageNumber)">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>
			    <!-- 回到第一页 -->
			    <template v-if="(works.pageNumber-4)>1">
			    	<li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goSubject(1)">1</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link">...</a>
				    </li>
			    </template>
			    <template v-for="page in works.pageNumbers">
				    <li class="page-item" :class="{active:(page==works.pageNumber)}">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goSubject(page)">{{page}}</a>
				    </li>
				</template>
				<!-- 回到最后一页 -->
				 <template v-if="(works.pageNumber+4+1)<works.lastPageNumber">
				    <li class="page-item">
				    	<a class="page-link">...</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link" href="javascript:;"  
				    	@click="goSubject(works.lastPageNumber)">{{works.lastPageNumber}}</a>
				    </li>
			    </template>

			    <li v-if="!works.lastPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Next"
			      @click="goSubject(works.nextPageNumber)">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			  </ul>
			</nav>
	    </div>	
    </div>

</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import { Subject } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'

export default {
	data: () => ({
		loading: false,
		works:'',
		tags:'',
		keyword:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:15,
			pageNum:1,
			keyword:'0'
		}
		Promise.all([Subject.works(params),Subject.tags()]).then(([works,tags]) => {
			for(var i = 0;i<works.data.data.items.length;i++){
				works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
			}
    		next(vm => {
    			vm.keyword=params.keyword;
    			vm.tags = tags.data;
    			vm.works = works.data.data;
    		})
		})
	},
    mounted () {
      	this.$emit('loaded',false)
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e){viewImg(e,240)},
    	goSubject(page,keyword){
    		this.$emit('loaded',true)
    		var params = {
				pageSize:15,
				pageNum:page
			}
			if(keyword){
				if(keyword=='最新'){
					params.keyword='0';
				}else if(keyword=='热门'){
					params.keyword='1';
				}else{
					params.keyword=keyword;
				}
			}else{
				params.keyword=this.keyword;
			}
			Promise.all([Subject.works(params)]).then(([works]) => {
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
				this.$emit('loaded',false)
    			this.keyword=params.keyword;
				this.works=works.data.data;
			})
    	}
    } 
}
</script>
