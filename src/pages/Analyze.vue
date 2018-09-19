<template>
  <div class="row" style="">
    <div id="allmap" ref="allmap" class="bm-view"></div>
    <Row>
      <Col span="24" style="background: #fff;padding: 10px">
      <label>用户分布情况</label>
      <a class=" pull-right" href="#"  @click.prevent="reset">
        <Icon type="ios-reload"></Icon>
        数据重置
      </a>
      </Col>
      <Col span="24">
      <!--<div id="allmap" ref="allmap" class="bm-view"></div>-->
      <table class="table table-bordered"  v-show="showTable">
        <thead>
        <tr>
          <th>簇标签</th>
          <th>用户聚集中心经度</th>
          <th>用户聚集中心纬度</th>
          <th>用户数量</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in cluster" :key="index">
          <td>{{item[3]}}</td>
          <td><Input v-model="item[0]"></Input></td>
          <td><Input v-model="item[1]"></Input></td>
          <td>{{item[2]}}</td>
        </tr>
        </tbody>
      </table>
      </Col>
    </Row>
    <div class="col-xs-12" style="position: absolute;left: 0px;top: 10px;">
      <Row>
        <Col span="24" class="demo-tabs-style1"  style="background: #fff;padding: 8px 10px;margin-bottom: 20px">
        <Form ref="formInline" :model="filters" :rules="ruleInline" :label-width="80" inline>
          <FormItem prop="enbid" label="基站编号">
            <Input type="text" v-model="filters.enbid" placeholder="输入基站编号" style="width: 200px">
            </Input>
          </FormItem>
          <FormItem prop="cellid" label="小区编号">
            <Input type="text" v-model="filters.cellid" placeholder="输入小区编号" style="width: 100px">
            </Input>
          </FormItem>
          <!--<FormItem prop="dateValue" label="时间">-->
          <!--<DatePicker type="datetimerange" :value="filters.dateValue" :options="options" @on-change="handleChange" :clearable=false format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间范围" style="width: 300px"></DatePicker>-->
          <!--</FormItem>-->
          <FormItem :label-width="10">
            <Button type="primary" @click="handleSubmit('formInline')">开始分析</Button>
          </FormItem>
          <Steps :current="current">
            <Step title="分析邻区信息" :content="step1Msg"></Step>
            <Step title="关联用户数据" :content="step2Msg"></Step>
            <Step title="聚类分析" :content="step3Msg"></Step>
            <Step title="地图渲染" :content="step4Msg"></Step>
          </Steps>
          <!--<Button  class="pull-right" type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> Export source data</Button>-->
        </Form>
        </Col>
      </Row>

      <Row>
        <!--<Col span="12" offset="12" style="position: absolute;z-index: 999;top: 0px;left: 0;">-->
          <!---->
        <!--</Col>-->
        <div style="position: absolute;z-index: 999;top: 0;left: 0;">
          <ul class="toolbar-map">
            <li class="item-circle">
              <Button @click="ToBTSMarker" type="primary" shape="circle" icon="wodeweizhi"></Button>
            </li>
            <li class="item-circle">
              <Button id="settingsPanelButton" @click="showPanel=!showPanel" type="primary" shape="circle" icon="ios-settings"></Button>
            </li>
            <!--<li class="item-circle">-->
              <!--<div class="item-left" @click="modal = true">-->
                <!--<a><i class="icon icon-bar-chart"></i><span>邻小区信息</span></a>-->
                <!--<Modal v-model="modal" :closable="false" width="860">-->
                  <!--<table class="table table-bordered">-->
                    <!--<thead>-->
                    <!--<tr>-->
                      <!--&lt;!&ndash;<th v-for="(item,index) in ncell" :key="index">{{index}}</th>&ndash;&gt;-->
                      <!--<th>序号</th>-->
                      <!--<th>enbid</th>-->
                      <!--<th>cellid</th>-->
                      <!--<th>cellname</th>-->
                      <!--<th>lng</th>-->
                      <!--<th>lat</th>-->
                      <!--<th>indoor</th>-->
                      <!--<th>场景</th>-->
                      <!--<th>距离</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <!--<tbody>-->
                    <!--<tr v-for="(item,index) in ncell" :key="index">-->
                      <!--<td>{{index+1}}</td>-->
                      <!--<td>{{item['enbid']}}</td>-->
                      <!--<td>{{item['cellid']}}</td>-->
                      <!--<td>{{item['cellname']}}</td>-->
                      <!--<td>{{item['lng']}}</td>-->
                      <!--<td>{{item['lat']}}</td>-->
                      <!--<td>{{item['indoor']}}</td>-->
                      <!--<td>{{item['scene']}}</td>-->
                      <!--<td>{{item['距离']}}</td>-->
                      <!--&lt;!&ndash;<td>{{item[2]}}</td>&ndash;&gt;-->
                    <!--</tr>-->
                    <!--</tbody>-->
                  <!--</table>-->
                <!--</Modal>-->
              <!--</div>-->
              <!--<span class="fenge"></span>-->
              <!--<Switch v-model="switchNcell" size="small" @on-change="changeNcell"></Switch>-->
            <!--</li>-->
          </ul>
        </div>
        <div style="position: absolute;z-index: 999;top: 0;right: 0;">
          <ul class="toolbar-map pull-right">
            <li class="item">
              <div class="item-left link" @click="ToBTSMarker">
                <i class="iconfont ivu-icon-wodeweizhi"></i><span>我的基站</span>
              </div>
              <span class="fenge"></span>
              <Switch v-model="switch1" size="small" @on-change="change"></Switch>
            </li>
            <li class="item">
              <div class="item-left link" @click="modal = true">
                <i class="iconfont ivu-icon-jizhanxinhao"></i><span>邻小区信息</span>
                <Modal v-model="modal" :closable="false" width="860">
                  <table class="table table-bordered">
                    <thead>
                    <tr>
                      <!--<th v-for="(item,index) in ncell" :key="index">{{index}}</th>-->
                      <th>序号</th>
                      <th>enbid</th>
                      <th>cellid</th>
                      <th>cellname</th>
                      <th>lng</th>
                      <th>lat</th>
                      <th>indoor</th>
                      <th>场景</th>
                      <th>距离</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in ncell" :key="index">
                      <td>{{index+1}}</td>
                      <td>{{item['enbid']}}</td>
                      <td>{{item['cellid']}}</td>
                      <td>{{item['cellname']}}</td>
                      <td>{{item['lng']}}</td>
                      <td>{{item['lat']}}</td>
                      <td>{{item['indoor']}}</td>
                      <td>{{item['scene']}}</td>
                      <td>{{item['距离']}}</td>
                      <!--<td>{{item[2]}}</td>-->
                    </tr>
                    </tbody>
                  </table>
                </Modal>
              </div>
              <span class="fenge"></span>
              <Switch v-model="switchNcell" size="small" @on-change="changeNcell"></Switch>
            </li>
            <li class="item">
              <div class="item-left">
                <Icon type="person" size="14"></Icon><span>用户分布</span>
              </div>
              <span class="fenge"></span>
              <Switch v-model="switchUser" size="small" @on-change="changeUser"></Switch>
            </li>
            <li class="item">
              <div class="item-left link">
                <Poptip v-model="visible" title="基站选址数量动态设定" placement="right" width="300">
                  <Icon type="android-settings"></Icon><span>选址配置</span>
                  <div class="api" slot="content">
                    <Row>
                      <i-col span="24">
                        <template v-if="!formItem.slider[0]">
                          <p>暂无</p>
                        </template>
                        <template v-else>
                          <Form :model="formItem" label-position="top">
                            <!--<FormItem label="Title">-->
                            <!--<Input v-model="formItem.input1"></Input>-->
                            <!--</FormItem>-->
                            <!--<template v-if="!formItem.slider[0]">-->
                            <!--需运行-->
                            <!--</template>-->
                            <template v-for="(item,key) in formItem.slider">
                              <FormItem :label="'簇'+key+'建站数量'" :key="key">
                                <Slider style="margin: 0 25px" :tip-format="format" v-model="item.K" :min="1" :max="10" show-tip="always" show-stops></Slider>
                              </FormItem>
                            </template>
                            <!--<FormItem label="选址数量">-->
                            <!--<Slider style="margin: 0 20px" :tip-format="format" v-model="formItem.slider" :min="1" :max="10" show-stops></Slider>-->
                            <!--</FormItem>-->
                            <FormItem>
                              <Button type="primary" @click.native.prevent="handleSubmit2">确定</Button>
                              <Button type="ghost" @click="visible = false" style="margin-left: 8px">取消</Button>
                            </FormItem>
                          </Form>
                        </template>
                      </i-col>
                    </Row>
                  </div>
                </Poptip>
              </div>
            </li>
            <li class="item">
              <div class="item-left">
                <Dropdown :transfer="true" @on-click="handleClick" style="">
                  <a href="javascript:void(0)">
                    <i class="iconfont ivu-icon-gongjuxiang"></i><span>工具箱</span>
                    <Icon type="ios-arrow-down" style="margin-left: 5px"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="测距"><span class="little-label"><i class="iconfont ivu-icon-biaochi"></i><span>测距</span></span></DropdownItem>
                    <DropdownItem name="重置"><span class="little-label"><i class="iconfont ivu-icon-ios-reload"></i><span>重置</span></span></DropdownItem>
                    <DropdownItem divided><span class="little-label"><i class="iconfont ivu-icon-biaochi"></i><span>测距</span></span></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </li>
          </ul>
        </div>
      </Row>

      <Row id="settingsPanel">
        <!--<Button @click="showPanel=!showPanel" type="primary" shape="circle" icon="ios-search"></Button>-->
        <Col span="5" class="blur" style="position: absolute;z-index: 999;top: 80px;left: 0px;">
          <transition name="fade">
            <Row v-if="showPanel"  style="padding: 10px">
              <Tabs type="card" >
                <TabPane label="参数设置">
                  <Row>
                    <Col span="24" style="margin-bottom: 20px">
                    <Button type="primary" class="pull-right" size="small" @click="disabled = !disabled">
                      <template v-if="disabled">参数修改</template>
                      <template v-else>保存</template>
                    </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Form :model="formTop" label-position="top">
                      <FormItem label="聚类半径：米(eps)">
                        <Input v-model="formTop.input1" :disabled="disabled"></Input>
                      </FormItem>
                      <FormItem label="聚类用户数量(min_samples)">
                        <Input v-model="formTop.input2" :disabled="disabled"></Input>
                      </FormItem>
                      <FormItem label="聚类簇中心点数量(K)">
                        <InputNumber :max="10" :min="1" v-model="formTop.input3" :disabled="disabled"></InputNumber>
                        <!--<Input v-model="formTop.input3"></Input>-->
                      </FormItem>
                    </Form>
                  </Row>

                </TabPane>
                <TabPane label="参数说明">
                  <p>DBSCAN算法的重点是选取的聚合半径参数eps和聚合所需指定的MinPts数目。</p>
                  <p>eps表示两个向量可以被视作为同一个类的最大的距离;</p>
                  <p>min_samples表示一个类中至少要包含的元素数量,如果小于这个数量,那么不构成一个类。</p>
                </TabPane>
              </Tabs>
            </Row>
          </transition>
        </Col>

        <!--<Col span="24" class="demo-tabs-style2">-->
        <!--<Card dis-hover>-->
        <!--<template>-->
        <!--<p slot="title">用户分布情况</p>-->
        <!--<a class="text-danger" href="#" slot="extra" @click.prevent="reset">-->
        <!--<Icon type="ios-loop-strong"></Icon>-->
        <!--数据重置-->
        <!--</a>-->
        <!--</template>-->
        <!--<template>-->
        <!--<div id="allmap" ref="allmap" class="bm-view"></div>-->
        <!--<table class="table table-bordered"  v-show="showTable">-->
        <!--<thead>-->
        <!--<tr>-->
        <!--<th>用户聚集中心经度</th>-->
        <!--<th>用户聚集中心纬度</th>-->
        <!--<th>用户数量</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
        <!--<tr v-for="(item,index) in cluster" :key="index">-->
        <!--<td><Input v-model="item[0]"></Input></td>-->
        <!--<td><Input v-model="item[1]"></Input></td>-->
        <!--<td>{{item[2]}}</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--</table>-->
        <!--</template>-->
        <!--</Card>-->
        <!--</Col>-->
      </Row>

    </div>

  </div>
</template>
<style lang="scss">
  .ivu-form-item {
    /*margin-bottom: 0 !important;*/
    /*background-color: #f0f0ee;*/
    /*margin: 0;*/
  }
  .bm-view {
    width: 100%;
    height: 800px;
    overflow: hidden;
    margin: 0;
  }
  /*.blur {*/
  /*opacity: 0.5;*/
  /*filter:alpha(opacity=50);*/
  /*}*/
  .blur {
    background-color: #000000;
    background: rgba(0,0,0,.5);
    border-radius: 0.3em;
    box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset,
    0 .5em 1em rgba(0, 0, 0, 0.6);
    text-shadow: 0 1px 1px hsla(0,0%,100%,.3);
    .ivu-form .ivu-form-item-label {
      color: #fff;
    }
    .ivu-tabs .ivu-tabs-tabpane {
      color: #fff;
    }
    /*opacity: 0.5;*/
  }
  .little-label {
    i {
      vertical-align: middle;
      padding-left: 10px;
    }
    span {
      float: right;
      padding-right: 10px;
    }
  }
  .toolbar-map {
    li {
      margin-right: 5px;
      &:last-child {
        margin-right: 10px;
      }
    }
    .item-circle {
      padding-bottom: 10px;
      border: none;
      list-style: none;
      /*border-radius:20px;*/
      /*display: flex;*/
      /*align-items: center;*/

    }
    .item {
      float: left;
      background-color: #fff;
      padding: 5px 10px;
      border: 1px solid #f0f0ee;
      border-radius:2px;
      box-shadow: 0 0 10px #888888;
      display: flex;
      align-items: center;
      .item-left {
        /*margin-left: 10px;*/
        span {
          margin-left: 5px;
          font-size: 12px;
          vertical-align: middle;
        }
      }
      .link {
        cursor: pointer;
        &:hover {
          color: #2d8cf0;
        }
      }
      i {
        vertical-align: middle;
      }
    }
  }
  .fenge {
    padding:12px 2px 4px 6px;
    margin-left: 6px;
    border-left: 1px solid #D0D0D0;
    font-size: 0;
  }
</style>
<script>
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
// import BmPointCollection from 'vue-baidu-map/components/Overlays/PointCollection.vue'
import { analyze_one, compute_cluster } from '../api/api';
export default {
  // components: {
  //   BaiduMap,
  //   BmPointCollection
  // },
  data() {
    return {
      filters: {
        enbid: '586837',
        cellid: '52'
      },
      ruleInline: {
        enbid: [
          { required: true, message: 'The enbid cannot be empty', trigger: 'change' }
        ],
        cellid: [
          { required: true, message: 'The cellid cannot be empty', trigger: 'change' },
          { type: 'string', min: 2, message: 'The cellid no less than 2 words', trigger: 'change' }
        ]
      },
      formTop: {
        input1: 100,
        input2: 200,
        input3: 1
      },
      modal: false,
      visible: false,
      // formItem: {
      //   input: '',
      //   checkbox: [],
      //   switch: true,
      //   slider: 2
      // },
      disabled: true,
      showTable: false,
      showPanel: false,
      websock: null,
      socketData: '',
      step1Msg: '',
      step2Msg: '',
      step3Msg: '',
      step4Msg: '',
      taskid: null,
      current: -1,
      data2: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
      map: null,
      inmap: null,
      center: {
        lng: 105.404,
        lat: 38.915
      },
      enbinfo: null,
      zoom: 12,
      points: [],
      markers: '',
      AnimationMarkers: '',
      cluster: [],
      clusterLabel: null,
      convexHull: [],
      ncell: null,
      ncellOverlays: [],
      userOverlay: null,
      clusterAnimation: true,
      colors: ['green', 'blue', '#d340c3', '#8A2BE2', '#DC143C', '#000000'],
      switch1: true,
      switchNcell: true,
      switchUser: true
    }
  },
  computed: {
    // markers: function() {
    //   return this.cluster.map(item => { return new BMap.Marker(new BMap.Point(item[0], item[1]),{enableDragging: true})})
    // }
    formItem: function() {
      let group_points_temp = _.groupBy(this.points, item => { return item['label'] });
      delete group_points_temp['-1'];
      let group_points = _.mapObject(group_points_temp, (val, key) => {
        return { data: val, K: this.formTop.input3 }
      });
      // let group_points = _.mapObject(group_points_temp, function(val, key) {
      //   return _.map(val, item => { return { 'count': item['label'], 'point': [item['BDlng'], item['BDlat']] } });
      // });
      return {
        input1: '',
        input2: '',
        checkbox: [],
        switch: true,
        slider: group_points
      }
    }
  },
  watch: {
    cluster(val, oldVal) {
      // this.clusterAnimation = false;
      if (oldVal.length === 0) {
        return
      }
      this.clearClusterMarker();
      this.drawClusterMarker();

      // for (let marker of oldVal) {
      //   marker.setPosition(val.getPosition())
      // }
    }
  },
  methods: {
    hidePanel() {
      let sp = document.getElementById('settingsPanel');
      let spbtn = document.getElementById('settingsPanelButton');
      document.addEventListener('click', ev => {
        if (!sp.contains(ev.target) && !spbtn.contains(ev.target)) {
          this.showPanel = false
        }
      })
    },
    genID(length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    },
    analyze(enbid, cellid) {
      // alert(enbid + ',' + cellid);
      this.current = -1;
      this.step1Msg = '';
      this.step2Msg = '';
      this.step3Msg = '';
      this.step4Msg = '';
      this.clearInmapLegend();
      this.taskid = this.genID();
      this.websocketsend(this.taskid);
      let para = {
        enbid: enbid,
        cellid: cellid,
        taskid: this.taskid,
        eps: this.formTop.input1,
        min_samples: this.formTop.input2,
        K: this.formTop.input3
      };
      this.cluster = [];
      this.showTable = false;
      this.clusterAnimation = true;
      this.clearOverlays();
      // $('#allmap').html('').attr('style', '');
      analyze_one(para).then(res => {
        this.showTable = true;
        console.log(res)
        let userinfo = res.data.userinfo;
        this.points = userinfo;
        // res.data.cluster?
        this.cluster = res.data.cluster || this.cluster;
        // this.enbinfo = res.data.enbinfo;
        this.convexHull = res.data.convexHull;
        this.ncell = res.data.ncell;
        sessionStorage.setItem(this.taskid, JSON.stringify(this.cluster));
        this.drawMap()
      }).catch(res => {
        this.$Message.error({
          content: res.message,
          duration: 0,
          closable: true
        })
      });
      // return false;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
          // this.taskid = this.genID();
          // alert(this.$route.query);
          let enbid = this.filters.enbid;
          let cellid = this.filters.cellid;
          this.analyze(enbid, cellid)
          // this.currentPage = 1;
          // this.handleListApproveHistory();
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    handleSubmit2() {
      this.visible = false;
      let para = this.formItem;
      compute_cluster(para).then(res => {
        console.log(res)
        this.cluster = res.data.cluster;
      })
    },
    handleClick(name) {
      // if (name === '测距') {
      //   let myDis = new BMapLib.DistanceTool(this.map);
      //   myDis.open(); // 开启鼠标测距
      // }
      switch (name) {
        case '测距':
          let myDis = new BMapLib.DistanceTool(this.map);
          myDis.open(); // 开启鼠标测距
          break;
        case '重置':
          this.reset();
          break;
      }
    },
    change(status) {
      this.$Message.info('开关状态：' + status);
    },
    changeNcell(status) {
      status ? this.showNcell() : this.hideNcell();
    },
    changeUser(status) {
      status ? this.showUser() : this.hideUser();
    },
    initWebSocket() {
      // ws地址
      // console.log(process.env.PORT)
      const wsuri = 'ws://10.39.211.151:8000/app/analyze_one/';
      // const wsuri = process.env.WS_API + '/websocket/threadsocket';
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) { // 数据接收
      this.socketData = e.data;
      if (this.socketData.slice(0, 6) === 'stage2') {
        this.current = 0;
        if (this.socketData.indexOf('|') > -1) {
          this.step1Msg = this.step1Msg + this.socketData.split('|')[1]
        }
      } else if (this.socketData.slice(0, 6) === 'stage3') {
        this.current = 1
        if (this.socketData.indexOf('|') > -1) {
          this.step2Msg = this.step2Msg + this.socketData.split('|')[1];
          this.map.setZoom(17);
        }
      } else if (this.socketData.slice(0, 6) === 'stage4') {
        this.current = 2
        if (this.socketData.indexOf('|') > -1) {
          this.step3Msg = this.step3Msg + this.socketData.split('|')[1]
        }
      } else if (this.socketData === 'end') {
        this.current = 3
        this.step4Msg = '正在进行地图渲染。。。'
      } else if (this.socketData.slice(0, 7) === 'enbinfo') {
        this.enbinfo = JSON.parse(this.socketData.split('|')[1])[0];
        this.drawBTSMarker()
      }
    },
    websocketsend(agentData) {
      // console.log('发送数据')
      // 若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
        console.log('发送数据' + agentData)
        this.websock.send(agentData)
      }
      // 若是 正在开启状态，则等待300毫秒
      else if (this.websock.readyState === this.websock.CONNECTING) {
        let that = this;// 保存当前对象this
        setTimeout(function() {
          that.websock.send(agentData)
        }, 300);
      }
      // 若未开启 ，则等待500毫秒
      else {
        this.initWebSocket();
        let that = this;// 保存当前对象this
        setTimeout(function() {
          that.websock.send(agentData)
        }, 500);
      }
    },
    websocketonopen() {
      // alert('数据发送中...');
      console.log('WebSocket连接成功');
    },
    websocketclose(e) {
      console.log('connection closed (' + e.code + ')');
    },
    dragHandler(e) {
      console.log(e.target);
      console.log(e.target);
    },
    reset() {
      this.clusterAnimation = false;
      this.cluster = JSON.parse(sessionStorage.getItem(this.taskid));
    },
    format(val) {
      return val + '个';
    },
    clearInmapLegend() {
      $('.inmap-legend-container').empty();
    },
    initMap() {
      /* eslint-disable */
      this.inmap = new inMap.Map({
        id: 'allmap',
        // skin: "Blueness",
        center: [114.34579477, 30.3831411],
        zoom: {
          value: 11,
          show: true,
          max: 20,
          min: 5
        },
      });

      this.map = this.inmap.getMap();
      // this.map = new BMap.Map(this.$refs.allmap);                        // 创建Map实例
      // console.log(this.enbinfo['BDlng']);
      const initpoint = this.enbinfo ? new BMap.Point(this.enbinfo['BDlng'], this.enbinfo['BDlat']) : '武汉';
      this.map.centerAndZoom(initpoint, 11);     // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom();
      let stCtrl = new BMap.PanoramaControl(); //构造全景控件
      stCtrl.setOffset(new BMap.Size(20, 40));
      this.map.addControl(stCtrl);//添加全景控件

    },
    openPanorama(lng, lat) {
      //全景
      let panorama = new BMap.Panorama('allmap');
      panorama.setPov({heading: -40, pitch: 6});
      let point=new BMap.Point(lng, lat);
      panorama.setPosition(point);
    },
    drawBTSMarker() {
      // let point = new BMap.Point(114.34514, 30.58728);
      let point = new BMap.Point(this.enbinfo['BDlng'], this.enbinfo['BDlat']);
      this.map.panTo(point);
      // let icon = new BMap.Symbol('m-0.58615,0.85035l-128.65874,-133.43574c67.05073,-60.26661 177.0989,-61.43277 245.8,-2.63134l-117.14126,136.06707z', {
      //   rotation: 0,//顺时针旋转40度
      //   fillColor: '#00ff01',
      //   fillOpacity: 0.7,
      //   scale: 0.1,
      //   strokeColor: '#555',
      //   strokeWeight: 1//线宽
      // });
      // let marker = new BMap.Marker(point,{icon:icon});
      // this.map.addOverlay(marker);

      let icon = `<i class='iconfont ivu-icon-jizhanxinhao'></i>`;
      let label = new BMap.Label(icon,{offset:new BMap.Size(-16,-18),  //label的偏移量，为了让label的中心显示在点上
        position:point});
      label.setStyle({
        fontSize : "32px",
        // height : "20px",
        // lineHeight : "20px",
        // fontFamily:"微软雅黑",
        color: 'blue',
        border:"0",
        cursor:"pointer",
        background: 'transparent'
      });
      this.map.addOverlay(label);

      // //全景
      // let panorama = new BMap.Panorama('allmap');
      // panorama.setPov({heading: -40, pitch: 6});
      // function openPanorama(lng,lat){
      //   console.log(lng,lat)
      //   let point=new BMap.Point(lng, lat);
      //   panorama.setPosition(point);
      // }

      let enbid = this.enbinfo.enbid;
      let cellid = this.enbinfo.cellid;
      let cellname = this.enbinfo.cellname;
      let lng = this.enbinfo.lng;
      let lat = this.enbinfo.lat;
      let indoor = this.enbinfo.indoor;
      let scene = this.enbinfo.scene;
      let content = `<table class="table table-bordered table-hover">
                        <tbody>
                          <tr><td>基站号</td><td>${enbid}</td></tr>
                          <tr><td>小区号</td><td>${cellid}</td></tr>
                          <tr><td>小区名称</td><td>${cellname}</td></tr>
                          <tr><td>室内站</td><td>${indoor}</td></tr>
                          <tr><td>经度</td><td>${lng}</td></tr>
                          <tr><td>纬度</td><td>${lat}</td></tr>
                          <tr><td>场景</td><td>${scene}</td></tr>
                        </tbody>
                      </table>
                      <button class="btn btn-info btn-block" @click="openPanorama('${lng}','${lat}')"><span class="glyphicon glyphicon-search"></span>进入实景模式</button>`
      addClickHandler(content,label);

      let opts = {
        width : 260,     // 信息窗口宽度
        // height: 80,     // 信息窗口高度
        title : '基站小区信息' , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
      };

      function addClickHandler(content,marker){
        marker.addEventListener("click",function(e){
          let p = e.target;
          let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
          let infoWindow = new BMap.InfoWindow(content,opts);
          this.map.openInfoWindow(infoWindow,point);
        });
      }
    },
    ToBTSMarker(){
      if (this.enbinfo) {
        let point = new BMap.Point(this.enbinfo['BDlng'], this.enbinfo['BDlat']);
        this.map.panTo(point);
      }
    },
    drawNcell() {
      this.ncellOverlays = this.ncell.map(item => {
        let point = new BMap.Point(item['BDlng'], item['BDlat']);
        // let content = `<i class='iconfont ivu-icon-jizhanxinhao'></i>`;
        // let label = new BMap.Label(content,{offset:new BMap.Size(-8,-8),  //label的偏移量，为了让label的中心显示在点上
        //   position:point});
        // label.setStyle({
        //   // fontSize : "12px",
        //   // height : "20px",
        //   // lineHeight : "20px",
        //   // fontFamily:"微软雅黑",
        //   color: '#f8983a',
        //   border:"0",
        //   // cursor:"pointer",
        //   background: 'transparent'
        // });
        // this.map.addOverlay(label);

        // Math.floor(Math.random()*(100-30+1)+30)/100
        let icon = new BMap.Symbol('m0,0l-128.07259,-134.28609c67.63688,-61.11696 177.68505,-62.28312 246.38615,-3.48169l-116.55511,135.21672z', {
          rotation: Math.floor(Math.random()*360),//顺时针旋转40度
          fillColor: '#00ff01',
          fillOpacity: 0.5,
          scale: 0.2,
          strokeColor: '#555',
          strokeWeight: 1//线宽
        });
        let marker = new BMap.Marker(point,{icon:icon});
        this.map.addOverlay(marker);

        // label.hide()
        return marker
      })
    },
    showNcell() {
      this.showOverlays(this.ncellOverlays)
    },
    hideNcell() {
      this.hideOverlays(this.ncellOverlays)
    },
    drawClusterMarker() {
      if (this.cluster.length ===0){
        return
      }
      this.clusterLabel =[];
      this.markers = this.cluster.map((item, index) => {
        let marker = new BMap.Marker(new BMap.Point(item[0], item[1]),{
          enableDragging: true,
          // offset: new BMap.Size(5, 18),
          offset: new BMap.Size(0, 10),
          title: '簇'+ item[3] + '中心点'
        });
        let clusterLabel = new BMap.Label('用户数: '+ item[2],{
          offset:new BMap.Size(20,-10),
          position : new BMap.Point(item[0], item[1])
        });
        clusterLabel.setStyle({
          // fontSize : "12px",
          // height : "20px",
          // lineHeight : "20px",
          // fontFamily:"微软雅黑",
          color: '#fff',
          border:"0",
          padding:'3px',
          // cursor:"pointer",
          // background: 'transparent',
          background: 'rgba(0,0,0,.5)',
          boxShadow: '0 0 0 1px hsla(0,0%,100%,.3) inset,0 .5em 1em rgba(0, 0, 0, 0.6)',
          borderRadius: '0.3em'
        });
        this.clusterLabel.push(clusterLabel);
        this.map.addOverlay(clusterLabel);

        let label = new BMap.Label(item[3], {
          offset : new BMap.Size(5, 4),
          // position : new BMap.Point(item[0], item[1]),
        });
        label.setStyle({
          background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
        });
        marker.setLabel(label);//显示地理名称


        this.map.addOverlay(marker);
        if (this.clusterAnimation) {
          marker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
        }
        marker.addEventListener('dragend',e => {
          this.cluster.splice(index,1,[e.point.lng,e.point.lat,this.cluster[index][2],this.cluster[index][3]])
        })
        return marker
      });
      // console.log(this.markers);
      // for (let i = 0; i < this.markers.length; i++){
      //   console.log(this.markers[i])
      //   this.markers[i].hide()
      //   // this.map.removeOverlay(this.markers[i]);
      // }

      // 复杂的自定义覆盖物
      function ComplexCustomOverlay(point, label, title, content){
        this._point = point;
        this._label = label;
        this._title = title;
        this._content = content;
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay();
      ComplexCustomOverlay.prototype.initialize = function(map){
        this._map = map;

        let zIndex = BMap.Overlay.getZIndex(this._point.lat) || -7782820;
        // let zIndex = -7782820;
        let title ='';
        if (this._title){
          let title = '<h3 class="popover-title">从右侧弹出</h3>'
        }
        let divContent = `<div style="position: absolute;z-index: ${zIndex};padding: 2px;height: 18px;line-height: 18px;white-space: nowrap;border: 0;cursor: pointer;">
                            ${this._label}
                            <div class="popover right" style="min-width:258px;">
                              <div class="arrow"></div>
                              ${title}
                              <div class="popover-content">
                                ${this._content}
                              </div>
                            </div>
                          </div>`;
        let div = this._div = $(divContent)[0];
        let that = this;
        div.onclick = function(){

          let height = $(that._div).children(".popover").height();
          $(that._div).children(".popover").css({"top": -(height-18)/2+"px","left": "18px"})
          $(this).children(".popover").toggle();
        };
        map.getPanes().labelPane.appendChild(div);
        return div;
      };
      ComplexCustomOverlay.prototype.draw = function(){
        let map = this._map;
        let pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - 9.5+ "px";
        this._div.style.top  = pixel.y - 12 + "px";
      };


      this.cluster.map(item => {
        let point = new BMap.Point(item[0], item[1]);
        let content = `<i class='iconfont icon-jizhanxinhao'></i>`;
        let label = new BMap.Label(content,{offset:new BMap.Size(-8,-8),  //label的偏移量，为了让label的中心显示在点上
          position:point});
        label.setStyle({
          // fontSize : "12px",
          // height : "20px",
          // lineHeight : "20px",
          // fontFamily:"微软雅黑",
          color: '#f8983a',
          border:"0",
          // cursor:"pointer",
          background: 'transparent'
        });
        // this.map.addOverlay(label);

        // let CustomOverlay = new ComplexCustomOverlay(point,"<i class='iconfont icon-jizhanxinhao'></i>",'',`<div class="panel">
        //     <div class="panel-heading">
        //       标题
        //     </div>
        //     <div class="panel-body">
        //       内容
        //     </div>
        //   </div>`)
        // this.map.addOverlay(CustomOverlay);
      });

      // var label = new BMap.Label("<i class='iconfont icon-jizhanxinhao'></i>",{offset:new BMap.Size(-60,-60),  //label的偏移量，为了让label的中心显示在点上
      //   position:point});
      // this.map.addOverlay(label);
      // for (let i = 0; i < this.markers.length; i ++) {
      //   let marker = this.markers[i];
      //   this.map.addOverlay(marker);
      //   if (this.clusterAnimation) {
      //     marker.setAnimation(BMAP_ANIMATION_DROP); //跳动的动画
      //   }
      //   marker.addEventListener('dragend',e => {
      //     this.cluster.splice(i,1,[e.point.lng,e.point.lat,this.cluster[i][2],this.cluster[i][3]])
      //   })
      // }

      let data = this.cluster.map(item => {
        return {
          name: '北京',
          geometry: {
            type: 'Point',
            coordinates: [item[0], item[1]]
          },
          style: {
            color: this.colors[item[3]],
            speed: Math.floor(Math.random()*(100-30+1)+30)/100,
          }
        }
      })
      this.AnimationMarkers = new inMap.PointAnimationOverlay({
        style: {
          fps: 90, //动画帧数
          color: "#FAFA32",
          size: 25,
          speed: 0.15
        },
        data: data
      });
      this.inmap.add(this.AnimationMarkers );
    },
    clearClusterMarker(){
      for (let i = 0; i < this.markers.length; i ++) {
        this.map.removeOverlay(this.markers[i]);
        this.map.removeOverlay(this.clusterLabel[i]);
        this.inmap.remove(this.AnimationMarkers)
      }
    },
    clearOverlays() {
      this.map.clearOverlays();
    },
    drawUser() {
      let group_points_temp=_.groupBy(this.points, item => {return item['label']});
      let group_points=_.mapObject(group_points_temp, function(val, key) {
        // console.log(val);
        return _.map(val,item => {return {"count":item['label'],"geometry":{"type":"Point","coordinates":[item['BDlng'], item['BDlat']]}}})
      });
      console.log(group_points);

      let data = this.points.map(item => {
        return {"count":parseInt(item['label']),"geometry":{"type":"Point","coordinates":[item['BDlng'], item['BDlat']]}}
      });
      // let colors=['#d340c3','#8A2BE2','#DC143C','#000000']
      // let colors1 = ['green','blue','#d340c3','#8A2BE2','#DC143C','#000000']
      let legend = {
        show: true,
        title: "标题",
        formatter: function (start, end, index, item) {
          return parseInt(start) == -1 ? '野点' : '簇'+ parseInt(start);
        },
        // list: Object.keys(group_points).map(item => {
        //   return {
        //     text: item == -1 ? '野点' : ("簇" + item),
        //     backgroundColor: item == -1 ? colors1[colors1.length-1] : colors1[item]
        //   }
        // })
      };

      let splitList = Object.keys(group_points).map(item => {
        return {
          start: parseInt(item),
          end: parseInt(item) + 1,
          backgroundColor: parseInt(item) == -1 ? this.colors[this.colors.length-1] : this.colors[parseInt(item)],
        }
      })
      console.log(JSON.stringify(splitList));

      this.userOverlay = new inMap.PointOverlay({
        tooltip: {
          show: true,
          formatter: function(params) {
            return (
              '<div>' +
              ' <div>' +
              ' <span>经度 : </span><span>' +
              params.geometry.coordinates[0] +
              "</span>" +
              " </div>" +
              ' <div>' +
              ' <span></span><span class="series-label">纬度 : </span><span>' +
              params.geometry.coordinates[1] +
              "</span></div></div>"
            );
          },
        },
        legend: legend,
        draw: {  //分批绘画
          interval: 400,  //间隔时间
          splitCount: 1900 //每次绘画的点数
        },
        style: {
          normal: {
            // backgroundColor: index == -1 ? colors1[colors1.length-1] : colors1[index], // 填充颜色
            shadowColor: "rgba(255, 255, 255, 1)", // 投影颜色
            shadowBlur: 35, // 投影模糊级数
            globalCompositeOperation: "lighter", // 颜色叠加方式
            size: 1.2 // 半径
          },
          splitList: splitList
        },
        data: data,
        event: {
          onState(val) {
            // console.log(val);
          }
        }
      });
      this.inmap.add(this.userOverlay);

      // _.mapObject(group_points,(value,index)=>{
      //   // let options = {
      //   //   size: BMAP_POINT_SIZE_SMALL,
      //   //   shape: BMAP_POINT_SHAPE_STAR,
      //   //   color: index == -1 ? colors[colors.length-1] : colors[index]
      //   // };
      //
      //   var overlay = new inMap.PointOverlay({
      //     tooltip: {
      //       show: true,
      //       formatter: function(params) {
      //         return (
      //           '<div>' +
      //           ' <div>' +
      //           ' <span>经度 : </span><span>' +
      //           params.geometry.coordinates[0] +
      //           "</span>" +
      //           " </div>" +
      //           ' <div>' +
      //           ' <span></span><span class="series-label">纬度 : </span><span>' +
      //           params.geometry.coordinates[1] +
      //           "</span></div></div>"
      //         );
      //       },
      //     },
      //     legend: legend,
      //     draw: {  //分批绘画
      //       interval: 400,  //间隔时间
      //       splitCount: 1900 //每次绘画的点数
      //     },
      //     style: {
      //       normal: {
      //         backgroundColor: index == -1 ? colors1[colors1.length-1] : colors1[index], // 填充颜色
      //         shadowColor: "rgba(255, 255, 255, 1)", // 投影颜色
      //         shadowBlur: 35, // 投影模糊级数
      //         globalCompositeOperation: "lighter", // 颜色叠加方式
      //         size: 1 // 半径
      //       }
      //     },
      //     data: value,
      //     event: {
      //       onState(val) {
      //         // console.log(val);
      //
      //       }
      //     }
      //   });
      //   this.inmap.add(overlay);
      // })
    },
    drawUser1() {
      if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        let group_points_temp=_.groupBy(this.points, item => {return item['label']});
        let group_points=_.mapObject(group_points_temp, function(val, key) {
          // console.log(val);
          return _.map(val,item => {return new BMap.Point(item['BDlng'], item['BDlat'])})
        });
        console.log(group_points);
        let colors=['green','blue','#d340c3','#8A2BE2','#DC143C','#000000']
        _.mapObject(group_points,(value,index)=>{
          let options = {
            size: BMAP_POINT_SIZE_TINY,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: index == -1 ? this.colors[this.colors.length-1] : this.colors[index]
          };
          let pointCollection = new BMap.PointCollection(value, options);
          pointCollection.addEventListener('click', function (e) {
            alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
          });
          this.map.addOverlay(pointCollection);  // 添加Overlay
          this.sleep(4000)
        })

        // let points = [];  // 添加海量点数据
        // for (let i = 0; i < this.points.length; i++) {
        //   let pt = new BMap.Point(this.points[i]['BDlng'], this.points[i]['BDlat']);
        //   points.push(pt);
        //   // markers.push(new BMap.Marker(pt));
        // }
        // let options = {
        //   size: BMAP_POINT_SIZE_SMALL,
        //   shape: BMAP_POINT_SHAPE_STAR,
        //   color: '#d340c3'
        // };
        // let pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        // pointCollection.addEventListener('click', function (e) {
        //   alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
        // });
        // this.map.addOverlay(pointCollection);  // 添加Overlay

      } else {
        alert('请在chrome、safari、IE8+以上浏览器查看本示例');
      }
    },
    showUser() {
      this.drawUser()
    },
    hideUser() {
      this.inmap.remove(this.userOverlay)
    },
    drawConvexHull() {
      this.convexHull.forEach(item => {
        let points = item['points'].map(value => {
          return new BMap.Point(value[0],value[1])
        });
        let label = item['label'];
        let color = this.colors[label];
        let polygon = new BMap.Polygon(points, {strokeColor:color, strokeWeight:2, strokeOpacity:0.5, fillColor:color, fillOpacity:0.1});  //创建多边形
        this.map.addOverlay(polygon);   //增加多边形
      })
    },
    showOverlays(overlays) {
      for (let i = 0; i < overlays.length; i++){
        overlays[i].show()
      }
    },
    hideOverlays(overlays) {
      for (let i = 0; i < overlays.length; i++){
        overlays[i].hide()
      }
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    drawMap() {
      /* eslint-disable */
      // let map = new BMap.Map(this.$refs.allmap);                        // 创建Map实例
      // const initpoint = new BMap.Point(this.cluster[0][0], this.cluster[0][1]);
      // map.centerAndZoom(initpoint, 12);     // 初始化地图,设置中心点坐标和地图级别
      // map.enableScrollWheelZoom();                        //启用滚轮放大缩小

      // let markers = this.cluster.map(item => { return new BMap.Marker(new BMap.Point(item[0], item[1]),{enableDragging: true})});
      // function sleep (time) {
      //   return new Promise((resolve) => setTimeout(resolve, time));
      // }
      (async () => {
        // this.initMap();
        this.step4Msg = '添加基站。。。'
        await this.sleep(2000);//阻塞该async方法的执行线程，直到sleep()返回的Promise resolve
        // this.drawBTSMarker();
        this.drawNcell();
        this.step4Msg = '添加聚类点。。。'
        await this.sleep(2000);
        this.drawClusterMarker();
        this.clusterAnimation = false;
        this.step4Msg = '添加用户信息。。。'
        await this.sleep(4000);
        // this.map.setZoom(17);
        this.drawUser();
        this.drawConvexHull();
        this.current = 4;
        this.step4Msg = '地图渲染完成'

      })();
      // this.initMap();
      // this.drawBTSMarker();
      // this.drawClusterMarker();
      // this.drawPointCollection();
      // this.current = 4;

    }
  },
  created() {
    this.initWebSocket();
    let param = this.$route.query;
    let enbid = param.enbid;
    let cellid = param.cellid;
    // this.analyze(enbid, cellid)
    // alert(oid)
    // this.addPoints()
  },
  mounted: function() {
    this.initMap();
    // this.drawBTSMarker()
    // this.drawMap()
    $('[data-toggle="popover"]').popover();
    this.hidePanel()
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    $('#allmap').css('height',h-50)
    // this.$nextTick(() => {
    //   document.querySelector('body').addEventListener('click', this.handleBodyClick);
    // })
  },
  updated: function() {
    // this.drawClusterMarker()
  }
}
</script>

