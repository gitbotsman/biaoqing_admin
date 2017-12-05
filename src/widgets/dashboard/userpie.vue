<template>
<div>
	<div class=" pb-2 text-md-left mt-3">
      <span class="align-middle"><i class="fa fa-paper-plane mr-2"></i> 用户数据分析</span>
    </div>
    <div class="biaoqing-container flex" style="margin:0;">
		<div class="chart-pie" style="width: 660px;">
		    <div class="chart-pie-title" style="font-size:25px; text-align:center;padding:10px 0;">用户注册平台
		      <span style="font-size:13px;">（用户总数：{{allUserNum}}）</span></div>
		    <canvas id="user-data"></canvas>
		</div>
	</div>
</div>
</template>
<script>
import $ from "jquery"
import { Statistics } from '../../resources'

export default {
	name: 'Pie',
	data () {
      return {
        allUserNum: ''
      }
    },
    mounted(){
    	var ctx = $('#user-data');
		Promise.all([Statistics.users()]).then(([usersData]) => {
			var userArr= usersData.data.data
			var ios_num =0;
			var android_num =0;
			var applet_num =0;
			var other_num =0;
			var pc_num =0;
			for (let i=0;i<userArr.length;i++) {
			    if(userArr[i].type==5){
			      applet_num += userArr[i].userNum;
			    }else if(userArr[i].type==2){
			      ios_num += userArr[i].userNum;
			    }else if(userArr[i].type==1){
			      pc_num += userArr[i].userNum;
			    }else if(userArr[i].type==3){
			      android_num += userArr[i].userNum;
			    }else{
			      other_num += userArr[i].userNum;
			    }
			} 
			var allUserNum = applet_num+android_num + ios_num + pc_num + other_num;
			var appletPercentage = ((applet_num/allUserNum)*100).toFixed(2)+'%',
			    androidPercentage = ((android_num/allUserNum)*100).toFixed(2)+'%',
			    iosPercentage = ((ios_num/allUserNum)*100).toFixed(2)+'%',
			    pcPercentage = ((pc_num/allUserNum)*100).toFixed(2)+'%',
			    otherPercentage = ((other_num/allUserNum)*100).toFixed(2)+'%';
			var opt={
			  labels:['小程序','安卓','IOS平台','PC','其他'],
			  data:[applet_num,android_num,ios_num,pc_num,other_num],
			  Percentage:[appletPercentage,androidPercentage,iosPercentage,pcPercentage,otherPercentage]
			}
			this.allUserNum=allUserNum;
			this.timeType='all';
			this.drawpie(ctx,opt)
		})
    },
    methods:{
    	drawpie(ctx,opt){
    		var data = {
		      	datasets: [{
		          data: opt.data,
		          Percentage:opt.Percentage,
		          backgroundColor:[
		            '#FF3D67',
		            '#69D2E7',
		            '#E0E4CC',
		            '#F38630',
		            '#FFCD56'
		          ]
		      	}],
		      	labels: opt.labels
		  	};
			var options={
				legend:{
				  display:true,
				  position:'left',
				  labels:{
				    generateLabels:function(tooltipItem,data){
				      var arr=[
				        {
				          text:tooltipItem.config.data.labels[0]+'：'+tooltipItem.config.data.datasets[0].data[0],
				          fillStyle:tooltipItem.config.data.datasets[0].backgroundColor[0]
				        },
				        {
				          text:tooltipItem.config.data.labels[1]+'：'+tooltipItem.config.data.datasets[0].data[1],
				          fillStyle:tooltipItem.config.data.datasets[0].backgroundColor[1]
				        },
				        {
				          text:tooltipItem.config.data.labels[2]+'：'+tooltipItem.config.data.datasets[0].data[2],
				          fillStyle:tooltipItem.config.data.datasets[0].backgroundColor[2]
				        },
				        {
				          text:tooltipItem.config.data.labels[3]+'：'+tooltipItem.config.data.datasets[0].data[3],
				          fillStyle:tooltipItem.config.data.datasets[0].backgroundColor[3]
				        },
				        {
				          text:tooltipItem.config.data.labels[4]+'：'+tooltipItem.config.data.datasets[0].data[4],
				          fillStyle:tooltipItem.config.data.datasets[0].backgroundColor[4]
				        }
				      ]
				      return arr
				    }
				  }
				},
				layout:{
				  padding:{
				    right:120
				  }
				},
				tooltips:{
				  bodySpacing:4,
				  xPadding:10,
				  yPadding:10,
				  callbacks:{
				    label:function(tooltipItem,data){
				      var text = data.labels[tooltipItem.index]+'：'+data.datasets[0].data[tooltipItem.index]+'个';
				      return text+',占比:'+data.datasets[0].Percentage[tooltipItem.index]
				    }
				  }
				},
			}
			var myPieChart = new Chart(ctx,{
				type: opt.type || 'pie',
				data: data,
				options: options
			});
    	} //drawpie
    }


}

</script>