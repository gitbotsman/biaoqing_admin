<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item">表情列表</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="search-subject clearfloat">
    		<div class="input-group fl">
		     	<input @keyup.enter="searchSuject" type="text" class="form-control" v-model="searchKey" placeholder="输入关键词" aria-label="Search for...">
		      	<span class="input-group-btn">
		          <button @click="searchSuject" class="btn btn-secondary" type="button">Search</button>
		        </span>
		    </div>
    	</div>
    	<ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
			<li class="nav-item " v-for="tag in tags.data">
				<a 
				:class="{active:((keyword==tag.code || keyword==tag.name)&& (enable==1))}" 
				@click="goSubject(1,tag.name)">
				{{tag.name}}
				</a>
			</li>
			<li class="nav-item ">
				<a
				:class="{active:(enable==false)}"
				@click="goSubject(1,'','','','0')">
				回收站
				</a>
			</li>
		</ul>
    	<div class="biaoqing-table">
			<table class="table table-bordered table-hover ">
				<thead>
		    		<tr>
				      <th>封面</th>
				      <th>表情ID</th>
				      <th>内容</th>
				      <th>发布人</th>
				      <th>发布时间
				      	<span class="biaoqing-sort clearfloat" @click="goSubject(works.prevPageNumber,keyword,'create_time',!asc)">
			      			<span class="fa fa-sort-up fl" :class="{active:(sort=='create_time' && asc==false)}" style="display:block;"></span>
			      			<span class="fa fa-sort-down fl" :class="{active:(sort=='create_time' && asc==true)}" style="display:block;"></span>
			      		</span>
				      </th>
				      <th>浏览量
				      	<span class="biaoqing-sort clearfloat" @click="goSubject(works.prevPageNumber,keyword,'view_num',!asc)">
			      			<span class="fa fa-sort-up fl" :class="{active:(sort=='view_num' && asc==false)}" style="display:block;"></span>
			      			<span class="fa fa-sort-down fl" :class="{active:(sort=='view_num' && asc==true)}" style="display:block;"></span>
			      		</span>
				      </th>
				      <th>点赞
						<span class="biaoqing-sort clearfloat" @click="goSubject(works.prevPageNumber,keyword,'liked_num',!asc)">
			      			<span class="fa fa-sort-up fl" :class="{active:(sort=='liked_num' && asc==false)}"  style="display:block;"></span>
			      			<span class="fa fa-sort-down fl" :class="{active:(sort=='liked_num' && asc==true)}" style="display:block;"></span>
			      		</span>
				      </th>
				      <th>评论数
						<span class="biaoqing-sort clearfloat" @click="goSubject(works.prevPageNumber,keyword,'comment_num',!asc)">
			      			<span class="fa fa-sort-up fl" :class="{active:(sort=='comment_num' && asc==false)}" style="display:block;"></span>
			      			<span class="fa fa-sort-down fl" :class="{active:(sort=='comment_num' && asc==true)}" style="display:block;"></span>
			      		</span>
				      </th>
				      <th>来源</th>
				      <!-- <th>最后回复<span class="biaoqing-sort fa fa-sort"></span></th> -->
				      <th>权重</th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody class="">
		    		<tr v-for="(work,index) in works.items">
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
		    			<td class="change-num max-width50">
		    				<span :title="work.source">{{work.source}}</span>
		    			</td>
		    			<!-- <td class="max-width100 last-comment">
		    				<span>2017-08-25 16:00</span>
		    			</td> -->
		    			<td class="cursor">
		    				<span class="pass-fail" v-if="work.isHot=='-1'" ><i class="operation-icon fa fa-pencil"></i>仅作者可见</span>
		    				<span @click="setHot(1,work.id,index)" class="pass-ing" v-if="work.isHot=='0'" ><i class="operation-icon fa fa-pencil"></i>正常</span>
		    				<span @click="setHot(0,work.id,index)" class="pass-success" v-if="work.isHot=='1'" ><i class="operation-icon fa fa-pencil"></i>热门</span>
		    			</td>
		    			<td class="operation-item">
		    				<template v-if="work.enable==true">
		    					<!-- <span><i class="operation-icon fa fa-send"></i>详情</span> -->
		    					<span class="text-danger" @click="deleteSubject(work.id,index)"><i class="operation-icon fa fa-trash-o"></i>删除</span>
		    				</template>
		    				<template v-else>
		    					<!-- <span class="text-danger" @click="cancelDelete(work.id,index)"><i class="operation-icon fa fa-trash-o"></i>撤销删除</span> -->
		    				</template>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<nav v-if="works.lastPageNumber!=1" aria-label="Page navigation example " class="">
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
				    <li class="page-item disabled ">
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
				    <li class="page-item disabled ">
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
			    <div class="input-group page-input">
				  <input type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
				  <button class="input-group-addon" id="basic-addon2" @click="goSubject(formPage)">Go</button>
				</div>
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
import toastr from '../../misc/toastr.esm'
import swal2 from 'sweetalert2'
import querystring from 'querystring'

export default {
	data: () => ({
		loading: false,
		searchKey:'',
		works:'',
		tags:'',
		formPage:'',
		keyword:'',
		sort:'',
		asc:'',
		enable:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:15,
			pageNum:1,
			enable:1,
			keyword:'0'
		}
		Promise.all([Subject.works(params),Subject.tags()]).then(([works,tags]) => {
			console.log(works)
			for(var i = 0;i<works.data.data.items.length;i++){
				works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
			}
    		next(vm => {
    			vm.enable=params.enable
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
    	bigImg(e){viewImg(e,400)},
    	deleteSubject(id,index){
    		var that = this;
			swal2({
			  	title: '请输入删除理由',
		    	text:'谨慎操作！',
				input: 'text',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showLoaderOnConfirm: true,
				reverseButtons:true,
			  	preConfirm:function(reason){
			  		return new Promise(function(resolve,reject){
			  			if(reason !=''){
							swal2.close();
							var params={
								reason:reason
							}
							params=querystring.stringify(params)
				  			that.$http.delete('/subject/'+id+'?reason='+reason).then(response => {
								var works = that.works;
						        if(response.data.code==200){
						        	works.items[index].enable=false;
									swal.close();
				        			toastr.success('删除成功');
						        }else{
						        	swal.close();
				        			toastr.error(response.data.msg);
						        }
						    })
			  			}else{
			  				reject('请输入删除理由');
			  			}
			  			
			  		})
			  	}
			}).catch(swal2.noop)

    	},
    	cancelDelete(id,index){
    		var that = this;
  			// swal({
			//     type: 'warning',
			//     title: '您确定?',
   			// 	   text: '撤销删除!',
			//     showCancelButton: true,
			//     cancelButtonText: '取消',
			//     confirmButtonText: '确定',
			//     confirmButtonColor: '#DD6B55',
			//     showLoaderOnConfirm: true,
			//     closeOnConfirm: false
			// }, function(){
			// 	that.$http.delete('/subject/'+id).then(response => {
			// 		console.log(response)
			// 		var works = that.works;
			//         if(response.data.code==200){
			//         	works.items[index].enable=false;
			// 			swal.close();
	 		// 	 		toastr.success('删除成功');
			//         }else{
			//         	swal.close();
	  		//			toastr.error(response.data.msg);
			//         }
			//     })
			// })
    	},
    	setHot(type,id,index){
			var that = this;
    		var params = {
			  "id": id,
			  "isHot": type
			}
			if(type){var msg = '设置成功'}else{var msg = '取消成功'}
			that.$http.post('/subject/update', params).then(response => {
		        if(response.data.code==200){
		        	var works = that.works;
		        	works.items[index].isHot=params.isHot;
        			toastr.success(msg);
		        }else{
		        	toastr.error(response.data.msg);
		        }
		    })
    	},
    	goSubject(page,keyword,sort,asc,enable){
    		this.$emit('loaded',true);
    		var params = {
				pageSize:15,
				pageNum:page
			}
			if(enable){
				params.enable=enable;
			}else{
				params.enable=this.enable;
			}
			if(keyword && keyword!=''){
				if(keyword=='最新'){
					params.keyword='0';
				}else if(keyword=='热门'){
					params.keyword='1';
				}else{
					params.keyword=keyword;
				}
				params.enable=1;
			}else{
				params.keyword=this.keyword;
			}
			if(sort && sort!=''){
				params.sort = sort;
				params.asc = asc;
				params.enable=this.enable;
			}else{
				params.sort = this.sort;
				params.asc = this.asc;
			}
			Promise.all([Subject.works(params)]).then(([works]) => {
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
				this.sort=params.sort;
				this.asc=params.asc;
				this.enable=params.enable;
				this.$emit('loaded',false)
				this.keyword=params.keyword;
				this.works=works.data.data;
			})
    	},
    	searchSuject(){
    		this.$emit('loaded',true)
    		var searchKey = this.searchKey;
    		if(searchKey==''){
    			searchKey='0';
    		}
			var params = {
				pageSize:15,
				pageNum:1,
				enable:1,
				keyword:searchKey
			}
			Promise.all([Subject.works(params)]).then(([works]) => {
				console.log(works)
				this.$emit('loaded',false)
				if(works.data.code==200){
					for(var i = 0;i<works.data.data.items.length;i++){
						works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
					}
					this.keyword=params.keyword;
					this.works=works.data.data;
				}
			})
    		
    		
    	}
    } 
}
</script>
