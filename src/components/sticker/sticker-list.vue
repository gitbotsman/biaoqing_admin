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
      <li class="nav-item ">
        <a
          :class="{active:(enable==false)}"
          @click="goDelete">
          回收站
        </a>
      </li>
    </ul>
		<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>封面</th>
				      <th>name</th>
				      <th>TAGS</th>
				      <th>分类ID</th>
				      <th>贴纸数量</th>
				      <th>创建时间</th>
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
                <span @click="setTags(materia.id,index,materia.tags)" class="pass-success cursor" v-if="materia.tags" title="materia.tags">{{materia.tags}}</span>
                <span @click="setTags(materia.id,index,materia.tags)" class="pass-ing cursor"
                      v-if="(!materia.tags || materia.tags==' ')" title="设置"><i class="operation-icon fa fa-pencil"></i>设置</span>
              </td>
		    			<td>{{materia.id}}</td>
		    			<td>{{materia.stuffNum}}</td>
		    			<td class="max-width20 publish-time">
		    				<span>{{materia.createTime}}</span>
		    			</td>
		    			<td class="max-width20">
		    				<span @click="setMateria('1',materia.id,index)" v-if="materia.isHot=='0'" class="pass-ing hover-line cursor">正常</span>
		    				<span @click="setMateria('-1',materia.id,index)" v-if="materia.isHot=='1'" class="pass-success hover-line cursor">热门</span>
		    				<span @click="setMateria('0',materia.id,index)" v-if="materia.isHot=='-1'" class="text-danger hover-line cursor">不推荐</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
			<nav v-if="materias.lastPageNumber!=1" aria-label="Page navigation example " class="">
			  <ul class="pagination">
			    <li v-if="!materias.firstPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Previous"
			      @click="goMaterial(materias.prevPageNumber)">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>
			    <!-- 回到第一页 -->
			    <template v-if="(materias.pageNumber-4)>1">
			    	<li class="page-item">
				    	<a class="page-link" href="javascript:;"
				    	@click="goMaterial(1)">1</a>
				    </li>
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
			    </template>
			    <template v-for="page in materias.pageNumbers">
				    <li class="page-item" :class="{active:(page==materias.pageNumber)}">
				    	<a class="page-link" href="javascript:;"
				    	@click="goMaterial(page)">{{page}}</a>
				    </li>
				</template>
				<!-- 回到最后一页 -->
				 <template v-if="(materias.pageNumber+4+1)<materias.lastPageNumber">
				    <li class="page-item disabled ">
				    	<a class="page-link">...</a>
				    </li>
				    <li class="page-item">
				    	<a class="page-link" href="javascript:;"
				    	@click="goMaterial(materias.lastPageNumber)">{{materias.lastPageNumber}}</a>
				    </li>
			    </template>

			    <li v-if="!materias.lastPage" class="page-item">
			      <a class="page-link" href="javascript:;" aria-label="Next"
			      @click="goMaterial(materias.nextPageNumber)">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			    <div class="input-group page-input">
				  <input type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
				  <button class="input-group-addon" id="basic-addon2" @click="goMaterial(formPage)">Go</button>
				</div>
			  </ul>
			</nav>
	    </div>
	</div>

  <div class="selecTagContainer">
    <div class="selecTag-bg" @click="selectCancle"></div>
    <div class="selecTag-main">
      <div class="selecTag-title">选择所展示的频道：</div>
      <div class="clearfloat">
        <div v-for="hot in hots"
             class="hot-name"
             :class="{active:(ch==hot.value)}"
        >{{hot.value}}</div>
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
import { StickerManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'

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
      keyword:'0'
		}
		Promise.all([StickerManage.category(params),StickerManage.materialHot()]).then(([materias,hots]) => {
			for(var i = 0;i<materias.data.data.items.length;i++){
				materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
			}
      next(vm => {
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
    	goMaterial(page,keyword){
    		this.$emit('loaded',true);
			var params = {
				pageSize:15,
				pageNum:page,
				type:1
			}
			Promise.all([StickerManage.category(params)]).then(([materias]) => {
				this.$emit('loaded',false)
				for(var i = 0;i<materias.data.data.items.length;i++){
					materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
				}
				this.type=params.type;
				this.materias=materias.data.data;
				this.keyword = 0
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
      selectCancle(e){$('.selecTagContainer').fadeOut('fast')},
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
          console.dir(materias)
          for(var i = 0;i<materias.data.data.items.length;i++){
            materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
          }
          console.dir(this)
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
        Promise.all([Subject.category(params)]).then(([materias]) => {
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
        this.enable=''
        this.you='';
        this.keyword='';
        this.ModelUserId='';
        this.sort='';
        this.asc='';
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

    }
}
</script>
