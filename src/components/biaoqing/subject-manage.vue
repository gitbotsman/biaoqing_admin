<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item" @click="deleteSubject">表情列表</li>
    </ol>
    <div class="biaoqing-container">
    	<ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
			<li class="nav-item "><a class="active">最新</a></li>
			<li class="nav-item"><a>热门</a></li>
			<li class="nav-item"><a>斗图</a></li>
			<li class="nav-item"><a>搞笑</a></li>
			<li class="nav-item"><a>综艺</a></li>
			<li class="nav-item"><a>二次元</a></li>
			<li class="nav-item"><a>游戏</a></li>
			<li class="nav-item"><a>搞笑</a></li>
			<li class="nav-item"><a>综艺</a></li>
			<li class="nav-item"><a>二次元</a></li>
			<li class="nav-item"><a>游戏</a></li>
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
				      <th>最后回复<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>热门在线</th>
				      <th>操作人</th>
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
		    			<td class="max-width100">
		    				<span class="biaoqing-table-content" :title="work.content">{{work.content}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span>{{work.name}}</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>2017-08-24 16:00</span>
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
		    			<td class="max-width100 last-comment">
		    				<span>2017-08-25 16:00</span>
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
import { Subject } from '../../resources'
import toastr from '../../misc/toastr.esm'
import { viewImg, clearViewImg } from '../../misc/utils'

export default {
	data: () => ({
		loading: false,
		works:''
	}),
	beforeRouteEnter (to,form,next) {
		var param = {
			pn:'20'
		}
		Promise.all([Subject.works(param)]).then(([works]) => {
		console.log(works)
    		next(vm => {
    			vm.works=works.data.data;
    		})
		})
	},
    mounted () {
      	this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e){viewImg(e,240)},
    	deleteSubject (id){
    		swal({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!',
			  cancelButtonText: 'No, cancel!',
			  confirmButtonClass: 'btn btn-success',
			  cancelButtonClass: 'btn btn-danger',
			  buttonsStyling: false
			}).then(function () {
			  swal(
			    'Deleted!',
			    'Your file has been deleted.',
			    'success'
			  )
			})
    	}
    } 
}
</script>
