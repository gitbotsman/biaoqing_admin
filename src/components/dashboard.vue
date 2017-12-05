<template>
  <div class="p-3">
    <Yesterday :syns="syns" :endYesterday="endYesterday"></Yesterday>
    <Now :queryTime="queryTime" @queryTimeEmitter="queryTimeEmitter"></Now>
    <Pie></Pie>
  </div>
</template>
<script>
  import Pie from '../widgets/dashboard/userpie.vue'
  import Now from '../widgets/dashboard/nowtime.vue'
  import Yesterday from '../widgets/dashboard/yesterdata.vue'
  import { Statistics } from '../resources'
  import toastr from '../misc/toastr.esm'
  import {todaydata} from '../misc/utils'

  import swal2 from 'sweetalert2'
  import querystring from 'querystring'
  import $ from 'jquery'
  import 'chart.js'

  export default {
    data: () => ({
      queryTime:'',
      endYesterday:'',
      syns:''
    }),
    mounted () {
      this.$emit('loaded');
    },
    beforeRouteEnter (to,form,next) {
      var now = new Date();
          now.setTime(now.getTime()-24*60*60*1000);
      var endYesterday = now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();

          now.setTime(now.getTime()-24*60*60*1000*2);
      var endYesterdayTwo = now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();
      //昨天的参数
      var yesterOneData = {startDate:endYesterday,endDate:endYesterday}
      var yesterTwoData = {startDate:endYesterdayTwo,endDate:endYesterdayTwo}
      var requests =[ Statistics.syn(yesterOneData),Statistics.syn(yesterTwoData),Statistics.syn()]
      Promise.all(requests).then(([syns,yesterdaySyns,queryTime]) => {
        var todayData =todaydata(syns.data.data,yesterdaySyns.data.data)
        next (vm=>{
          vm.syns = todayData;
          vm.endYesterday=endYesterday
          vm.queryTime=queryTime.data.data;
        })
      })
    },
    methods: {
        // 查询实时数据
        queryTimeEmitter:function(startTime,endTime){
          var now = new Date();
          var nowYear = now.getFullYear(),
              nowMonth = now.getMonth()+1,
              nowDay = now.getDate();
          var nowtime = nowYear+'-'+nowMonth+'-'+nowDay;
          var startTime =startTime;
          var endTime = endTime;

          var regDate=/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
          if(startTime =='' && endTime ==''){
            endTime=nowtime;
            startTime=nowtime;
          }else if(endTime == ''){
            endTime=nowtime;
          }else if (startTime ==''){
            startTime=nowtime;
          }
          var startDateFormat = regDate.test(startTime);
          var endDateFormat = regDate.test(endTime);

          if(startDateFormat && endDateFormat){
            this.$emit('loaded',true);
            var data = {startDate:startTime,endDate:endTime}
            Promise.all([Statistics.syn(data)]).then(([res]) => {
              this.$emit('loaded',false);
              this.queryTime = res.data.data;
              this.startTime=startTime;
              this.endTime=endTime;
            })
          }else{
            this.$notice.error('时间格式错误');
          }
        }
    },
    components:{Pie,Now,Yesterday}
  }
</script>
