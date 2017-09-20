<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">表情管理</li>
      <li class="breadcrumb-item">表情列表</li>
    </ol>
    <div class="biaoqing-container">
    	<div class="biaoqing-table">
			<table class="table table-bordered table-hover">
				<thead>
		    		<tr>
				      <th>封面</th>
				      <th>表情ID</th>
				      <th>内容</th>
				      <th>发布人</th>
				      <th>发布时间<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>浏览量<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>点赞<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>评论数<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>分享次数<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>改图次数</th>
				      <th>最后回复<span class="biaoqing-sort fa fa-sort"></span></th>
				      <th>热门在线</th>
				      <th>操作人</th>
				      <th>操作</th>
				    </tr>
		    	</thead>
		    	<tbody>
		    		<tr>
		    			<td>
		    				<div class="biaoqing-list-cover">
		    					<img src="https://img.biaoqing.com/work/20170824/0801320001780.gif!thumb240" alt="">
		    				</div>
		    			</td>
		    			<td>
		    				4545221
		    			</td>
		    			<td class="max-width100">
		    				<span class="biaoqing-table-content">#斗图# #蘑菇头#</span>
		    			</td>
		    			<td class="max-width20">
		    				<span>斗图蘑菇头</span>
		    			</td>
		    			<td class="max-width100 publish-time">
		    				<span>2017-08-24 16:00</span>
		    			</td>
		    			<td class="view-num">
		    				<span>1212</span>
		    			</td>
		    			<td class="like-num">
		    				<span>122</span>
		    			</td>
		    			<td class="pl-num">
		    				<span>3220</span>
		    			</td>
		    			<td class="share-num">
		    				<span>8220</span>
		    			</td>
		    			<td class="change-num">
		    				<span>20</span>
		    			</td>
		    			<td class="max-width100 last-comment">
		    				<span>2017-08-25 16:00</span>
		    			</td>
		    			<td class="publish-hot">
		    				<span>上线</span>
		    			</td>
		    			<td class="operation">
		    				<span>小猫</span>
		    			</td>
		    			<td class="operation-item">
		    				<span><i class="operation-icon fa fa-send"></i>详情</span>
		    				<span class="text-danger"><i class="operation-icon fa fa-trash-o"></i>删除</span>
		    			</td>
		    		</tr>
		    	</tbody>
			</table>
	    </div>	
    </div>
</div>

</template>

<script>
import '../../../static/css/biaoqing/biaoqing.css'

export default {
	data: () => ({
		loading: false
	}),
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	
    } 
}
</script>
