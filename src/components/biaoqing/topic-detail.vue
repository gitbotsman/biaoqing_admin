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
    </div>
</div>
</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'
import '../../../static/css/biaoqing/topic.css'
import Subjectlist from '../../widgets/subjectlist.vue'

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
    tags:'',
    page:1,
    sort:'',
    asc:'',
    formPage:'',
    keyword:''
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
    var req=[Topic.topicDetail(params),Subject.works(worksdata),Subject.tags()]
		Promise.all(req).then(([detail,works,tags]) => {
      for(var i = 0;i<works.data.data.items.length;i++){
        works.data.data.items[i].createTime=formatTime(works.data.data.items[i].createTime)
      }
      detail.data.data.createTime=formatTime(detail.data.data.createTime);
      next(vm => {
        vm.tags=tags.data;
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
        this.page=params.page;
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