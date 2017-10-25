<template>
  <div>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">系统管理</li>
      <li class="breadcrumb-item">系统参数</li>
    </ol>
    <div class="biaoqing-container">
      <div @click="openAdd" class="btn cursor btn-primary btn-sm mt-2 "><i class="fa fa-plus-circle mr-2"></i>新增</div>
      <div class="biaoqing-table">
      <table class="table table-bordered table-hover ">
          <thead>
            <tr>
              <th>名称</th>
              <th>key</th>
              <th>group</th>
              <th>值</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(system,index) in systems.items">
              <td class="max-width100">
                <span class="biaoqing-table-content">{{system.remark}}</span>
              </td>
              <td class="max-width20">
                <span class="biaoqing-table-content">{{system.key}}</span>
              </td>
              <td class="max-width20 ">
                <span >{{system.group}}</span>
              </td>
              <td class="view-num biaoqing-table-content max-width100">
                <span>{{system.value}}</span>
              </td>
              <td class="view-num cursor pass-success" @click="update(system.id,index)">
                  修改
              </td>
            </tr>
          </tbody>
      </table>
      </div>  
    </div>
    <div class="add-banner-mask" :class="{'none':openAddData==false}">
      <div class="add-banner-mask-bg" @click="closeAdd"></div>
      <div class="add-banner-mask-main">
        <div class="h5 add-title">新增系统参数</div>
        <div class="add-banner-mask-input mb-3 mt-2">
          <div  class="md-form-group pr" :class="[addName==''?'md-float-label':'']" style="padding-bottom:0;">
            <input @keyup.enter="" class="md-input pr" v-model="addName" > <label>名称</label>
          </div>
          <div  class="md-form-group pr mt-2" :class="[addKey==''?'md-float-label':'']" style="padding-bottom:0;">
            <input @keyup.enter="" class="md-input pr" v-model="addKey" > <label>KEY</label>
          </div>
          <div  class="md-form-group pr" :class="[addGroup==''?'md-float-label':'']" style="padding-bottom:0;">
            <input @keyup.enter="" class="md-input pr" v-model="addGroup" > <label>GROUP</label>
          </div>
          <div  class="md-form-group pr mt-2" :class="[addValue==''?'md-float-label':'']" style="padding-bottom:0;">
            <input @keyup.enter="" class="md-input pr" v-model="addValue" > <label>值</label>
          </div>
        </div>
        <div class="add-banner-mask-btn mt-3">
          <button @click="closeAdd" class="btn mr-3 btn-secondary">取消</button>
          <button @click="addSystemData" class="btn btn-primary">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {SystemData} from '../../resources'
  import swal2 from 'sweetalert2'

  export default {
    data: () => ({
      loading: false,
      systems:'',
      openAddData:false,
      addKey:'',
      addName:'',
      addGroup:'',
      addValue:''
    }),
    beforeRouteEnter (to, from, next) {
      Promise.all([SystemData.system()]).then(([systems])=>{
        next(vm=>{
          vm.systems=systems.data.data
        })
      })
    },
    mounted () {
        this.$emit('loaded',false)
    },
    methods:{
      openAdd(){this.openAddData=true},
      closeAdd(){this.openAddData=false},
      update(id,index){
        var $this = this;
        var systems =this.systems;
        var parems={
          "id": id
        }
        swal2({
          title: '请输入修改的值',
          text:'谨慎操作！',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showLoaderOnConfirm: true,
          reverseButtons:true,
            preConfirm:function(value){
              return new Promise(function(resolve,reject){
                if(value !=''){
                  parems.value=value;
                  $this.$http.post('/systemParam',parems).then(res=>{
                    if(res.data.code==200){
                      $this.$notice.success('修改成功');
                      for(var i=0;i<systems.items.length;i++){
                        systems.items[index].value=parems.value;
                      }
                    }else{
                      $this.$notice.error(res.data.msg)
                    }
                  })
                  swal2.close();
                }else{
                  reject('请输入值');
                }
              })
            }
        }).catch(swal2.noop)
      },
      addSystemData(){
        var addKey = this.addKey;
        var addName = this.addName;
        var addGroup = this.addGroup;
        var addValue = this.addValue;
        if(addKey!='' && addName!='' && addGroup!=' '&& addValue!=''){
          var params={
            "group": addGroup,
            "key": addKey,
            "remark": addName,
            "value": addValue
          }
          this.$http.post('/systemParam',params).then(res => {
            if(res.data.code==200){
              this.$notice.success('请求成功');
              this.openAddData=false;
              this.addKey='';
              this.addName='';
              this.addGroup='';
              this.addValue='';
              Promise.all([SystemData.system()]).then(([systems])=>{
                this.systems=systems.data.data
              })
            }else{
              this.$notice.error(res.data.msg)
            }
          })
        }else{
          this.$notice.error('请填写正确的参数')
        }
      }
    }
  }
</script>
<style>
  .none{
    display: none;
  }
  .add-title{
    text-align: center;
  }
  .add-banner-mask{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999;
  }
  .add-banner-mask-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 997;
    background: rgba(0,0,0,.2)
  }
  .add-banner-mask-main{
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -200px;
    background: #fff;
    z-index: 998;
    padding: 10px 20px;
    width: 400px;
  }
  .add-banner-mask-container{
    width: 375px;
    height: 150px;
  }
  .add-banner-mask-btn{
    text-align: center;
  }
  .add-banner-mask-container img{
    text-align: center;
    font-size: 20px;
    line-height: 150px;
    color: #fff;
    width: 375px;
    height: 150px;
    background: #ccc;
  }
</style>