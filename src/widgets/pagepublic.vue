<template>
	<nav  v-if="pages.lastPageNumber!=1">
	  <ul class="pagination">
	    <li v-if="!pages.firstPage" class="page-item">
	      <a class="page-link" href="javascript:;" aria-label="Previous"
	      @click="paging(pages.prevPageNumber)">
	        <span aria-hidden="true">&laquo;</span>
	      </a>
	    </li>
	    <!-- 回到第一页 -->
	    <template v-if="(pages.pageNumber-4)>1">
	    	<li class="page-item">
		    	<a class="page-link" href="javascript:;"
		    	@click="paging(1)">1</a>
		    </li>
		    <li class="page-item disabled ">
		    	<a class="page-link">...</a>
		    </li>
	    </template>
	    <template v-for="page in pages.pageNumbers">
		    <li class="page-item" :class="{active:(page==pages.pageNumber)}">
		    	<a class="page-link" href="javascript:;"
		    	@click="paging(page)">{{page}}</a>
		    </li>
		</template>
		<!-- 回到最后一页 -->
		 <template v-if="(pages.pageNumber+4+1)<pages.lastPageNumber">
		    <li class="page-item disabled ">
		    	<a class="page-link">...</a>
		    </li>
		    <li class="page-item">
		    	<a class="page-link" href="javascript:;"
		    	@click="paging(pages.lastPageNumber)">{{pages.lastPageNumber}}</a>
		    </li>
	    </template>

	    <li v-if="!pages.lastPage" class="page-item">
	      <a class="page-link" href="javascript:;" aria-label="Next"
	      @click="paging(pages.nextPageNumber)">
	        <span aria-hidden="true">&raquo;</span>
	      </a>
	    </li>
	    <div class="input-group page-input">
		  <input type="number" class="form-control" v-model="formPage" placeholder="Page" aria-label="Recipient's username" aria-describedby="basic-addon2">
		  <button class="input-group-addon" id="basic-addon2" @click="paging(formPage)">Go</button>
		</div>
	  </ul>
	</nav>
</template>
<script>
  export default {
    name: 'pagepublic',
    props: ['pages'],
    data () {
      return {
        formPage: ''
      }
    },
    methods: {
      paging (pageno) {
        this.$emit('paging', pageno)
      }
    }
  }
</script>
