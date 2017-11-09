<template>
<div>
	<table class="table table-bordered table-hover ">
		<thead>
    		<tr>
		      <th>封面</th>
		      <th>表情ID</th>
		      <th>内容</th>
		      <th>标签</th>
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
	            <td>
	                <span  @click="setTags(work.id,index,work.tag)" class="pass-ing cursor hover-line">
	                  {{work.tag}}
	                </span>
	                <span v-if="!work.tag" @click="setTags(work.id,index,work.tag)" class="hover-line cursor pass-success">设置</span>
	            </td>
    			<td class="max-width20">
    				<router-link 
    					target="_blank"
    					:title="work.userName"
    					:to="'/userDetail/'+work.userId"
    				>{{work.userName}}</router-link>
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
	<div class="selecTagContainer setTagsContainer">
		<div class="selecTag-bg" @click="selectCancle"></div>
		<div class="selecTag-main">
		  <div class="selecTag-title">添加标签：</div>
		  <div class="clearfloat">
		    <div v-for="tag in tags.data"
		         class="tag-name"
		         :class="{active:(ch==tag.name)}"
		         @click="selectTags(tag.name)"
		    >{{tag.name}}</div>
		  </div>
		  <div>
		    <input type="text" class="form-control mt-2" v-model="ch">
		    <div class="tip mt-2" style="font-size:13px; color:#999;">标签之间请用逗号（,） 隔开</div>
		  </div>
		  <div class="selecTag-btn-box">
		    <div class="selecTag-btn selecTag-cancle" @click="selectCancle">取消</div>
		    <div @click="setTagsView(subjectId,ch)" class="selecTag-btn selecTag-ok">确定</div>
		  </div>
		</div>
	</div>
</div>
</template>
<script>

import { viewImg, clearViewImg } from '../misc/utils'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'
import toastr from '../misc/toastr.esm'

export default {
    name: 'pagepublic',
    props: ['works','tags','keyword','sort','asc','page'],
    data () {
      return {
        formPage: '',
        subjectId:'',
        index:'',
        showSetHot:'',
        ch:''
      }
    },
    methods: {
		clearbigImg(e){clearViewImg(e)},
		bigImg(e){viewImg(e,400)},
		goSubject(page,keyword,sort,asc,enable){
			this.$emit('goSubject', page,keyword,sort,asc,enable)
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
		setExcellent (id,you,index) {
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
		},
		setTags(id,index,tags){
			this.subjectId = id;
			this.index = index;
			if(tags){
			  this.ch = tags;
			}else{
			  this.ch = '';
			}
			$('.setTagsContainer').fadeIn('fast')
		},
		selectCancle(e){
			$('.setTagsContainer').fadeOut('fast')
			this.ch = '';
		},
		selectTags(tag){
			if(this.ch.indexOf(tag)<0){
			  if(this.ch==''){
			  	this.ch=tag;
			  }else{
			  	this.ch=this.ch+','+tag;
			  }
			}
		},
      	setTagsView(id,ch) {
			var index = this.index;
			var that = this;
			var params = {
			  "id": id,
			  "tag": ch
			}
			if (ch != '') {
			  var msg = '设置成功'
			} else {
			  var msg = '取消成功'
			}
			that.$http.post('/subject/update', params).then(response => {
			  if (response.data.code == 200) {
			    var works = that.works;
			    works.items[index].tag = params.tag;
			    


			    toastr.success(msg);
			    that.ch = '';
			    that.subjectId = ''
			    $('.selecTagContainer').fadeOut('fast');
			  } else {
			    that.$notice.error(response.data.msg);
			  }
			})
		},
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
    	}


    }
  }

</script>