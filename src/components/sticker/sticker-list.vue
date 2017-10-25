<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">贴纸管理</li>
      <li class="breadcrumb-item">分类列表</li>
    </ol>
	<div class="biaoqing-container">
		<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>封面</th>
				      <th>name</th>
				      <th>分类ID</th>
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
		    			<td>{{materia.id}}</td>
		    			<td class="max-width100 publish-time">
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
		materias:''
	}),
	beforeRouteEnter (to,form,next) {
		var params = {
			pageSize:15,
			pageNum:1,
			type:1
		}
		Promise.all([StickerManage.category(params),StickerManage.materialHot()]).then(([materias,hots]) => {
			console.log(materias)
			for(var i = 0;i<materias.data.data.items.length;i++){
				materias.data.data.items[i].createTime=formatTime(materias.data.data.items[i].createTime)
			}
    		next(vm => {
    			vm.type=params.type;
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
			})
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
