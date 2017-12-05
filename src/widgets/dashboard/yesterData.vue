<template>
<div>
    <div class=" pb-2 text-md-left">
      <span class="align-middle"><i class="fa fa-paper-plane-o mr-2"></i> 昨日数据<span class="font-xxxs">（{{endYesterday}}）</span></span>
    </div>
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
            <div class="card mb-3 p-2 ripple-wrapper" :class="[syns.diffNewUserCount>0?'b-primary':'b-danger']" v-ripple>
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
            <div class="card mb-3 p-2 ripple-wrapper" :class="[syns.diffNewWorkUserCount>0?'b-primary':'b-danger']" v-ripple>
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

    
</div>
</template>
<script>
import $ from "jquery"
import { Statistics } from '../../resources'
export default {
	name: 'Yesterday',
  props: ['syns','endYesterday']
}

</script>

