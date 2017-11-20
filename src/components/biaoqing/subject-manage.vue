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
		    <!-- <div class="fr">
		    	<span class="color999 hot-message-title">热门推送：</span>
		    	<input type="text" class="hot-message" placeholder="设置热门后推送给用户的消息">
		    </div> -->
    	</div>
    	<ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
			<li class="nav-item " v-for="tag in tags.data">
				<a :class="{active:((keyword==tag.code || keyword==tag.name) && (enable==1) && (you=='') )}"
				@click="tagSubject(1,tag.name)">{{tag.name}}
				</a>
			</li>
			<li class="nav-item">
				<a :class="{active:(enable==false)}" @click="goDelete">回收站</a>
			</li>
			<li class="nav-item">
				<a :class="{active:(you==1)}" @click="youSubject">精选</a>
			</li>
		</ul>
    	<div class="biaoqing-table">
			<Subjectlist 
				:works="works"
				:tags="tags"
				:keyword="keyword"
				:sort="sort"
				:asc="asc"
				:page="page"
				@goSubject="goSubject"
			></Subjectlist>
			<Pagepublic :pages="works" @paging="goSubject"></Pagepublic>
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
import Pagepublic from '../../widgets/pagepublic.vue'
import Subjectlist from '../../widgets/subjectlist.vue'

import { Subject } from '../../resources'
import { formatTime } from '../../misc/utils'
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
		keyword:'',
		ModelUserId:'',
		sort:'',
		asc:'',
		page:'',
		modelUser:'',
		enable:'',
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:10,
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
    	// 标签跳转
    	tagSubject(page,keyword){
    		var params = {
				pageSize:10,
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
    	//回收站
    	goDelete(){
    		var params = {
				pageSize:10,
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
    	// 清除用户搜索
    	clearUserSearch(){
    		this.ModelUserId="";
    		this.searchUserKey="";
    		var params = {
				pageSize:10,
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
				pageSize:10,
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
				pageSize:10,
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
				pageSize:10,
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
				pageSize:10,
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
    },
    components:{Pagepublic,Subjectlist}
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
