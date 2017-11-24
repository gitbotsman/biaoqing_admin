<template>
<div class="user-manage">
	<ol class="breadcrumb">
      <li class="breadcrumb-item">用户管理</li>
      <li class="breadcrumb-item">用户列表</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="clearfloat" style="margin:5px 0;">
    		<div @click="goUser(1,sort,asc,'all')" class="user-disable btn btn-sm btn-outline-primary" :class="{active:allStatus}" style="margin-right:10px;">所有用户</div>
    		<div @click="goUser(1,sort,asc,'1')" class="user-disable btn btn-sm btn-outline-primary" :class="{active:recommend}" style="margin-right:10px;">推荐</div>
    		<div @click="banList(1)" class="user-disable btn btn-sm btn-outline-primary" :class="{active:bans.items}">禁言列表</div>

    		<div v-if="users.items" class="user-search input-group">
		      <input @keyup.enter="searchUser('users')" type="text" class="form-control" v-model="searchKey" placeholder="输入用户ID或昵称">
		      <span class="input-group-btn">
		        <button @click="searchUser('users')" class="btn btn-secondary" type="button">Go!</button>
		      </span>
		    </div>
			<div v-if="bans.items" class="user-search input-group">
		      <input @keyup.enter="searchUser('bans')" type="number" class="form-control" v-model="searchKey" placeholder="输入用户ID">
		      <span class="input-group-btn">
		        <button @click="searchUser('bans')" class="btn btn-secondary" type="button">Go!</button>
		      </span>
		    </div>

    		<div class="user-total" v-if="users.items"><i class="fa fa-diamond"></i>总注册人数{{users.totalCount}}人</div>
    		<div class="user-total" v-if="bans.items"><i class="fa fa-diamond"></i>被禁言人数{{bans.totalCount}}人</div>
    	</div>
    	<!-- 所有用户 -->
    	<div class="biaoqing-table" v-if="users.items">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>头像</th>
				      <th>用户ID</th>
				      <th>用户名</th>
				      <th>手机号</th>
				      <th>注册平台</th>
				      <!-- <th>个人描述</th> -->
				      <th>权重</th>
				      <th>推荐</th>
				      <th>操作</th>
				      <th>最后发布时间</th>
				      <th>注册时间
				      		<span class="biaoqing-sort clearfloat" @click="goUser(users.pageNumber,'create_time',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='create_time' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='create_time' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				      <th>粉丝数
							<span class="biaoqing-sort clearfloat" @click="goUser(users.pageNumber,'fans_num',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='fans_num' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='fans_num' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				      <th>关注数
							<span class="biaoqing-sort clearfloat" @click="goUser(users.pageNumber,'follow_num',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='follow_num' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='follow_num' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				      <th>作品数
							<span class="biaoqing-sort clearfloat" @click="goUser(users.pageNumber,'work_num',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='work_num' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='work_num' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(user,index) in users.items">
		    			<td class="img-view" style="vertical-align: middle;" @mouseenter="bigImg"  @mouseleave="clearbigImg">
		    				<div class="full-avatar pr">
		    					<img class="biaoqing-list-cover-img" style="display:block;" :src="[user.fullAvatar]">
		    					<span v-if="user.userType=='3' || user.userType=='2'" class="auth_icon_wb"></span>
		    				</div>
		    			</td>
		    			<td>{{user.id}}</td>
		    			<td class="max-width100">
		    				<router-link target='_blank'
		    				class="biaoqing-table-content hover-line"
		    				:class="{'text-success':user.userType==5}"

		    				:title="user.name":to="'/userdetail/'+user.id" v-ripple.stop>{{user.name}}</router-link>
		    			</td>
						<td class="max-width20" :title="user.phone">
		    				{{user.phone}}
		    			</td>
		    			<td>{{user.loginDevice}}</td>
		    			<!-- <td class="max-width100">
		    				<span class="biaoqing-table-content" :title="user.summary">{{user.summary}}</span>
		    			</td> -->
						<td @click="setRank(user.id,index)" class="max-width20 pass-success cursor hover-line">
							<span v-if="user.rank==undefined">设置</span>
							<span v-else>{{user.rank}}</span>
						</td>
						<td @click="setRcmd(user.id,index,user.rcmd)" class="max-width100 cursor hover-line">
							<span class="biaoqing-table-content text-success" v-if="user.rcmd == true">是</span>
							<span class="biaoqing-table-content pass-success" v-else="user.rcmd == false">否</span>
						</td>
						<td class=" overflow" >
		    				<div class="btn-group mb-2">
					          <button type="button" class="btn btn-outline-info  btn-sm dropdown-toggle" data-toggle="dropdown">
					          	<span v-if="user.banPublishDuration=='-2'">禁言</span>
					          	<span v-else-if="user.banPublishDuration=='-1'">禁言永久</span>
					          	<span v-else>禁言{{ Math.ceil(user.banPublishDuration/(60*60*24))}}天</span>
					          </button>
					          <div class="dropdown-menu">
					            <a @click="userBan(user.id,'1',index)" class="dropdown-item">1天</a>
					            <a @click="userBan(user.id,'3',index)" class="dropdown-item">3天</a>
					            <a @click="userBan(user.id,'15',index)" class="dropdown-item">15天</a>
					            <a @click="userBan(user.id,'-1',index)" class="dropdown-item">永久</a>
					            <div class="dropdown-divider"></div>
					            <a @click="deleteBan(user.id,index)" class="dropdown-item">解除禁言</a>
					          </div>
					        </div>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>{{user.lastDynamicTime}}</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>{{user.createTime}}</span>
		    			</td>

		    			<td class="max-width20">
		    				{{user.fansNum}}
		    			</td>
		    			<td class="max-width20">
		    				{{user.followNum}}
		    			</td>
		    			<td class="max-width20">
		    				{{user.workNum}}
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<Pagepublic :pages="users" @paging="goUser"></Pagepublic>
	    </div>
		<!-- 禁言列表 -->
	    <div class="biaoqing-table" v-if="bans.items">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>头像</th>
				      <th>用户ID</th>
				      <th>用户名</th>
				      <th>禁言原因</th>
				      <th>操作人</th>
				      <th>操作</th>
				      <th>剩余禁言时间</th>
				      <th>注册时间
				      		<span class="biaoqing-sort clearfloat" @click="goUser(bans.pageNumber,'create_time',!asc)">
				      			<span class="fa fa-sort-up fl" :class="{active:(sort=='create_time' && asc==false)}" style="display:block;"></span>
				      			<span class="fa fa-sort-down fl" :class="{active:(sort=='create_time' && asc==true)}" style="display:block;"></span>
				      		</span>
				      </th>

				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(ban,index) in bans.items" v-if="ban.isExpire==0">
		    			<td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">
		    				<div class="full-avatar">
		    					<img class="biaoqing-list-cover-img" style="display:inline-block;" :src="[ban.userAvatar]">
		    				</div>
		    			</td>
		    			<td>{{ban.userId}}</td>
		    			<td class="max-width100">
		    				<span class="biaoqing-table-content" :title="ban.name">{{ban.userName}}</span>
		    			</td>
						<td class="max-width20" :title="ban.reason">
		    				{{ban.reason}}
		    			</td>
		    			<td class="max-width100">
		    				{{ban.operateName}}
		    			</td>
		    			<td class=" overflow">
		    				<div class="btn-group mb-2">
					          <button type="button" class="btn btn-outline-info  btn-sm dropdown-toggle" data-toggle="dropdown">
					          	<span>禁言</span>
					          </button>
					          <div class="dropdown-menu">
					            <a @click="userBan(ban.userId,'1',index,'ban')" class="dropdown-item">1天</a>
					            <a @click="userBan(ban.userId,'3',index,'ban')" class="dropdown-item">3天</a>
					            <a @click="userBan(ban.userId,'15',index,'ban')" class="dropdown-item">15天</a>
					            <a @click="userBan(ban.userId,'-1',index,'ban')" class="dropdown-item">永久</a>
					            <div class="dropdown-divider"></div>
					            <a @click="deleteBan(ban.userId,index,'ban')" class="dropdown-item">解除禁言</a>
					          </div>
					        </div>
		    			</td>
						<td class="overflow">
							<span v-if="ban.expire=='-1'">永久</span>
							<span v-else>{{ban.expire}}</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>{{ban.createTime}}</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<Pagepublic :pages="bans" @paging="banList"></Pagepublic>
	    </div>
    </div>
</div>

</template>
<script>
import '../../../../static/css/biaoqing/user.css'
import querystring from 'querystring'
import { UserManage } from '../../../resources'
import { viewImg, clearViewImg,formatTime } from '../../../misc/utils'
import swal2 from 'sweetalert2'
import Pagepublic from '../../../widgets/pagepublic.vue'


export default {
	data: () => ({
		loading: false,
		users:'',
		searchKey:'',
		formPage:'',
		sort:'',
		bans:'',
		asc:'',
    	recommend:'',
    	allStatus:'',
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageNum:1,
			pageSize:10
		}
		Promise.all([UserManage.users(params)]).then(([users]) => {
			if(users.data.data && users.data.code==200){
				users.data.data.items.forEach(item => {
					item.createTime=formatTime(item.createTime)
					item.lastDynamicTime=formatTime(item.lastDynamicTime)
				})
				next(vm => {
					vm.users = users.data.data;
				})
			}else{
				next(vm =>{
					vm.$notice.error(users.data.msg)
				})
			}
		})
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e){viewImg(e,300)},
		getUser(params) {
			var $this = this;
			this.$emit('loaded',true);

			Promise.all([UserManage.users(params)]).then(([users]) => {
			  this.$emit('loaded',false);
			  $('body,html').animate({scrollTop:0},10);
			  if(users.data.data && users.data.code==200){
			    users.data.data.items.forEach(item => {
					item.createTime=formatTime(item.createTime)
					item.lastDynamicTime=formatTime(item.lastDynamicTime)
				})
			    this.recommend=params.rcmd;
			    this.users=users.data.data;
			    this.bans='';
			    this.sort=params.sort;
			    this.asc=params.asc;
			  }else{
			    $this.$notice.error(users.data.msg);
			  }
			})
		},
    	goUser(page,sort,asc,recommend){
    	  	var params = {
	          pageSize:10,
	          pageNum:page,
	        }
	        if(recommend){
	        	recommend=='all'? params.rcmd='' : params.rcmd=recommend;
	        }else{
	        	params.rcmd = this.recommend;
	        }

	        if(sort && sort!=''){
	          params.sort = sort;
	          params.asc = asc;
	        }else{
	          params.sort = this.sort;
	          params.asc = this.asc;
	        }
        	this.getUser(params)
    	},
    	setRcmd(id,index,rcmd){
    		var users = this.users;
    		var params = {
			  "id": id,
			  "rcmd":!rcmd
			}
			this.$http.post('/user/update', params).then(response => {
				swal2.close();
		        if(response.data.code==200){
		        	users.items[index].rcmd=params.rcmd;
        			this.$notice.success(response.data.msg);
		        }else{
		        	this.$notice.error(response.data.msg);
		        }
		    })
    	},
    	setRank(id,index){
    		var that = this;
			swal2({
			  text:'请输入权重值',
			  input: 'number',
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  showLoaderOnConfirm: true,
			  showCancelButton: true,
			  reverseButtons:true,
			  inputAttributes: {
			    min: 0,
			    step: 1
			  },
			  preConfirm:function(num){
			  	return new Promise(function(resolve,reject){
			  		if(num !=''){
						var params = {
						  "id": id,
						  "rank": num
						}
						that.$http.post('/user/update', params).then(response => {
							swal2.close();
					        if(response.data.code==200){
					        	var users = that.users;
					        	users.items[index].rank=num;
			        			that.$notice.success(msg);
					        }else{
					        	that.$notice.error(response.data.msg);
					        }
					    })
			  		}else{
			  			reject('请输入权重值')
			  		}
			  	})
			  }
			}).catch(swal2.noop)
    	},
    	deleteBan(id,index,type){
    		var params = {
    			t:1
    		}
    		var $this=this;
    		this.$http.delete('/ban/'+id,{params:params}).then(response => {
				if(response.data.code==200){
					if(type && type=='ban'){
						var bans = $this.bans;
						bans.items[index].isExpire=1;
						bans.items[index].reason='';
					}else{
						var users = $this.users;
						users.items[index].banPublishDuration='-2';
						users.items[index].reason='';
					}
					$this.$notice.success('解除成功')
				}
			})
    	},
    	userBan(id,days,index,type){
    		var $this = this;
    		if(days=='-1'){
    			var days = '永久';
    			var expire = '-1';
    		}else{
    			var expire = days*24*60*60;
    			var days = days+'天';
    		}
    		var params = {
    			t:1,
    			userId:id,
    			expire:expire,
    			reason:'违规'
    		}
    		swal2({
			    title: '请输入禁言理由',
			    text:'谨慎操作！',
				input: 'text',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				showLoaderOnConfirm: true,
				reverseButtons:true,
				preConfirm: function (text) {
					return new Promise(function (resolve,reject) {
				        if (text != '') {
				          params.reason=text;
							params=querystring.stringify(params)
							$this.$http.post('/ban',params).then(response => {
								if(response.data.code==200){
									params=querystring.parse(params)
									if(type && type=='ban'){
										var bans = $this.bans;
										bans.items[index].reason=params.reason;
										bans.items[index].expire=$this.timeFilter(params.expire);
									}else{
										var users = $this.users;
										users.items[index].reason=params.reason;
										if(params.expire=='-1'){
											users.items[index].banPublishDuration='-1';
										}else{
											users.items[index].banPublishDuration=parseInt(params.expire);
										}
									}
									$this.$notice.success('禁言成功：'+days)
								}
							})
							 swal2.close()
				        } else {
				        	reject('请输入禁言理由！')
				        }

				    })
				},
			}).catch(swal2.noop)
    	},
    	banList(page,sort,asc){
    		this.$emit('loaded',true);
        	this.recommend = '';
        	this.allStatus = '';
			var params = {
				pageSize:10,
				pageNum:page,
				isExpire:'0'
			}
			this.$http.get('/ban',{params:params}).then(response => {
				this.$emit('loaded',false);
				if(response.data.code==200){
					for(var i = 0;i<response.data.data.items.length;i++){
						response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime)
						response.data.data.items[i].expire=this.timeFilter(response.data.data.items[i].expire)

					}
					this.users='';
					this.bans=response.data.data;
					this.sort=params.sort;
					this.asc=params.asc;
				}
			})
    	},
    	searchUser(type){
    		var that = this;

    		var userid = that.searchKey;
    		if(userid!=''){
    			this.$emit('loaded',true);
    			if(type=='users'){
    				var url = '/user'
    				var params = {
    					pageSize:15,
						pageNum:1,
						keyword:userid
					}
    			}else if(type=='bans'){
    				userid=parseInt(userid);
    				var url = '/ban'
    				var params = {
    					pageSize:15,
						pageNum:1,
						userId:userid
					}
    			}
				this.$http.get(url,{params:params}).then(response => {
					this.$emit('loaded',false);
					if(response.data.code==200){
						for(var i = 0;i<response.data.data.items.length;i++){
							response.data.data.items[i].createTime=formatTime(response.data.data.items[i].createTime)
							if(response.data.data.items[i].expire){
								response.data.data.items[i].expire=this.timeFilter(response.data.data.items[i].expire)
							}
						}
						if(type=='users'){
							that.users=response.data.data;
		    			}else if(type=='bans'){
		    				that.bans=response.data.data;
		    			}
					}
				})


    		}
    	},
    	timeFilter(expire){
    		var msg = '';
    		var expire=parseInt(expire);
		    if (expire > 0) {
	            if (expire < 60) {
	               msg = expire+"秒";
	            } else if (expire >= 60 && expire < 60*60) {
	               msg =(expire / 60)+"分钟后才允许发表言论。";
	            } else if (expire >= 60*60 && expire < 60*60*24){
	               msg =(expire / (60*60))+"小时";
	            } else {
	               msg =(expire / (60*60*24))+"天";
	            }
	            return msg
	        }else{
	        	return expire
	        }
		}
    },
    components:{Pagepublic}
}
</script>
