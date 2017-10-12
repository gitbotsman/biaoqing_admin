<template>
  <div class="p-3">

    <div class=" pb-2 text-md-left">
      <span class="align-middle"><i class="fa fa-paper-plane-o mr-2"></i> 昨日数据<span class="font-xxxs">（{{endYesterday}}）</span></span>
    </div>
    
    <!-- <div class="row row-gap-5 text-center">
      <div class="col-lg-2 col-sm-4 pointer">
        <div class="card mb-3 p-2" v-ripple>
          <div class="to-corner h5 m-0">
            <div class="bg-primary rad-15 px-2 py-1 text-white">615</div>
          </div>
          <div class="my-3"><i class="fa fa-flag fa-3x"></i></div>
          <div class="text-center h4 m-0 text-muted">直播主题</div>
        </div>
      </div>
      <router-link class="col-lg-2 col-sm-4 pointer" to="/html/ui.font-awesome-icons.html">
        <div class="card mb-3 p-2" v-ripple>
          <div class="to-corner h5 m-0">
            <div class="bg-primary rad-15 px-2 py-1 text-white">138</div>
          </div>
          <div class="my-3"><i class="fa fa-users fa-3x"></i></div>
          <div class="text-center h4 m-0 text-muted">系统用户</div>
        </div>
      </router-link>
    </div> -->
    <div class="row row-gap-5 text-center">
      <div class="col-sm-12 pointer text-left">
        <div class="flex">
          <div class="flex-item mr-2">
            <div class="card mb-3 p-2 ripple-wrapper" :class="[syns.diffNewUserCount>0?'b-primary':'b-danger']" v-ripple>
              <h2 class="m-0">{{syns.newUserCount}}</h2>
              <div class="text-muted mb-3">新注册用户数</div>
              <div class="text-green" v-if="syns.diffNewUserCount>0">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+{{syns.diffNewUserCount}}</span>
              </div>
              <div class="text-danger" v-else>
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> {{syns.diffNewUserCount}}</span>
              </div>
            </div>
          </div>
          <div class="flex-item mr-2 pointer">
            <div class="card mb-3 p-2 ripple-wrapper" :class="[syns.diffHotWorkCount>0?'b-primary':'b-danger']" v-ripple>
              <h2 class="m-0">{{syns.hotWorkCount}}</h2>
              <div class="text-muted mb-3">热门作品数</div>
              <div class="text-green " v-if="syns.diffHotWorkCount>0">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+{{syns.diffHotWorkCount}}</span>
              </div>
              <div class="text-danger" v-else>
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> {{syns.diffHotWorkCount}}</span>
              </div>
            </div>
          </div>
          <div class="flex-item mr-2">
            <div class="card mb-3 p-2 ripple-wrapper" :class="[syns.diffDeleteWorkCount>0?'b-primary':'b-danger']" v-ripple>
              <h2 class="m-0">{{syns.deleteWorkCount}}</h2>
              <div class="text-muted mb-3">删除作品数</div>
              <div class="text-green" v-if="syns.diffDeleteWorkCount>0">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+{{syns.diffDeleteWorkCount}}</span>
              </div>
              <div class="text-danger" v-else>
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> {{syns.diffDeleteWorkCount}}</span>
              </div>
            </div>
          </div>
          <div class="flex-item mr-2">
            <div class="card mb-3 p-2" :class="[syns.diffNewUserCount>0?'b-primary':'b-danger']" v-ripple>
              <h2 class="m-0">{{syns.newWorkCount}}</h2>
              <div class="text-muted mb-3">新发布作品数</div>
              <div class="text-green" v-if="syns.diffNewUserCount>0">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+{{syns.diffNewWorkCount}}</span>
              </div>
              <div class="text-danger" v-else>
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> {{syns.diffNewWorkCount}}</span>
              </div>
            </div>
          </div>
          <div class="flex-item">
            <div class="card mb-3 p-2" :class="[syns.diffNewWorkUserCount>0?'b-primary':'b-danger']" v-ripple>
              <h2 class="m-0">{{syns.newWorkUserCount}}</h2>
              <div class="text-muted mb-3">发布作品用户数</div>
              <div class="text-green" v-if="syns.diffNewWorkUserCount>0">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+{{syns.diffNewWorkUserCount}}</span>
              </div>
              <div class="text-danger" v-else>
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> {{syns.diffNewWorkUserCount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

        <div class="biaoqing-topic-info ml-4" :class="{'text-danger' : timeError}" style="margin-top:10px;"><i class="operation-icon fa fa-info-circle "></i>输入的时间格式为YYYY-MM-DD（比如：<code>2017-01-01</code>），结束时间不能小于开始时间，空为当前时间。</div>
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
    <div class=" pb-2 text-md-left">
      <span class="align-middle"><i class="fa fa-paper-plane mr-2"></i> 用户数据分析</span>
    </div>
    <div class="biaoqing-container" style="margin:0;">
      <schart :canvasId="charts.canvasId"
            :type="charts.type"
            :width="charts.width"
            :height="charts.height"
            :data="charts.data"
            :options="charts.options"
        ></schart>
    </div>
  </div>

</template>
<script>
  import { Statistics } from '../resources'
  import { viewImg, clearViewImg,formatTime } from '../misc/utils'
  import toastr from '../misc/toastr.esm'
  import swal2 from 'sweetalert2'
  import querystring from 'querystring'
  import $ from 'jquery'
  import Schart from 'vue-schart';

  export default {
    data: () => ({
      charts:{
        canvasId: 'myCanvas',
        type: 'bar',
        width: 500,
        height: 400,
        data: [
            {name: '2014', value: 1342},
            {name: '2015', value: 2123},
            {name: '2016', value: 1654},
            {name: '2017', value: 1795},
        ],
        options: {
            title: 'Total sales of stores in recent years'
        }
      },
      colors: ['success', 'info', 'danger', 'primary', 'warning', ''],
      startTime:'',
      endYesterday:'',
      timeError:false,
      endTime:'',
      syns:'',
      time:'',
      queryTime:''
    }),
    mounted () {
      this.$emit('loaded');
    },
    beforeRouteEnter (to,form,next) {
      var now = new Date();
      var nowYear = now.getFullYear(),
          nowMonth = now.getMonth()+1,
          nowDay = now.getDate();
      var nowtime = nowYear+'-'+nowMonth+'-'+nowDay;

      var yesterday = new Date();
      yesterday.setTime(yesterday.getTime()-24*60*60*1000);
      var endYesterday = yesterday.getFullYear()+"-" + (yesterday.getMonth()+1) + "-" + yesterday.getDate();

      var yesterdayTwo = new Date();
      yesterdayTwo.setTime(yesterdayTwo.getTime()-24*60*60*1000*2);
      var endYesterdayTwo = yesterdayTwo.getFullYear()+"-" + (yesterdayTwo.getMonth()+1) + "-" + yesterdayTwo.getDate();
      //昨天的参数
      var yesterOneData = {startDate:endYesterday,endDate:endYesterday}
      //前天的参数
      var yesterTwoData = {startDate:endYesterdayTwo,endDate:endYesterdayTwo}

      var requests =[ Statistics.syn(yesterOneData),Statistics.syn(yesterTwoData),Statistics.syn(),Statistics.users()]
      Promise.all(requests).then(([syns,yesterdaySyns,today]) => {
        /** 
         **** 作品数据分析 
        **/
        var todayData = syns.data.data;
        var yesterdayData = yesterdaySyns.data.data;
        todayData.diffDeleteWorkCount = parseInt(todayData.deleteWorkCount)-parseInt(yesterdayData.deleteWorkCount);
        todayData.diffHotWorkCount = parseInt(todayData.hotWorkCount)-parseInt(yesterdayData.hotWorkCount);
        todayData.diffNewUserCount = parseInt(todayData.newUserCount)-parseInt(yesterdayData.newUserCount);
        todayData.diffNewWorkCount = parseInt(todayData.newWorkCount)-parseInt(yesterdayData.newWorkCount);
        todayData.diffNewWorkUserCount = parseInt(todayData.newWorkUserCount)-parseInt(yesterdayData.newWorkUserCount);
        /** 
         **** 用户来源数据分析 
        **/


        next(vm => {
            vm.queryTime = today.data.data;
            vm.syns=todayData;
            vm.endYesterday=endYesterday;
        })
      })
    },
    methods: {
      getYesterday:function(){
        var now = new Date();
        now.setTime(now.getTime()-24*60*60*1000);
        var yesterday = now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();
        return yesterday;
      },
      queryTimeEmitter:function(){
        var now = new Date();
        var nowYear = now.getFullYear(),
            nowMonth = now.getMonth()+1,
            nowDay = now.getDate();
        var nowtime = nowYear+'-'+nowMonth+'-'+nowDay;
        var startTime = this.startTime;
        var endTime = this.endTime;
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
          this.timeError=false;
        }else{
          this.timeError=true;
          this.$notice.error('时间格式错误');
        }
      }
    },
    components:{
        Schart
    }
  }
</script>
