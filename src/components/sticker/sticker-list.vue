<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">贴纸管理</li>
      <li class="breadcrumb-item">分类列表</li>
    </ol>
	<div class="biaoqing-container">

    <ul class="biaoqing-nav nav nav-tabs nav-justified nav-line"  role="tablist">
      
      <li class="nav-item ">
        <a
          :class="{active:(keyword=='1')}"
          @click="tagSticker(1,'1')">
          热门
        </a>
      </li>
      <li class="nav-item ">
        <a
          :class="{active:(keyword=='0')}"
          @click="tagSticker(1,'0')">
          新品
        </a>
      </li>
      <li class="nav-item " v-for="hot in hots.data">
        <a
          :class="{active:((keyword==hot.value) && (enable==1))}"
          @click="tagSticker(1,hot.value)">
          {{hot.value}}
        </a>
      </li>
    </ul>
		<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				  <thead>
		    		<tr>
				      <th>封面</th>
				      <th>名称</th>
				      <th>标签</th>
				      <th>分类ID</th>
				      <th>贴纸数量</th>
				      <th>创建时间</th>
              <th>权重
              </th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr v-for="(materia,index) in materias.items">
		    			<td class="img-view" @mouseenter="bigImg"  @mouseleave="clearbigImg">
		    				<div class="biaoqing-list-cover">
		    					<img class="biaoqing-list-cover-img"  :data-height="materia.coverHeight" :data-width="materia.coverWidth" :src="[materia.fullCover+'!thumb240']" alt="">
		    				</div>
		    			</td>
		    			<td class="max-width20 biaoqing-table-content">{{materia.name}}</td>
		    			<td class="max-width20 biaoqing-table-content">
                <span @click="setTags(materia.id,index,materia.tags)" class="pass-success cursor" v-if="materia.tags" :title="materia.tags">{{materia.tags}}</span>
                <span @click="setTags(materia.id,index,materia.tags)" class="pass-ing cursor"
                      v-if="(!materia.tags || materia.tags==' ')" title="设置"><i class="operation-icon fa fa-pencil"></i>设置</span>
              </td>
		    			<td>{{materia.id}}</td>
		    			<td>{{materia.stuffNum}}</td>
		    			<td class="max-width20 publish-time">
		    				<span>{{materia.createTime}}</span>
		    			</td>
              <td class="hover-line cursor" @click="setRank(materia.id,materia.rank,index)">
                <span class="text-success ">{{materia.rank}}</span>
              </td>
		    			<td class="max-width20">
                
		    				<span @click="setMateria('1',materia.id,index)" v-if="materia.isHot=='0'" class="pass-ing hover-line cursor">正常</span>
		    				<span @click="setMateria('-1',materia.id,index)" v-if="materia.isHot=='1'" class="pass-success hover-line cursor">热门</span>
		    				<span @click="setMateria('0',materia.id,index)" v-if="materia.isHot=='-1'" class="text-danger hover-line cursor">不推荐</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
      <Pagepublic :pages="materias" @paging="goMaterial"></Pagepublic>
	  </div>
	</div>

  <div class="selecTagContainer">
    <div class="selecTag-bg" @click="selectCancle"></div>
    <div class="selecTag-main">
      <div class="selecTag-title">添加标签：</div>
      <div class="clearfloat">
        <div v-for="hot in hots.data"
             class="tag-name"
             :class="{active:(ch==hot.value)}"
             @click="selectTags(hot.value)"
        >{{hot.value}}</div>
      </div>
      <div>
        <input type="text" class="form-control mt-2" v-model="ch">
        <div class="tip mt-2" style="font-size:13px; color:#999;">标签之间请用逗号（,） 隔开</div>
      </div>
      <div class="selecTag-btn-box">
        <div class="selecTag-btn selecTag-cancle" @click="selectCancle">取消</div>
        <div @click="setTagsView(categoryId,ch)" class="selecTag-btn selecTag-ok">确定</div>
      </div>
    </div>
  </div>


</div>

</template>

<script>

import '../../../static/css/biaoqing/biaoqing.css'
import { StickerManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'
import swal2 from 'sweetalert2'
import Pagepublic from '../../widgets/pagepublic.vue'
export default {
	data: () => ({
		loading: false,
		formPage:'',
		type:'',
    enable:'',
		materias:'',
    hots:'',
    keyword:'',
    categoryId:'',
    ch:'',
    index:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:15,
			pageNum:1,
      enable:1,
      keyword:'1'
		}
		Promise.all([StickerManage.category(params),StickerManage.materialHot()]).then(([materias,hots]) => {
      for(var i = 0;i<materias.data.data.items.length;i++){
				materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
			}
      next( vm => {
        vm.enable=params.enable;
        vm.keyword=params.keyword;
        vm.hots = hots.data;
        vm.materias = materias.data.data;
      })
		})

	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	clearbigImg(e){clearViewImg(e)},
    	bigImg(e){viewImg(e,400)},
      setRank(id,num,index){
        var that = this;
        swal2({
          text:'请选择0-9排序值，越大权重越高',
          input: 'number',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          reverseButtons:true,
          inputAttributes: {
            min: 0,
            max:9,
            step: 1
          },
          inputValue: num,
          preConfirm:function(num){
            return new Promise(function(resolve,reject){
              if(num !='' && (parseInt(num)>=0 && parseInt(num)<=9)){
                swal2.close();
                var params = {
                  "id": id,
                  "rank":num
                }
                that.$http.post('/category/update', params).then(response => {
                    if(response.data.code==200){
                      that.materias.items[index].rank=num
                      toastr.success('请求成功');
                    }else{
                      toastr.error(response.data.msg);
                    }
                })
              }else{
                reject('请输入正确的排序值')
              }
            })
          }
        }).catch(swal2.noop)
      },
    	goMaterial(page,keyword){
    		this.$emit('loaded',true);
  			var params = {
  				pageSize:15,
  				pageNum:page,
          enable:this.enable,
          keyword:this.keyword
  			}
  			Promise.all([StickerManage.category(params)]).then(([materias]) => {
  				this.$emit('loaded',false)
  				for(var i = 0;i<materias.data.data.items.length;i++){
  					materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
  				}
          this.enable=params.enable;
  				this.materias=materias.data.data;
  				this.keyword = params.keyword
  			})
    	},
      setTags(id,index,tags){
        this.categoryId = id;
        this.index = index;
        if(tags){
          this.ch = tags;
        }else{
          this.ch = '';
        }
        $('.selecTagContainer').fadeIn('fast')
      },
      selectCancle(e){
        $('.selecTagContainer').fadeOut('fast')
        this.ch = '';
      },
      selectTags(tag){
        if(this.ch.indexOf(tag)<0){
          this.ch=this.ch+','+tag;
        }
      },
      setTagsView(id,ch) {
        var index = this.index;
        var that = this;
        var params = {
          "id": id,
          "tags": ch
        }
        if (ch != '') {
          var msg = '设置成功'
        } else {
          var msg = '取消成功'
        }
        that.$http.post('/category/update', params).then(response => {
          if (response.data.code == 200) {
            var materias = that.materias;
            materias.items[index].tags = params.tags;
            toastr.success(msg);
            that.ch = '';
            that.categoryId = ''
            $('.selecTagContainer').fadeOut('fast');
          } else {
            toastr.error(response.data.msg);
          }
        })
      },
      tagSticker(page,keyword) {
        var params = {
          pageSize: 15,
          pageNum: page,
          enable: 1
        }
        if(keyword=='最新'){
          params.keyword='0';
        }else if(keyword=='热门'){
          params.keyword='1';
        }else{
          params.keyword=keyword;
        }

        this.$emit('loaded',true);
        Promise.all([StickerManage.category(params)]).then(([materias]) => {
          $('body,html').animate({scrollTop:0},10);
          this.$emit('loaded',false);
          for(var i = 0;i<materias.data.data.items.length;i++){
            materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
          }
          this.init();
          this.enable=1;
          this.keyword=params.keyword;
          this.materias=materias.data.data;
        })
      },

      goDelete(){
        var params = {
          pageSize:15,
          pageNum:1,
          enable:0
        }
        this.$emit('loaded',true);
        Promise.all([StickerManage.category(params)]).then(([materias]) => {
          $('body,html').animate({scrollTop:0},10);
          this.$emit('loaded',false)
          for(var i = 0;i<materias.data.data.items.length;i++){
            materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
          }
          this.init();
          this.enable=0;
          this.materias=materias.data.data;
        })
      },

      init(){
        this.enable=1
        this.keyword='0';
      },
    	setMateria(type,id,index){
    		var data={
			  "id": id,
			  "isHot": type
			}
			this.$http.post('/category/update',data).then(res => {
				var materias = this.materias;
				if(res.data.code==200){
					materias.items[index].isHot=data.isHot
					this.$notice.success(res.data.msg)
				}else{
					this.$notice.error(res.data.msg)
				}

			})
    	}

    },
    components:{Pagepublic}
}
</script>
