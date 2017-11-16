<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">贴纸管理</li>
      <li class="breadcrumb-item">脸部贴纸</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table pb-2">
    		<div @click="openAdd" class="btn cursor btn-outline-success btn-sm mb-2"><i class="fa fa-plus-circle mr-2"></i>添加贴纸</div>
    		<div @click="addCategory" class="btn cursor btn-outline-success btn-sm ml-2 mb-2"><i class="fa fa-plus-circle mr-2"></i>添加分类</div>
    		<div v-if="stickersLength==0" @click="deleteCategory" class="btn cursor btn-outline-danger btn-sm ml-2 mb-2"><i class="fa fa-trash-o mr-2"></i>删除分类</div>

    		<div class="clearfloat search-container flex-center mt-2">
    			<div class="btn-group btn-group-sm fl">
	    			<button @click="laodSticker('all')" type="button" class="btn btn-outline-primary" :class="{'active':categoryId==''}">所有</button>
		          	<button v-for="(category,index) in categorys.items" 
		          			type="button" 
		          			class="btn btn-outline-primary"
		          			@click="laodSticker(category.id)"
		          			:class="{'active':categoryId==category.id}">
		          		{{category.name}}
		          	</button>
		        </div>
    		</div>

    		
    		<div class="pt-3 clearfloat">
    			<div @mouseenter="deleteBlock" @mouseleave="deleteNone" v-for="(sticker,index) in stickers.items" class="sticker-item clearfloat fl ml-2 mb-2 pr cursor">
    				<span class="sticker-item-img fl"><img :src="sticker.fullThumb"></span>
    				<span class="sticker-item-name fl" :title="sticker.name">{{sticker.name}}</span>
    				<div @click="deleteSticker(sticker.id)" class="cursor delete-face">删除</div>
    			</div>
    		</div>
    	</div>
    	<Pagepublic :pages="stickers" @paging="loadPage"></Pagepublic>
    </div>
	<!-- 添加贴纸 -->
    <div class="add-banner-mask" :class="{'none':add==false}">
		<div class="add-banner-mask-bg" @click="closeAdd"></div>
		<div class="add-banner-mask-main">
			<div class="add-banner-mask-container pr flex">
				<input class="up-banner" type="file" accept="image/png,image/gif,image/jpeg" @change="upAddThumb" multiple>
				<img class="add-img" :src="addThumb" alt="上传封面">
			</div>
			<div class="add-banner-mask-input mb-3 mt-2">
				<div class="md-form-group pr" :class="[addResource==''?'md-float-label':'']" style="padding-bottom:0;">
					<input class="up-banner" type="file" accept="application/zip" @change="upAddZip" style="z-index:7;" multiple>
		          <input class="md-input pr" v-model="addResource"><label>点击上传zip文件</label>
		        </div>
			</div>
			<div class="add-banner-mask-input mb-3 mt-2">
				<div class="md-form-group pr" :class="[addName==''?'md-float-label':'']" style="padding-bottom:0;">
		          <input class="md-input pr" v-model="addName" > <label>标题</label>
		        </div>
			</div>
			<div class="add-banner-mask-btn mt-3">
				<button @click="closeAdd" class="btn mr-3 btn-secondary">取消</button>
				<button @click="addSticker" class="btn btn-primary">创建</button>
			</div>
		</div>
	</div>

</div>

</template>

<script>
import { StickerManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import swal2 from 'sweetalert2'
import Uploader from '../../misc/uploader'
import $ from 'jquery'
import Pagepublic from '../../widgets/pagepublic.vue'
var uploader = new Uploader('https://v0.api.upyun.com/biaoqingimg')


export default {
	data: () => ({
		loading: false,
		formPage:'',
		categorys:'',
		categoryId:'',
		stickers:'',
		add:false,
		addThumb:'',
		addName:'',
		addResource:'',
		upArry:[],
		stickersLength:''

	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			categoryId:'',
			pageSize:60
		}
		var resources = [StickerManage.faceCategory(),StickerManage.faceSticker(params)];
		Promise.all(resources).then(([category,sticker]) => {
			next(vm => {
				vm.categoryId = params.categoryId
				vm.categorys=category.data.data;
				vm.stickers=sticker.data.data;
				vm.stickersLength = sticker.data.data.items.length
			})
		})
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	closeAdd(){
    		this.add=false;
    		this.addThumb='';
			this.addName='';
			this.addResource='';
			this.upArry=[];
    	},
    	openAdd(){this.add=true},
    	deleteNone(){$('.delete-face').css('display','none')},
    	deleteBlock(e){
    		$(e.target).find('.delete-face').css('display','block')
    	},
    	deleteCategory(){
    		var $this = this;
    		var id = this.categoryId;
    		swal({
    			type:"warning",
    			title:'你确定？',
    			text:'是否删除当前分类',
    			showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '确定',
			    confirmButtonColor: '#DD6B55',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
    		},function(){
    			$this.$http.delete('/sticker/category/'+id).then(res =>{
	    			if(res.data.code==200){
	    				$this.laodCategory()
	    				$this.$notice.success('删除成功')
	    			}else{
	    				$this.$notice.error(res.data.msg)
	    			}
	    		})
    			swal.close()
    		})
    	},
    	deleteSticker(id){
    		var $this = this;
    		swal({
    			type:"warning",
    			title:'你确定？',
    			text:'删除的记录将不能恢复',
    			showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '确定',
			    confirmButtonColor: '#DD6B55',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
    		},function(){
    			$this.$http.delete('/sticker/'+id).then(res =>{
	    			if(res.data.code==200){
	    				$this.laodSticker()
	    				$this.$notice.success('删除成功')
	    			}else{
	    				$this.$notice.error(res.data.msg)
	    			}
	    		})
    			swal.close()
    		})
    		
    	},
    	laodCategory(){
    		Promise.all([StickerManage.faceCategory()]).then(([category]) => {
				this.categorys=category.data.data;
			})
    	},
    	addCategory(){
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
							  "name": name
							}
							$this.$http.post('/sticker/category',data).then( res => {
								if(res.data.code==200){
									$this.laodCategory()
									swal2.close();
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
    	},
    	addSticker(){
    		var that = this;
    		var addThumb =this.addThumb;
			var addName =this.addName;
			var addResource =this.addResource;
			var categoryId = this.categoryId;
			var data={
			  "categoryId": categoryId,
			  "dir": addName,
			  "name": addName
			}
			if(addThumb != '' && addName != '' && addResource != ''){
				
    			that.upArry.forEach(item=>{
    				that.$emit('loaded',true);
    				uploader.start(item.file, item.options,function(res){
    					if(res.url.includes('resource')){
    						data.resource=res.url;
    					}else if(res.url.includes('thumb')){
    						data.thumb=res.url;
    					}
    					// 检测是否长传成功
    					if(data.resource && data.thumb){
    						that.$http.post('/sticker',data).then(res => {
    							that.$emit('loaded',false);
								if(res.data.code==200){
									that.addThumb='';
									that.addName='';
									that.addResource='';
									that.upArry=[];

									that.laodSticker();
									that.$notice.success('新增成功')
									that.add=false;
								}else{
									that.$notice.error(res.data.msg);
								}
							})
    					}
				    	
				    })
    			})
			}else{
				that.$notice.error('不能为空')
			}
    	},
    	laodSticker(categoryId){
    		if(categoryId=='all'){
    			var categoryId = '';
    		}else if(categoryId){
    			var categoryId = categoryId;
    		}else{
    			var categoryId = this.categoryId;
    		}
    		var params = {
    			categoryId:categoryId,
    			pageSize:60
    		}
    		Promise.all([StickerManage.faceSticker(params)]).then(([sticker]) => {
				this.stickers=sticker.data.data;
				this.stickersLength = sticker.data.data.items.length
				this.categoryId=categoryId;
			})
    	},
    	loadPage(page){
    		this.$emit('loaded',true)
    		var categoryId = this.categoryId;
    		var params = {
    			categoryId:categoryId,
    			pageSize:60,
    			pageNum:page
    		}
    		Promise.all([StickerManage.faceSticker(params)]).then(([sticker]) => {
    			this.$emit('loaded',false)
				this.stickers=sticker.data.data;
				this.categoryId=categoryId;
			})

    	},


    	//上传贴纸
    	upAddThumb(e){
    		var that = this;
			var key="face/thumb/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([img,file,fileOption])=>{
				that.addThumb=img.src;
				that.upArry.push(fileOption);
				// that.upArry['thumb']=fileOption;
			})
    	},
    	//上传源文件
    	upAddZip(e){
    		var that = this;
			var key="face/resource/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([file,fileOption])=>{
				if(file.type=='application/x-zip-compressed' || file.type=="application/zip"){
					that.addResource=file.name;
					that.upArry.push(fileOption);
				}else{
					that.$notice.error('格式不正确')
				}
				
			})
    	}
    },
    components:{Pagepublic}
}
</script>

<style>
	.delete-face{
		position: absolute;
		right: 3px;
		top: 3px;
		background: #e73849;
		color: #fff;
		border-radius: 3px;
		font-size: 12px;
		padding: 2px 5px;
		display: none;
	}
	.delete-face:hover{
		background: #dc3545;
	}
	.sticker-item{
		width: 100px;
		border: 1px solid #eee;
	}
	.sticker-item:first-child{
		margin-left: 0 !important;
	}
	.sticker-item-img{
		width: 100px;
		height: 100px;
		display: block;
		border-bottom: 1px solid #eee;
	}
	.sticker-item-img img{
		max-width: 100px;
		max-height: 100px;
		display: block;
		margin: 0 auto;
	}
	.sticker-item-name{
		text-align: center;
		width: 100%;
		font-size: 14px;
		color: #999;
		display: block;
		height: 21px;
		width: 100%;
		text-overflow: ellipsis;
	    overflow: hidden;
	}
	.none{
		display: none;
	}
	.add-banner-mask{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 50;
	}
	.add-banner-mask-bg{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 48;
		background: rgba(0,0,0,.2)
	}
	.add-banner-mask-main{
		width: 395px;
		position: absolute;
		top: 30%;
		left: 50%;
		margin-left: -200px;
		background: #fff;
		z-index: 49;
		padding: 10px;

	}
	.add-banner-mask-container{
		width: 120px;
		height: 120px;
	}
	.add-banner-mask-btn{
		text-align: center;
	}
	.add-banner-mask-container img{
		text-align: center;
		font-size: 16px;
		line-height: 120px;
		color: #fff;
		width: 100%;
		height: 100%;
		background: #ccc;
	}
	
</style>