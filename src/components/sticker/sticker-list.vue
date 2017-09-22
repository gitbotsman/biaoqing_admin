<template>
<div>
	贴纸列表
</div>

</template>

<script>
import { TopicManage } from '../../resources'
import { viewImg, clearViewImg,formatTime } from '../../misc/utils'
import toastr from '../../misc/toastr.esm'

export default {
	data: () => ({
		loading: false
	}),
	beforeRouteEnter (to,form,next) {
		next()
	},
    mounted () {
      this.$emit('loaded')
    },
    methods: {
    	
    } 
}
</script>
