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
		          <button @click="searchSuject" class="btn btn-secondary" type="button">搜索内容</button>
		        </span>
		    </div>
		    <div class="input-group fl ml-5">
		     	<input @keyup.enter="searchSujectUser" type="text" class="form-control" v-model="searchUserKey" placeholder="输入用户昵称或ID" aria-label="Search for...">
		      	<span class="input-group-btn">
		          <button @click="searchSujectUser" class="btn btn-info" type="button" >搜索用户</button>
		        </span>
		    </div>
		    <span class="cursor pass-success clear-model-user" @click="clearUserSearch">清除用户搜索</span>
    	</div>
    	<ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
			<li class="nav-item " v-for="tag in tags.data">
				<a 
				:class="{active:((keyword==tag.code || keyword==tag.name) && (enable==1) && (you=='') )}" 
				@click="tagSubject(1,tag.name)">
				{{tag.name}}
				</a>
			</li>
			<li class="nav-item ">
				<a
				:class="{active:(enable==false)}"
				@click="goDelete">
				回收站
				</a>
			</li>
			<li class="nav-item ">
				<a
				:class="{active:(you==1)}"
				@click="youSubject">
				精选
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
		    	<tbody>
		    		<tr v-for="(work,index) in works.items">
		    			<td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img"  :data-height="work.coverHeight" :data-width="work.coverWidth" :src="[work.fullCover+'!thumb240']" alt="">
		    				</div>
		    			</td>
		    			<td>
		    				<router-link target="_blank" class="hover-line" :to="'/subjectdetail/'+work.id" v-ripple.stop>{{work.id}}</router-link> 
		    			</td>
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
		    			<td class="cursor">
		    				<span @click="setHotM(0,work.id,index)" class="pass-fail" v-if="work.isHot=='-1'" ><i class="operation-icon fa fa-pencil"></i>仅作者可见</span>
		    				<span @click="setHotM(1,work.id,index)" class="pass-ing" v-if="work.isHot=='0'" ><i class="operation-icon fa fa-pencil"></i>正常</span>
		    				<span @click="setHotM(0,work.id,index)" class="pass-success" v-if="work.isHot=='1'" ><i class="operation-icon fa fa-pencil"></i>热门</span>
		    			</td>
		    			<td class="operation-item" style="width:70px;">
		    				<template v-if="work.enable==true">
		    					<span v-if="work.you==0" @click="setExcellent(work.id,true,index)" class="hover-line pass-ing">设为精选</span>
		    					<span v-if="work.you==1" @click="setExcellent(work.id,false,index)" class="hover-line ">取消精选</span>
		    					<span @click="setHotM('-1',work.id,index)" class="pass-fail " v-if="work.isHot!='-1'" >不推荐</span>
		    					<span class="text-danger hover-line" @click="deleteSubject(work.id,index)"><i class="operation-icon fa fa-trash-o"></i>删除</span>
		    				</template>
		    				<template v-else>
		    					<span class="text-danger" @click="foreverDelete(work.id,index)"><i class="operation-icon fa fa-trash-o"></i>彻底删除</span>
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
	    <div class="selecTagContainer" :class="{show:(showSetHot==true)}">
	    	<div class="selecTag-bg" @click="showSetHotHidden"></div>
	    	<div class="selecTag-main">
	    		<div class="clearfloat">
	    			<div class="tag-name" @click="setHotM('0')">正常</div>
	    			<div class="tag-name" @click="setHotM('1')">热门</div>
	    			<div class="tag-name" @click="setHotM('-1')">仅作者可见</div>
	    		</div>
	    	</div>
	    </div>
	    <div class="selecTagContainer" :class="{show:(modelUser!='')}">
	    	<div class="selecTag-bg" @click="cancleSelect"></div> 
	    	<div class="selecTag-main" :style="'margin-top:-'+modelUserHeight+'px'">
	    		<div class="selecTag-title">选择用户：</div> 
	    		<div class="clearfloat">
	    			<table class="table table-bordered">
	    				<thead>
	    					<th>用户名</th>
	    					<th>ID</th>
	    					<th>操作</th>
	    				</thead>
	    				<tbody>
	    					<tr v-for="model in modelUser.items">
	    						<td class="text-overflow max-width200">{{model.name}}</td>
	    						<td>{{model.id}}</td>
	    						<td class="select-user cursor" @click="selectModelUser(model.id)">选择</td>
	    					</tr>
	    				</tbody>
	    			</table>
	    		</div> 
	    		<div class="selecTag-btn-box">
	    			<div class="selecTag-btn selecTag-cancle" @click="cancleSelect">取消</div> 
	    		</div>
	    	</div>
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
import $ from 'jquery'

export default {
	data: () => ({
		loading: false,
		searchUserKey:'',
		searchKey:'',
		works:'',
		modelUserHeight:'',
		tags:'',
		you:'',
		formPage:'',
		keyword:'',
		ModelUserId:'',
		sort:'',
		asc:'',
		page:'',
		showSetHot:false,
		setHot:'',
		modelUser:'',
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
			}).catch(swal2.noop);
    	},
    	foreverDelete(id,index){
    		var that = this;
  			swal({
			    type: 'warning',
			    title: '您确定?',
   				text: '永久删除该主题!',
			    showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '确定',
			    confirmButtonColor: '#DD6B55',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
			}, function(){
				var params={
					ids:id
				}
				that.$http.delete('/subject/',{params:params}).then(response => {
					that.goSubject(that.page)
					var works = that.works;
			        if(response.data.code==200){
						swal.close();
	 			 		toastr.success('删除成功');
			        }else{
			        	swal.close();
	  					toastr.error(response.data.msg);
			        }
			    })
			})
    	},
    	showSetHotHidden(){
    		this.showSetHot=false;
    	},
    	showSetHotM(type,id,index){
    		var setHot={
    			type:type,
    			id:id,
    			index:index
    		}
    		this.setHot=setHot;
    		this.showSetHot=true;
    	},
    	setHotM(type,id,index){
			var that = this;
			this.showSetHot=false;
			if(id){
				var id=id;
				var index=index;
			}else{
				var id=this.setHot.id;
				var index=this.setHot.index;
			}
			var type=type;
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
    	tagSubject(page,keyword){
    		var params = {
				pageSize:15,
				pageNum:page,
				enable:1
			}
			if(keyword=='最新'){
				params.keyword='0';
			}else if(keyword=='热门'){
				params.keyword='1';
			}else{
				params.keyword=keyword;
			}

			this.$emit('loaded',true);
			Promise.all([Subject.works(params)]).then(([works]) => {
				$('body,html').animate({scrollTop:0},10);
				this.$emit('loaded',false);
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
				this.init();
				this.enable=1;
				this.keyword=params.keyword;
				this.works=works.data.data;
			})

    	},
    	goDelete(){
    		var params = {
				pageSize:15,
				pageNum:1,
				enable:0
			}
			this.$emit('loaded',true);
			Promise.all([Subject.works(params)]).then(([works]) => {
				$('body,html').animate({scrollTop:0},10);
				this.$emit('loaded',false)
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
				this.init();
				this.enable=0;
				this.works=works.data.data;
			})
    	},
    	clearUserSearch(){
    		this.ModelUserId="";
    		this.searchUserKey="";
    		var params = {
				pageSize:15,
				pageNum:1,
				enable:1,
				keyword:'0'
			}
			this.$emit('loaded',true);
			Promise.all([Subject.works(params)]).then(([works]) => {
				this.$emit('loaded',false);
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
    			this.enable=1;
    			this.keyword=params.keyword;
    			this.works = works.data.data;
			})
    	},
    	goSubject(page,keyword,sort,asc,enable){
    		this.$emit('loaded',true);
    		var you = this.you;
    		var params = {
				pageSize:15,
				pageNum:page,
				you:you,
				enable:this.enable,
				userId:this.ModelUserId
			}
			if(params.enable=='0') params.you="";

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
				$('body,html').animate({scrollTop:0},10);
				this.$emit('loaded',false)
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}

				this.you=params.you;
				this.page=params.pageNum
				this.sort=params.sort;
				this.asc=params.asc;
				this.enable=params.enable;
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
				this.$emit('loaded',false)
				if(works.data.code==200){
					for(var i = 0;i<works.data.data.items.length;i++){
						works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
					}
					this.you=''
					this.keyword=params.keyword;
					this.works=works.data.data;
				}
			})
    	},
    	cancleSelect(){
			this.modelUser='';
    	},
    	selectModelUser(id){
    		var params = {
				pageSize:15,
				pageNum:1,
				userId:id,
				enable:1,
				keyword:'0'
			}
			Promise.all([Subject.works(params)]).then(([works]) => {
				if(works.data.code==200){
					this.modelUser='';
					if(works.data.data.items.length>0){
						for(var i = 0;i<works.data.data.items.length;i++){
							works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
						}
						this.keyword=params.keyword;
						this.works=works.data.data;
						this.ModelUserId = id;
					}else{
						swal({
							type:'info',
							title:'该用户没有作品',
							confirmButtonText:'关闭'
						})
					}
				}
			})
    	},
    	searchSujectUser(){
    		var searchUserKey = this.searchUserKey;
    		if(searchUserKey != ''){
    			this.$emit('loaded',true)
    			var params = {
    				pageSize:10,
					pageNum:1,
					keyword:searchUserKey
				}
				this.$http.get('/user',{params:params}).then( response => {
					this.$emit('loaded',false)
					if(response.data.code==200 && response.data.data.items.length>0){
						this.modelUser=response.data.data;
						var modelUserHeight=(response.data.data.items.length*30+147)/2;
						this.modelUserHeight=modelUserHeight;
					}else{
						this.$notice.error('没有找到任何用户')
					}
				})
    		}
    	},
    	youSubject(){
    		var params = {
				pageSize:15,
				pageNum:1,
				you:1,
				enable:1,
				keyword:''
			}
			this.ModelUserId='';
			this.$emit('loaded',true);
			Promise.all([Subject.works(params)]).then(([works]) => {
				this.$emit('loaded',false);
				this.init();
				for(var i = 0;i<works.data.data.items.length;i++){
					works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
				}
				this.enable=1;
	    		this.works = works.data.data;
	    		this.you=1;
			})

    	},
    	init(){
    		this.enable=''
    		this.you='';
    		this.keyword='';
			this.ModelUserId='';
			this.sort='';
			this.asc='';
    	},
    	setExcellent(id,you,index){
    		var data={
    			subjectId:id,
    			you:you
    		}
    		data=querystring.stringify(data)
    		this.$http.post('/subject/setYou',data).then(res => {
    			if(res.data.code==200){
    				var works = this.works;
    				if(you==true){
    					works.items[index].you=1;
    				}else{
    					works.items[index].you=0;
    				}
    				this.$notice.success('操作成功')
    			}else{
    				this.$notice.error(res.data.msg)
    			}
    		})
    	}
    } 
}
</script>
<style>
	.table td, .table th{
		padding: 5px;
		font-size: 13px;
	}
	.selecTagContainer .table thead th{
		border-bottom: 1px;
	}
	.show{
		display: block;
	}
	.select-user{
		font-size: 13px;
		color: #58c6ff;
	}
	.select-user:hover{
		color: #17b0ff;
	}
	.clear-model-user{
		font-size: 14px;
		line-height: 38px;
		margin-left: 20px;
	}
</style>