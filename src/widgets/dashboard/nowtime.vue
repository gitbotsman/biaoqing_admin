<template>
<div>
	<div class=" pb-2 text-md-left">
      <span class="align-middle"><i class="fa fa-paper-plane mr-2"></i> 实时数据</span>
    </div>
    <div class="biaoqing-container" style="margin:0;">
      <div class="flex-center mt-1 pr">
        <div  class="md-form-group pr" :class="[startTime==''?'md-float-label':'']" style="padding-bottom:0;">
          <input @keyup.enter="queryTimeEmitter" class="md-input pr" v-model="startTime" > <label>开始时间</label>
        </div>
        <span class="ti-minus ml-2" style="padding-top:18px;"></span>
        <div class="md-form-group ml-3" :class="[endTime==''?'md-float-label':'']" style="padding-bottom:0;">
          <input @keyup.enter="queryTimeEmitter" class="md-input" v-model="endTime"> <label>结束时间</label>
        </div>

        <button class="btn btn-primary mt-2 ml-4 btn-sm" @click="queryTimeEmitter" style="padding:5px 15px">查询</button>

        <div class="biaoqing-topic-info ml-4"  style="margin-top:10px;"><i class="operation-icon fa fa-info-circle "></i>输入的时间格式为YYYY-MM-DD（比如：<code>2017-01-01</code>），结束时间不能小于开始时间，空为当前时间。</div>
      </div>
      <div class="biaoqing-table">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>新注册用户数</th>
                <th>热门作品数</th>
                <th>删除作品数</th>
                <th>新发布作品数</th>
                <th>发布作品用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{queryTime.newUserCount}}</td>
                <td>{{queryTime.hotWorkCount}}</td>
                <td>{{queryTime.deleteWorkCount}}</td>
                <td>{{queryTime.newWorkCount}}</td>
                <td>{{queryTime.newWorkUserCount}}</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
</div>

</template>
<script>
import $ from "jquery"
import { Statistics } from '../../resources'

export default {
	name: 'Now',
	props: ['queryTime'],
	data () {
      return {
        startTime:'',
		endTime:''
      }
    },
    mounted(){
    	var now = new Date();
		var nowYear = now.getFullYear(),
		  nowMonth = now.getMonth()+1,
		  nowDay = now.getDate();
		if(nowMonth<=9){
		nowMonth='0'+nowMonth;
		}
		if(nowDay<=9){
		nowDay='0'+nowDay;
		}
		var nowtime = nowYear+'-'+nowMonth+'-'+nowDay;
		this.startTime=nowtime;
		this.endTime=nowtime;
    },
    methods:{
    	queryTimeEmitter:function(){
    		var startTime=this.startTime;
			var endTime=this.endTime;

    		this.$emit('queryTimeEmitter', startTime,endTime)
    	}
    }
}	

</script>