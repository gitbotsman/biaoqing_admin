<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">广告管理</li>
      <li class="breadcrumb-item">广告列表</li>
    </ol>
    <div class="biaoqing-container ">
    	<div @click="loadBanner(1)" class="btn cursor btn-outline-primary btn-sm mt-2 mr-2" :class="{'active':type=='1'}">专题广告</div>
    	<div @click="loadBanner(2)" class="btn cursor btn-outline-primary btn-sm mt-2" :class="{'active':type=='2'}">贴纸广告</div>

    	<div @click="openAdd" class="btn cursor btn-primary btn-sm mt-2 ml-4"><i class="fa fa-plus-circle mr-2"></i>新增</div>
    </div>
	 <div v-for="(banner,index) in banners.items" class="biaoqing-container mb-3">
	 	<div class="banner-table" :data-index="index">
		 	<div class="row">
            	<div class="col-sm-5 pr">
            		<input class="up-banner" v-if="type==1" type="file" accept="image/png,image/gif,image/jpeg" @change="change"  multiple>
		            <div class="banner-images"><img :src="banner.fullImage"></div>
		        </div>
            	<div class="col-sm-7" style="padding-left:0;">
	              <div class="form-group-alt-attached">
	                <div class="row">
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label>Name</label>
	                      <input  type="text" class="form-control color999 banner-input-name" placeholder="请输入广告名称" :value="banner.name" data-ng-model="$parent.form.fname">
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                    	<label>排序</label>
	                        <input type="number" class="form-control color999 banner-input-sort" placeholder="请设置排序值" :value="banner.sortNo" data-ng-model="$parent.form.bbone">
	                      	<span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-12">
	                    <div class="form-group form-group-alt">
	                      <label>Url</label>
	                      <input type="text" class="form-control color999 banner-input-url" placeholder="请输入Url" :value="banner.url" data-ng-model="$parent.form.address">
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label>创建时间</label>
	                      <span class="form-control color999 flex-center">{{banner.createTime}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label class="flex-center">Banner Id</label>
	                      <span class="form-control color999 flex-center">{{banner.id}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="checkbox px-2 mt-2 clearfloat">
	              	<div class="float-left banner-info"><i class="fa fa-info-circle mr-1"></i>点击图片进行修改，广告图片必须为750*300</div>
	                <button type="button" data-toggle="tab" :data-id="banner.id" class="btn btn-sm btn-outline-primary rounded float-right banner-img" @click="updateBanner">确定修改</button>

	                <button type="button" data-toggle="tab" :data-id="banner.id" class="btn btn-sm btn-outline-danger rounded float-right mr-3 banner-img" @click="deleteBanner(banner.id)">删除广告</button>
	              </div>
              	</div>
	        </div>
    	</div>
	 </div>
	<div class="add-banner-mask" :class="{'none':add==false}">
		<div class="add-banner-mask-bg" @click="closeAdd"></div>
		<div class="add-banner-mask-main">
			<div class="add-banner-mask-container pr flex">
				<input class="up-banner" v-if="type==1" type="file" accept="image/png,image/gif,image/jpeg" @change="upAddBanner"  multiple>
				<img class="add-img" src="" alt="750*300">
			</div>
			<div class="add-banner-mask-input mb-3 mt-2">
				<div  class="md-form-group pr" :class="[addTitle==''?'md-float-label':'']" style="padding-bottom:0;">
		          <input @keyup.enter="" class="md-input pr" v-model="addTitle" > <label>标题</label>
		        </div>
				<div  class="md-form-group pr mt-2" :class="[addUrl==''?'md-float-label':'']" style="padding-bottom:0;">
		          <input @keyup.enter="" class="md-input pr" v-model="addUrl" > <label>URL链接</label>
		        </div>
			</div>
			<div class="add-banner-mask-btn mt-3">
				<button @click="closeAdd" class="btn mr-3 btn-secondary">取消</button>
				<button @click="addBanner" class="btn btn-primary">创建</button>
			</div>
		</div>
	</div>
</div>

</template>

<script>
import { StickerManage } from '../../resources'
import { viewImg, clearViewImg,formatTime,base64_encode } from '../../misc/utils'
import $ from 'jquery'
import md5 from 'js-md5'
// import { Base64 } from 'js-base64'
// import CryptoJS from 'crypto-js';
import Uploader from '../../misc/uploader'
var uploader = new Uploader('https://v0.api.upyun.com/biaoqingimg')


export default {
	data: () => ({
		loading: false,
		banners:'',
		type:'',
		addTitle:'',
		addUrl:'',
		add:false,
		fileArry:[]
	}),
	beforeRouteEnter (to,form,next) {
		next(vm => {
			var params =  {
				sort:'sort_no',
				asc:true,
				type:1
			}
			vm.$http.get('/banner',{params:params}).then(response => {
				if(response.data && response.data.code==200){
					for(var i=0;i<response.data.data.items.length;i++){
						var item = response.data.data.items;
						response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime);
						response.data.data.items[i].updateTime=formatTime(response.data.data.items[i].updateTime);
					}
					vm.type=params.type
					vm.banners=response.data.data;
				}
			})
		})
	},
    mounted () {
      	this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e){viewImg(e,400)},
    	closeAdd(){this.add=false},
    	openAdd(){this.add=true},
    	loadBanner(type){
    		this.$emit('loaded',true)
    		var params =  {
    			sort:'sort_no',
				asc:true,
				type:type
			}
			this.$http.get('/banner',{params:params}).then(response => {
				this.$emit('loaded',false)
				if(response.data && response.data.code==200){
					for(var i=0;i<response.data.data.items.length;i++){
						response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime);
						response.data.data.items[i].updateTime=formatTime(response.data.data.items[i].updateTime);
					}
					this.type=params.type;
					this.banners=response.data.data;
				}
			})
    	},
		change (e) {
			var that = this;
			var imgbox = $(e.target).parents('.banner-table').find('.banner-images');
			var bannerContainer = $(e.target).parents('.banner-table');
			var id = bannerContainer.find('.banner-img').attr('data-id');
			var key="topic/banner/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([img,file,fileOption])=>{
				// 判断图片尺寸
		        if(img.width==750 && img.height==300){
		        	that.fileArry[id]=fileOption;
		        	imgbox.find('img').attr('src',img.src)
		        }else{
		        	that.$notice.error('图片尺寸错误')	
		        }
			})
		},
		// 新增图片
		upAddBanner(e){
			var that = this;
			var bannerMask = $(e.target).parents('.add-banner-mask-main');
			var key="topic/banner/"+uploader.bannergetFileName(e.target.files[0].name);
			uploader.addFile(e.target.files,key).then(([img,file,fileOption])=>{
				if(img.width==750 && img.height==300){
		        	that.fileArry['add']=fileOption;
		        	bannerMask.find('.add-img').attr('src',img.src);
		        }else{
		        	that.$notice.error('图片尺寸错误')	
		        }
			})
		},
    	addBanner(){
    		var that = this;
    		var upfile = that.fileArry['add'];
    		var title = that.addTitle;
    		var url  = that.addUrl;
    		if(upfile && title!='' && url!=''){
    			var params={
				  "name": title,
				  "type": "1",
				  "url": url
				}
				that.$emit('loaded',true)
	    		uploader.start(upfile.file, upfile.options,function(res){
			    	that.$emit('loaded',false)
			      	params.image=res.url;
			      	that.$http.post('/banner',params).then( res => {
	    				if(res.data.code==200){
	    					that.add=false;
	    					that.loadBanner(that.type);
	    					that.$notice.success('新增成功')
	    				}
	    			})
			    })
    		}else{
    			that.$notice.error('请填写完整的信息')
    		}
    	},
    	deleteBanner(id){
    		var $this =this;
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
    			$this.$http.delete('/banner/'+id).then(res=>{
    				if(res.data.code==200){
    					$this.$notice.success('删除成功')
    					$this.loadBanner($this.type);
    				}else{
    					$this.$notice.success('删除失败')
    				}
    			})
    			swal.close()
    		})
    	},
    	updateBanner(e){
    		var $target = $(e.target);
    		var id = $target.attr('data-id');
    		var name = $target.parents('.biaoqing-container').find('.banner-input-name').val();
    		var sortNo = $target.parents('.biaoqing-container').find('.banner-input-sort').val();
    		var url = $target.parents('.biaoqing-container').find('.banner-input-url').val();
    		var that = this;
    		swal({
    			type:"warning",
    			title:'你确定修改广告？',
    			showCancelButton: true,
			    cancelButtonText: '取消',
			    confirmButtonText: '确定',
			    confirmButtonColor: '#DD6B55',
			    showLoaderOnConfirm: true,
			    closeOnConfirm: false
    		},function(){
    			var params={
    			  "id":id,
				  "name": name,
				  "sortNo": sortNo,
				  "type": that.type,
				  "url": url
				}
				var upfile = that.fileArry[id];
				if(upfile){
					that.$emit('loaded',true)
					uploader.start(upfile.file, upfile.options,function(res){
				    	that.$emit('loaded',false)
				      	params.image=res.url;
				      	that.$http.put('/banner',params).then( res => {
		    				if(res.data.code==200){
		    					that.$notice.success('修改成功')
		    				}
		    			})
				    })
				}else{
					that.$http.put('/banner',params).then( res => {
	    				if(res.data.code==200){
	    					that.$notice.success('修改成功')
	    				}
	    			})
				}
    			swal.close()
    		})
    	},
    	zero(num){
    		num=parseInt(num);
    		if(num<10 && num>=0){
    			return '0'+num;
    		}else{
    			return num;
    		}
    	}
    } 
}
</script>
<style>
	.none{
		display: none;
	}
	.add-banner-mask{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 999;
	}
	.add-banner-mask-bg{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 997;
		background: rgba(0,0,0,.2)
	}
	.add-banner-mask-main{
		position: absolute !important;
		left: 50% !important;
		top:50% !important;
		margin-top: -172px !important;
		margin-left: -200px !important;
		background: #fff;
		z-index: 998;
		padding: 10px;

	}
	.add-banner-mask-container{
		width: 375px;
		height: 150px;
	}
	.add-banner-mask-btn{
		text-align: center;
	}
	.add-banner-mask-container img{
		text-align: center;
		font-size: 20px;
		line-height: 150px;
		color: #fff;
		width: 375px;
		height: 150px;
		background: #ccc;
	}
	.banner-table{
		margin: 10px;
	}
	.banner-icon{
		font-size: 13px;
	}
	.banner-info{
		color: #999;
		font-size: 13px;
		line-height: 31px;
	}
	.banner-images img{
		width: 100%;
	}
</style>