<template>
  <div class="p-3">

    <div class="px-3 pb-2 text-md-left">
      <span class="align-middle"><i class="fa fa-bar-chart"></i> 报表、统计</span>
    </div>

    <div class="row row-gap-5 text-center">
      <div class="col-lg-2 col-sm-4 pointer">
        <div class="card mb-3 p-2" v-ripple>
          <div class="to-corner h5 m-0">
            <div class="bg-primary rad-15 px-2 py-1 text-white">615</div>
          </div>
          <div class="my-3"><i class="fa fa-flag fa-3x"></i></div>
          <div class="text-center h4 m-0 text-muted">直播主题</div>
        </div>
      </div>
      <div class="col-lg-2 col-sm-4 pointer">
        <div class="card mb-3 p-2" v-ripple>
          <div class="my-3"><i class="fa fa-list-alt fa-3x"></i></div>
          <div class="text-center h4 m-0 text-muted">直播用户</div>
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
      <div class="col-lg-2 col-sm-4 pointer">
        <div class="card mb-3 p-2" v-ripple>
          <div class="to-corner h5 m-0">
            <div class="bg-warning rad-15 px-2 py-1 text-white">45</div>
          </div>
          <div class="my-3"><i class="fa fa-hdd-o fa-3x"></i></div>
          <div class="text-center h4 m-0 text-muted">Servers</div>
        </div>
      </div>
      <div class="col-lg-4 col-sm-8 pointer text-left">
        <div class="row row-gap-5">
          <div class="col-6">
            <div class="card mb-3 p-2 b-primary">
              <h2 class="m-0">$7,221</h2>
              <div class="text-muted mb-3">Budget</div>
              <div class="text-green">
                <i class="fa fa-long-arrow-up fa-2x"></i>
                <span class="h5 m-0">+15% +$45</span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card mb-3 p-2 b-danger">
              <h2 class="m-0">15,259</h2>
              <div class="text-muted mb-3">Downloads</div>
              <div class="text-danger">
                <i class="fa fa-long-arrow-down fa-2x"></i>
                <span class="h5 m-0"> -0.5% -123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row row-gap-5">
      <div class="col-md-12">

        <div class="card mb-3 b-0">
          <ul class="nav nav-tabs nav-line" role="tablist">
            <li class="nav-item"><a class="nav-link active" data-toggle="tab" data-target="#changlog" role="tab"><i class="fa fa-tag"></i> 最近更新</a></li>
            <li class="nav-item"><a class="nav-link" data-toggle="tab" data-target="#timeline" role="tab"><i class="fa fa-clock-o"></i> 更新时间轴</a></li>
          </ul>
          <div class="tab-content p-3">
            <div class="tab-pane active" id="changlog" role="tabpanel">
              <h1 class="text-primary">v{{changelog[0].version}}</h1>
              <p>主要变动以及BUG修复如下：</p>
              <ul>
                <li class="mb-2" v-for="(fix, idx) in changelog[0].changes" v-html="fix"></li>
              </ul>
            </div>
            <div class="tab-pane" id="timeline" role="tabpanel">
              <div class="float-right">
                <label class="ui-checkbox">
                  <input type="checkbox" onclick="$('#changelog-timeline').toggleClass('center')"><i></i> 居中对齐
                </label>
                <label class="ui-checkbox">
                  <input type="checkbox" onclick="$('#changelog-timeline').toggleClass('blocked')"><i></i> 块级显示
                </label>
              </div>
              <div id="changelog-timeline" class="timeline center">
                <div class="timeline-heading"><span>今天</span></div>
                <div class="timeline-panel" v-for="(item,  index) in changelog">
                  <div class="timeline-content">
                    <div class="timeline-date">{{item.time}}</div>
                    <div class="card mb-3 p-3 b-0">
                      <h1 class="text-primary">v{{item.version}}</h1>
                      <p>{{item.time}}主要变动以及BUG修复如下：</p>
                      <ul>
                        <li class="mb-2" v-for="(fix, idx) in item.changes" v-html="fix"></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="timeline-heading">项目启动</div>
              </div>
            </div>
          </div>
        </div>


        <div class="card widget-weather">
          <div class="row">
            <div class="col-md-4">
              <div class="actual text-white" style="background:url(/static/img/london.jpg) center; background-size:cover">
                <p>Today</p>
                <h2 class="m-0"><i class="icon-map-marker"></i> London</h2>
                <h3 class="m-0">73°</h3>
              </div>
            </div>
            <div class="col-md-8">
              <div class="row days">
                <div class="col-md-3 col-sm-6" v-for="item in 4">
                  <p>Tue</p>
                  <h5>Partly Cloudy</h5>
                  <h3>78°</h3>
                  <h3>53°</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import changelog from '../assets/changelog'
  export default {
    data: () => ({
      colors: ['success', 'info', 'danger', 'primary', 'warning', ''],
      changelog: changelog
    }),
    mounted () {
      this.$emit('loaded')
    }
  }
</script>
