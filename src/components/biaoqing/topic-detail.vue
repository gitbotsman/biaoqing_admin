<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">专题管理</li>
      <li class="breadcrumb-item">专题详情</li>
      <li class="breadcrumb-item cursor" @click="toBack">返回上一页</li>
    </ol>
    <div class="biaoqing-container flex p-2">
    	<div class="topic-img-box clearfloat">
    		<div class="topic-banner fl">
          <img :src="topicDetail.fullBanner">
        </div>
			  <div class="topic-cover fl"><img :src="topicDetail.fullCover"></div>
    	</div>
    </div>
    <div class="topic-content-box p-2">
      <div class="col-sm-12" style="padding-left:0;">
        <div class="form-group-alt-attached">
          <div class="row">
            <div class="col-sm-4 col-sm-4">
              <div class="form-group form-group-alt">
                <label>话题名称</label>
                <span class="form-control color999 flex-center">{{topicDetail.name}}</span>
              </div>
            </div>
            <div class="col-sm-4 col-sm-4">
              <div class="form-group form-group-alt">
                <label>热门</label>
                <span v-if="topicDetail.isHot===true" class="form-control color999 flex-center">是</span>
                <span v-else class="form-control color999 flex-center">否</span>
              </div>
            </div>
            <div class="col-sm-4 col-sm-4">
              <div class="form-group form-group-alt">
                <label>创建时间</label>
                <span class="form-control color999 flex-center">{{topicDetail.createTime}}</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 ">
              <div class="form-group form-group-alt">
                <label>描述</label>
                <span class="color999 flex-center">{{topicDetail.summary}}</span>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- col-sm-12 -->
    </div>
    <div class="" style="font-weight:bold;font-size:16px;margin:10px 16px;">作品（{{works.totalCount}}）</div>
    <div class="biaoqing-container p-2">
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
                  <router-link class="hover-line" :to="'/subjectdetail/'+work.id" v-ripple.stop>{{work.id}}</router-link> 
                </td>
                <td class="max-width100">
                  <span class="biaoqing-table-content" :title="work.content">{{work.content}}</span>
                </td>
                <td class="max-width20">
                  <router-link 
                  :title="work.userName" 
                  :to="'/userdetail/'+work.userId"
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
                  <span @click="showSetHotM(1,work.id,index)" class="pass-fail" v-if="work.isHot=='-1'" ><i class="operation-icon fa fa-pencil"></i>仅作者可见</span>
                  <span @click="showSetHotM(0,work.id,index)" class="pass-ing" v-if="work.isHot=='0'" ><i class="operation-icon fa fa-pencil"></i>正常</span>
                  <span @click="showSetHotM(1,work.id,index)" class="pass-success" v-if="work.isHot=='1'" ><i class="operation-icon fa fa-pencil"></i>热门</span>
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
        <Pagepublic :pages="works" @paging="goSubject"></Pagepublic>
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
    </div>
</div>
</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import '../../../static/css/biaoqing/topic.css'
import { Topic,Subject } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'
import Pagepublic from '../../widgets/pagepublic.vue'
export default{
	data:() => ({
		loading: false,
		topicDetail:'',
    works:'',
    sort:'',
    asc:'',
    formPage:'',
    keyword:'',
    modelUser:'',
    showSetHot:false,
    setHot:''
	}),
	beforeRouteEnter(to,form,next){
		var id = to.params.id;
    var keyword ='#'+to.query.keyword+'#';
    var params = {
			id:id
		}
    var worksdata = {
      pageSize:10,
      pageNum:1,
      enable:1,
      keyword:keyword
    }
		Promise.all([Topic.topicDetail(params),Subject.works(worksdata)]).then(([detail,works]) => {
      for(var i = 0;i<works.data.data.items.length;i++){
        works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
      }
      detail.data.data.createTime=formatTime(detail.data.data.createTime);
      next(vm => {
        vm.works = works.data.data;
        vm.keyword=worksdata.keyword;
        vm.topicDetail=detail.data.data
      })

      
		})
	},
	mounted () {
      	this.$emit('loaded',false)
    },
    methods: {
      cancleSelect(){
        this.modelUser='';
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
                        that.$notice.success('删除成功');
                      }else{
                        swal.close();
                        that.$notice.error(response.data.msg);
                      }
                  })
                }else{
                  reject('请输入删除理由');
                }
                
              })
            }
        }).catch(swal2.noop)
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
      setHotM(type){
        var that = this;
        this.showSetHot=false;
        var id=this.setHot.id;
        var type=type;
        var index=this.setHot.index;
          var params = {
          "id": id,
          "isHot": type
        }
        if(type){var msg = '设置成功'}else{var msg = '取消成功'}
        that.$http.post('/subject/update', params).then(response => {
              if(response.data.code==200){
                var works = that.works;
                works.items[index].isHot=params.isHot;
                that.$notice.success(msg);
              }else{
                that.$notice.error(response.data.msg);
              }
          })
      },
      clearbigImg(e){clearViewImg(e)},
      bigImg(e){viewImg(e,400)},
    	goSubject(page,keyword,sort,asc){
        this.$emit('loaded',true);
        var params = {
          pageSize:10,
          pageNum:page
        }
        if(keyword && keyword!=''){
          params.keyword=keyword;
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
      toBack(){
        history.go(-1)
      }
    },
    components:{Pagepublic}
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