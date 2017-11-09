<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">热词管理</li>
    </ol>
    <div class="tag-container pt-2 pb-2">
    	<div class="tags-m-box">
	    	<div class="tags-m-title">
	    		首页热词：
	    	</div>
	    	<div class="tags-m-list pt-2 clearfloat">
	    		<div v-for="item in indexTags.items" class="tags-m-name">{{item.name}}</div>
	    		<!-- <div class="tags-m-name"><i class="fa fa-plus"></i></div> -->
	    	</div>
	    </div>
    </div>
    <div class="tag-container pt-2 pb-2">
    	<div class="tags-m-box">
	    	<div class="tags-m-title">
	    		素材热词<span class="tip text-danger">(点击删除)</span>：
	    	</div>
	    	<div class="tags-m-list pt-2 clearfloat">
	    		<div @click="deleteMaterial(item.id)" v-for="item in materialTags.items" class="tags-m-name" v-if="item.type!==0">{{item.value}}</div>
	    		<div @click="addMaterial" class="tags-m-name"><i class="fa fa-plus"></i></div>
	    	</div>
	    </div>
    </div>
    <div class="tag-container pt-2 pb-2">
    	<div class="tags-m-box">
	    	<div class="tags-m-title">
	    		搜索热词<span class="tip">(搜索量前三十)</span>：
	    	</div>
	    	<div class="tags-m-list pt-2 clearfloat">
	    		<div v-for="item in searchTags.items" class="tags-m-name" v-if="item.type!==0">{{item.text}}({{item.searchNum}})</div>
	    		<!-- <div class="tags-m-name"><i class="fa fa-plus"></i></div> -->
	    	</div>
	    </div>
    </div>
</div>
</template>

<script>
import '../../../static/css/biaoqing/tags.css'
import { Tags } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'

export default {
	data: () => ({
		loading: false,
		indexTags:'',
		materialTags:'',
		searchTags:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:150,
		}
		var search={
			pageSize:30,
			sort:'search_num',
			asc:false
		}
		var req = [Tags.index(params),Tags.material(params),Tags.search(search)]
		Promise.all(req).then(([indexTags,material,searchTags]) => {
    		next(vm => {
    			vm.indexTags = indexTags.data.data;
    			vm.materialTags=material.data.data;
    			vm.searchTags=searchTags.data.data;
    		})
		})
	},
    mounted () {
      	this.$emit('loaded',false)
    },
    methods: {
    	loadMaterial(){
    		var params = {
				pageSize:150,
			}
    		Tags.material(params).then(res=>{
    			this.materialTags=res.data.data
    		})
    	},
    	deleteMaterial(){
    		var $this = this;
    		swal({
			    type: 'warning',
			    title: '您确定?',
			    text: '删除的记录将不能恢复!',
			    showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '是的, 我要删除!',
			    confirmButtonColor: '#DD6B55',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
			}, function(){
				swal.close();
				$this.$http.delete('/materialHot/'+id).then(res=>{
					if(res.data.code==200){
						$this.$notice.success('删除成功');
					}else{
						$this.$notice.error(res.data.msg);
					}
				})
			})
    	},
    	addMaterial(){
    		var $this = this;
    		swal2({
			  	title: '添加分类',
				input: 'text',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showLoaderOnConfirm: true,
				reverseButtons:true,
			  	preConfirm:function(name){
			  		return new Promise(function(resolve,reject){
			  			if(name !=''){
							var data = {
							  "value": name,
							  "data":1
							}
							$this.$http.post('/materialHot/update',data).then( res => {
								if(res.data.code==200){
									swal2.close();
									$this.loadMaterial()
									$this.$notice.success('添加成功')
								}else{
									reject(res.data.msg);
								}
							})
			  			}else{
			  				reject('请输入分类名称');
			  			}
			  			
			  		})
			  	}
			}).catch(swal2.noop);
    	}
    } 
}
</script>
