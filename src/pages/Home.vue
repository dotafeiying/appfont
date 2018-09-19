<template>
  <div style="padding: 20px 20px 20px 20px">
    <!--<div class="row">-->
      <!--<Uploader :showBtn="showBtn" @success="show"></Uploader>-->
    <!--</div>-->
    <!--<div class="row clearfix box">-->
      <!--<div class="col-xs-12 column">-->
        <!--<keep-alive>-->
          <!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
        <!--</keep-alive>-->
        <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
      <!--</div>-->
    <!--</div>-->
    <Row class="row">
      <Card dis-hover>
        <p slot="title">文件上传</p>
        <a class="text-danger" href="#" slot="extra" @click.prevent="downloadTemplate">
          <!--<Icon type="ios-loop-strong"></Icon>-->
          模板下载
        </a>
        <Uploader :showBtn="showBtn" @success="show" @get_file_path="get_file_path"></Uploader>
        <template v-if="disabled">
          <Button v-show="showBtn" @click="run" type="primary">运行</Button>
        </template>
        <template v-else>
          <Button v-show="showBtn" @click="kill" type="error">取消</Button>
        </template>
      </Card>
    </Row>
    <Row class="row">
      <div v-if="revMsg!='end'" style="max-height: 200px;overflow: auto;opacity: 0.7;">
        <div v-html="processData"></div>
      </div>
      <Poptip v-else trigger="hover" title="详情">
        <a>运行成功！</a>
        <div slot="content">
          <div v-html="processData"></div>
        </div>
      </Poptip>
      <!--<div v-else style="color: #2d8cf0;">运行成功！</div>-->
    </Row>
    <!--<Row v-if="socketData!='end'"><div v-html="socketData"></div></Row>-->
    <!--<Row v-else>运行成功！</Row>-->
    <Row class="row" v-show="showPanel">
      <Card :bordered="false">
        <p slot="title">分析结果</p>
        <p slot="extra">
          <a @click="exportData('csv')" class="pull-right" data-toggle="tooltip" data-placement="bottom" title="将结果下载为csv格式"><h4 style="margin-right: 8px"><i class="icon icon-file-archive" style="font-size: 16px"></i></h4></a>
          <a @click="exportData('xlsx')" class="pull-right" data-toggle="tooltip" data-placement="bottom" title="将结果下载为xlsx格式"><h4 style="margin-right: 20px"><i class="icon icon-file-excel" style="font-size: 16px"></i></h4></a>
        </p>

        <Table border size="small" :columns="historyColumns" :data="historyData" ref="table"></Table>
        <p style="padding-bottom: 40px">
          <Page :current.sync="currentPage" :total="dataCount" :page-size="pageSize" :page-size-opts="
        pageSizeOpts" show-sizer show-total class="paging" @on-change="changePage" @on-page-size-change="changeSize"></Page>
        </p>
      </Card>
      <!--<Button v-show="showBtn" @click="run" type="primary">运行分析</Button>-->
    </Row>
    <Spin fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>

    <!--<div class="row">-->
      <!--<Spin fix v-if="spinShow">-->
        <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
        <!--<div>Loading</div>-->
      <!--</Spin>-->
      <!--<Button v-show="showBtn" @click="run" type="primary">运行分析</Button>-->
      <!--<div v-show="showPanel" class="panel">-->
        <!--<div class="panel-heading">-->
          <!--分析结果-->
        <!--</div>-->
        <!--<div class="panel-body">-->
          <!--<Table border size="small" :columns="historyColumns" :data="historyData"></Table>-->
          <!--<Page :current.sync="currentPage" :total="dataCount" :page-size="pageSize" :page-size-opts="pageSizeOpts" show-sizer show-total class="paging" @on-change="changePage" @on-page-size-change="changeSize"></Page>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<style scoped lang="scss">
  .box {
    /*padding-top: 20px;*/
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

<script>
import Uploader from '@/components/Uploader';
import expandRow from '@/components/table-expand.vue';
import { analyze, get_result, job_kill } from '../api/api';
export default {
  name: 'home',
  components: {
    Uploader,
    expandRow
  },
  computed: {
    processData: function() {
      return this.socketData.join('<br>')
    }
  },
  data() {
    return {
      disabled: true,
      spinShow: false,
      showBtn: false,
      showPanel: false,
      websock: null,
      revMsg: '',
      socketData: [],
      file_path: '',
      file_path_id: null,
      taskid: '',
      channel: '',
      download_url: null,
      // result: [],
      ajaxHistoryData: [],
      ajaxHistoryData_copy: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      currentPage: 1,
      pageSize: 10,
      pageSizeOpts: [10, 20, 50, 100],
      historyColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '展开',
          type: 'expand',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'enbid',
          key: 'enbid',
          maxWidth: 90,
          sortable: true
        },
        {
          title: 'cellid',
          key: 'cellid',
          maxWidth: 70
        },
        // {
        //   title: 'cellname',
        //   key: 'cellname'
        // },
        {
          title: 'freqID',
          key: 'freqID',
          maxWidth: 80
        },
        {
          title: 'lng',
          key: 'lng',
          maxWidth: 110
        },
        {
          title: 'lat',
          key: 'lat',
          maxWidth: 110
        },
        {
          title: 'scene',
          key: 'scene',
          maxWidth: 120
        },
        {
          title: 'indoor',
          key: 'indoor',
          maxWidth: 80
        },
        {
          title: 'result',
          key: 'result',
          // maxWidth: 400
        }

      ],
      historyData: []
    }
  },
  methods: {
    show(res) {
      this.showBtn = res;
      // this.showPanel = res;
    },
    get_file_path(file_path_id, file_path) {
      this.file_path = file_path;
      this.file_path_id = file_path_id;
    },
    run() {
      this.websock.close();
      this.revMsg = '';
      this.socketData = [];
      this.showPanel = false;
      this.ajaxHistoryData = [];
      this.ajaxHistoryData_copy = [];
      // this.websocketsend(this.file_path);
      // this.spinShow = true;
      let para = {file_path: this.file_path, file_path_id: this.file_path_id};
      analyze(para).then(res => {
        this.disabled = false;
        setTimeout(() => {
          this.disabled = true
        }, 3000);
        // this.spinShow = false;
        // this.showPanel = true;
        // this.result = res.data.data;
        console.log(res.data);
        // this.download_url = res.data.download_url;
        this.taskid = res.data.taskid;
        this.channel = res.data.channel;
        this.websocketsend(this.channel);

      }).catch(res => {
        alert(res)
      })
    },
    kill() {
      this.disabled = true;
      let para = {task_id: this.taskid};
      job_kill(para).then(res => {
        console.log(res.data);
        if (res.data.result === 'success') {
          this.$Message.info('已取消运行!');
        }
      })
    },
    handleListApproveHistory() {
      let para = {taskid: this.taskid};
      get_result(para).then(res => {
        this.download_url = res.data.download_url;
        this.spinShow = false;
        this.showPanel = true;
        this.ajaxHistoryData = res.data.data;
        this.dataCount = res.data.data.length;
        if (this.dataCount < this.pageSize) {
          this.historyData = this.ajaxHistoryData;
        } else {
          this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
        }
        this.ajaxHistoryData_copy = this.ajaxHistoryData;
      })
    },
    changePage(index) {
      let _start = (index - 1) * this.pageSize;
      let _end = index * this.pageSize;
      this.historyData = this.ajaxHistoryData.slice(_start, _end);
    },
    changeSize(size) {
      this.pageSize = size;
      if (this.dataCount < this.pageSize) {
        this.historyData = this.ajaxHistoryData;
      } else {
        this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
      }
    },
    exportData(format) {
      let url_download = `http://127.0.0.1:8000/app/download/?filename=${this.download_url}&format=${format}`;
      window.open(url_download);
      // this.$refs.table.exportCsv({
      //   filename: 'result',
      //   columns: this.historyColumns_expand,
      //   data: this.ajaxHistoryData
      // });
    },
    downloadTemplate() {
      window.open('http://127.0.0.1:8000/static/模板.xlsx');
    },
    initWebSocket() { // 初始化weosocket
      // ws地址
      // console.log(process.env.PORT)
      const wsuri = 'ws://10.39.211.151:8000/app/analyze/';
      // const wsuri = process.env.WS_API + '/websocket/threadsocket';
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) { // 数据接收
      // console.log(e.data);
      // if (e.data.indexOf('开始') === 0) {
      //   return
      // }
      // this.revMsg = e.data;
      // this.socketData = this.socketData + this.revMsg + '<br>';
      // if (e.data === 'end') {
      //   this.socketData = 'end';
      // }
      if (e.data.slice(0, 4) === this.revMsg.slice(0, 4)) {
        this.socketData.splice(-1, 1, e.data);
        return
      }
      this.revMsg = e.data;
      if (e.data === 'killed') {
        this.revMsg = '<p class="text-danger">任务被killed！</p>'
      } else if (e.data === 'failed') {
        this.revMsg = '<p class="text-danger">任务执行失败，详情见任务监控日志！</p>'
      }
      this.socketData.push(this.revMsg);
      // this.socketData = this.socketData + this.revMsg + '<br>';
      if (e.data === 'end') {
        // this.socketData = 'end';
        this.handleListApproveHistory()
      }
    },
    websocketsend(agentData) { // 数据发送
      // 若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
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
    websocketclose(e) { // 关闭
      console.log('connection closed (' + e.code + ')');
    },
  },
  created() {
    this.initWebSocket();
  },
  mounted() {
    /* eslint-disable */
    $('[data-toggle="tooltip"]').tooltip({
      placement: 'bottom'
    });
  }
}
</script>

<style scoped>

</style>
