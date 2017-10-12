<template>
<div>
	<ol class="breadcrumb">
      <li class="breadcrumb-item">
      	<router-link class="aside-item" to="/subjectmanage" v-ripple.stop><span>表情管理</span></router-link>
      </li>
      <li class="breadcrumb-item">表情详情</li>
    </ol>
</div>
</template>
<script>
import { Subject } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import swal2 from 'sweetalert2'
import querystring from 'querystring'
import $ from 'jquery'

export default{
	data:() => ({
		loading: false
	}),
	beforeRouteEnter(to,form,next){
		var subjectId = to.params.id;

		next()
	},
	mounted () {
      	this.$emit('loaded',false)
    }
}


</script>