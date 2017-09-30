<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">广告管理</li>
      <li class="breadcrumb-item">广告列表</li>
    </ol>
	 <div v-for="(banner,index) in banners.items" class="biaoqing-container mb-3">
	 	<div class="banner-table">
		 	<div class="row">
            	<div class="col-sm-5">
		            <div class="banner-images"><img :src="banner.fullImage"></div>
		         </div>
            	<div class="col-sm-7" style="padding-left:0;">
	              <div class="form-group-alt-attached">
	                <div class="row">
	                  <div class="col-sm-6 col-sm-6">
	                    <div class="form-group form-group-alt">
	                      <label>Name</label>
	                      <input type="text" class="form-control color999 banner-input-name" placeholder="请输入广告名称" :value="banner.name" data-ng-model="$parent.form.fname">
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
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label>创建时间</label>
	                      <span class="form-control color999 flex-center">{{banner.createTime}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label>上次更新时间</label>
	                      <span class="form-control update-time color999 flex-center">{{banner.updateTime}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                  <div class="col-sm-4 col-sm-4">
	                    <div class="form-group form-group-alt">
	                      <label class="flex-center">Banner Id</label>
	                      <span class="form-control color999 flex-center">{{banner.id}}</span>
	                      <span></span>
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="checkbox px-2 mt-2 clearfloat">
	              	<div class="float-left banner-info"><i class="fa fa-info-circle mr-1"></i>Url需遵循/sticker/+素材Id</div>
	                <button type="button" data-toggle="tab" :data-id="banner.id" class="btn btn-sm btn-outline-primary rounded float-right" @click="updateBanner">确定修改</button>
	                <!-- <button type="button" data-toggle="tab" class="btn btn-sm btn-outline-danger rounded float-right mr-3" @click="deleteBanner(banner.id)">确定删除</button> -->
	              </div>
              	</div>
	        </div>
    	</div>
	 </div>

</div>

</template>

<script>
import { StickerManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import $ from 'jquery'

export default {
	data: () => ({
		loading: false,
		banners:''
	}),
	beforeRouteEnter (to,form,next) {
		next(vm => {
			vm.$http.get('/banner').then(response => {
				console.log(response)
				if(response.data && response.data.code==200){
					for(var i=0;i<response.data.data.items.length;i++){
						response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime);
						response.data.data.items[i].updateTime=formatTime(response.data.data.items[i].updateTime);
					}
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
    	deleteBanner(id){
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
    			var parems={
    			  "id":id,
				  "name": name,
				  "sortNo": sortNo,
				  "type": "2",
				  "url": url
				}
    			that.$http.put('/banner',parems).then( res => {
    				if(res.data.code==200){
    					var now = new Date();
    					var month=that.zero(now.getMonth()+1);
    					var day = that.zero(now.getDate());
    					var hour = that.zero(now.getHours());
    					var minutes = that.zero(now.getMinutes()+1);
    					var updatatime = month+'-'+day+' '+hour+':'+minutes;
    					$target.parents('.biaoqing-container').find('.update-time').html(updatatime)
    					that.$notice.success('修改成功')
    				}
    			})
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