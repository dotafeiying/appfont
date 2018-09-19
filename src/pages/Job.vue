<template>
  <div class="row">
    <v-title title="任务监控"></v-title>
    <!--工具条-->
    <Row class="row">
      <Col span="24" style="background: #fff;padding: 8px 10px;">
      <!--<Card dis-hover>-->
        <!--<Form ref="formInline" :model="filters" :rules="ruleInline" :label-width="60" inline>-->
          <!--<FormItem prop="name" label="搜索字段">-->
            <!--<Input type="text" v-model="filters.name" placeholder="搜索名称" style="width: 200px">-->
            <!--</Input>-->
          <!--</FormItem>-->
          <!--<FormItem :label-width="10">-->
            <!--<Button type="primary" @click="handleSubmit('formInline')">查询</Button>-->
          <!--</FormItem>-->
          <!--&lt;!&ndash;<Button  class="pull-right" type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> Export source data</Button>&ndash;&gt;-->
        <!--</Form>-->
      文本
      <!--<Input type="text" v-model="filters.name" placeholder="搜索名称" style="width: 200px">-->
      <AutoComplete
        v-model="filters.name"

        @on-search="handleSearch"
        placeholder="搜索名称、任务ID"
        style="width:200px"></AutoComplete>
      </Input>
        <ButtonGroup class="pull-right">
          <Button  @click="filterStatus('')">全部</Button>
          <Button type="success" @click="filterStatus('success')">成功</Button>
          <Button type="warning" @click="filterStatus('started')">正在运行</Button>
          <Button type="error" @click="filterStatus('failure')">失败</Button>
          <Button type="info" @click="filterStatus('revoked')">已停止</Button>
        </ButtonGroup>
      <!--</Card>-->
      </Col>
    </Row>

    <!--<Table :columns="columns" :data="currentPageData"></Table>-->
    <el-table size="medium" :data="currentPageData" style="width: 100%">
      <el-table-column prop="task_id" label="任务ID" width="300"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="150"></el-table-column>
      <el-table-column prop="taskmeta.status" label="状态" width="100">
        <template slot-scope="scope">
          <span class="label" :style="{ backgroundColor: statusMap[scope.row.taskmeta.status], fontWeight: 'bold', fontSize: '11px'}">{{ scope.row.taskmeta.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="runtime" label="运行时间"></el-table-column>
      <el-table-column label="进度1">
        <template slot-scope="scope">
          <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.stage1PercentComplete || 0" :color="statusMap[scope.row.state]"></el-progress>-->
          <ProgressBar :percent="scope.row.stage1PercentComplete || 0" :color="statusMap[scope.row.taskmeta.status]"></ProgressBar>
        </template>
      </el-table-column>
      <el-table-column
        label="进度2">
        <template slot-scope="scope">
          <ProgressBar :percent="scope.row.stage2PercentComplete || 0" :color="statusMap[scope.row.taskmeta.status]"></ProgressBar>
        </template>
      </el-table-column>
      <el-table-column prop="durationFormatted" label="持续时间"></el-table-column>
      <el-table-column prop="create_date" label="提交时间" min-width="180"></el-table-column>
      <el-table-column label="结果">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskmeta.status!=='STARTED'" size="mini" type="text" @click="exportData(scope.row,'xlsx')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="canKill" label="">
        <template slot-scope="scope">
          <el-button v-if="scope.row.canKill"  size="mini" type="info" @click="jobKill(scope.row.task_id)">停</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p style="padding-top: 20px;padding-bottom: 40px;padding-left: 20px;padding-right: 20px;">
      <!--<Page :current.sync="currentPage" :total="dataCount" :page-size="pageSize" :page-size-opts="-->
        <!--pageSizeOpts" show-sizer show-total class="paging" @on-change="changePage" @on-page-size-change="changeSize"></Page>-->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="dataCount">
      </el-pagination>
    </p>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script>
import {job_manage, job_kill} from "../api/api";
import {parseTime} from '../utils/index'
import ProgressBar from '@/components/ProgressBar';
import vTitle from '@/components/Title';

export default {
  components: {
    ProgressBar,
    vTitle
  },
  data() {
    return {
      statusMap: {
        SUCCESS: '#468847',
        STARTED: '#f90',
        FAILURE: '#ed3f14',
        REVOKED: '#ed3f14',
        UNKNOWN: 'grey'
      },
      filters: {
        name: '',
        status: ''
      },
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      currentPage: 1,
      pageSize: 50,
      pageSizeOpts: [10, 20, 50, 100],
      columns: [
        {
          title: '任务ID',
          key: 'task_id',
          minWidth: 150
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 150
        },
        {
          title: '状态',
          key: 'state',
          render: (h, params) => {
            return h('span', {
              attrs: {
                class: 'label'
              },
              style: {
                backgroundColor: statusMap[params.row.state],
                fontWeight: 'bold',
                fontSize: '11px'
              }
            }, params.row.state);
          }
          // render: (h, params) => {
          //   const statusMap = {
          //     SUCCESS: '#468847',
          //     STARTED: 'yellow',
          //     FAILURE: 'red'
          //   };
          //   return h('div', [
          //     h('Tag', {
          //       props: {
          //         color: statusMap[params.row.state]
          //       }
          //     }, params.row.state)
          //     // h('strong', params.row.state)
          //   ]);
          // }
        },
        {
          title: '运行时间',
          key: 'runtime'
        },
        {
          title: '进度1',
          key: 'stage1PercentComplete',
          width: 120,
          render: (h, params) => {
            return h(ProgressBar, {
              props: {
                percent: params.row.stage1PercentComplete || 0,
                color: statusMap[params.row.state]
              }
            })
          }
        },
        {
          title: '进度2',
          key: 'stage2PercentComplete',
          width: 120,
          render: (h, params) => {
            return h(ProgressBar, {
              props: {
                percent: params.row.stage2PercentComplete || 0,
                color: statusMap[params.row.state]
              }
            })
          }
        },
        {
          title: '持续时间',
          key: 'durationFormatted'
        },
        {
          title: '提交时间',
          key: 'create_date'
        },
        {
          title: ' ',
          key: 'canKill',
          width: 100,
          align: 'center',
          render: (h, params) => {
            if (params.row.canKill) {
              return h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.jobKill(params.row.task_id)
                  }
                }
              }, '停');
            }
          }
        }
      ],
      // pageData: [],
      data: [],
      interval: null,
      polling: true,
      websock: null,
    }
  },
  computed: {
    currentPageData() {
      let data = this.data;
      if (this.filters.name || this.filters.status) {
        let patt = new RegExp(this.filters.name);
        data = data.filter((item, index, array) => {
          if ((patt.test(item.task_id) || patt.test(item.name)) && item.taskmeta.status.toUpperCase().indexOf(this.filters.status.toUpperCase()) !== -1) {
            return true
          }
        })
      }
      let currentPageData;
      let _start = (this.currentPage - 1) * this.pageSize;
      let _end = this.currentPage * this.pageSize;
      if (this.dataCount < this.pageSize) {
        currentPageData = data;
      } else {
        currentPageData = data.slice(_start, _end);
      }
      return currentPageData
    }
  },
  filters: {
    timeFilter(datetime) {
      return (!datetime || datetime === '') ? '' : parseTime(new Date(datetime), 'yyyy-MM-dd');
    }
  },
  created() {
    this.loadJob();
    this.initWebSocket();
    this.interval = setInterval(() => {
      this.websocketsend('start')
    }, 2000)
    // this.interval = setInterval(this.loadJob, 2000)
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.polling = false;
    // this.websocketsend('')
    this.websock.close();
  },
  methods: {
    loadJob() {
      job_manage().then(res => {
        this.data = res.data.datas.map(item => {
          item.create_date = parseTime(item.create_date);
          item.runtime = item.runtime !== null ? item.runtime.toFixed(0) + 's' : '';
          item.durationFormatted = item.durationFormatted !== null ? item.durationFormatted.toFixed(0) + 's' : '';
          return item
        });
        this.dataCount = this.data.length;
        // if (this.polling) {
        //   setTimeout(this.loadJob, 2000)
        // }
      })
    },
    changePage(index) {
    },
    changeSize(size) {
      this.pageSize = size;
    },
    filterStatus(status) {
      this.filters.status = status === this.filters.status ? null : status;
    },
    handleSearch(value) {
      let patt = new RegExp(value);
      // this.data = this.data.filter((item, index) => {
      //   if (patt.test(item.task_id) || patt.test(item.name)) {
      //     // console.log(JSON.stringify(item))
      //     return true
      //   }
      // })
    },
    exportData(row, format) {
      let state = row.taskmeta.status;
      let task_id = row.task_id;
      if (state === 'SUCCESS') {
        let url_download = `http://127.0.0.1:8000/app/get_job_result/?task_id=${task_id}&format=${format}`;
        window.open(url_download);
      } else if (state === 'FAILURE') {
        const content = `<pre>${row.taskmeta.traceback}</pre>`;
        this.$Modal.error({
          width: 900,
          content: content
        })
      } else if (state === 'UNKNOWN') {
        this.$Modal.error({
          // width: 900,
          content: '任务下达失败，请检查celery状态！'
        })
      } else {
        this.$Modal.warning({
          title: '任务被终止',
          content: JSON.stringify(row.taskmeta.result)
        });
      }

      // this.$refs.table.exportCsv({
      //   filename: 'result',
      //   columns: this.historyColumns_expand,
      //   data: this.ajaxHistoryData
      // });
    },
    jobKill(task_id) {
      let param = {task_id: task_id};
      this.$Modal.confirm({
        title: '确认停止',
        content: '<p>是否确定要停止此作业？</p>',
        onOk: () => {
          job_kill(param).then(res => {
            console.log(res.data);
          });
        },
        onCancel: () => {
        }
      });
      // window.open('http://10.39.211.151:8000/app/job_manage/' + taskid + '/kill/')
    },
    initWebSocket() { // 初始化weosocket
      // ws地址
      // console.log(process.env.PORT)
      const wsuri = 'ws://10.39.211.151:8000/app/job_manage/';
      // const wsuri = process.env.WS_API + '/websocket/threadsocket';
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) { // 数据接收
      let data = JSON.parse(e.data);
      // console.log(data);
      this.data = data.map(item => {
        item.create_date = parseTime(item.create_date);
        item.runtime = item.runtime !== null ? item.runtime.toFixed(0) + 's' : '';
        item.durationFormatted = item.durationFormatted !== null ? item.durationFormatted.toFixed(0) + 's' : '';
        return item
      });
      this.dataCount = this.data.length;
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
      console.log('WebSocket连接成功: ' + this.websock.url);
      // this.websocketsend('start')
    },
    websocketclose(e) { // 关闭
      console.log('connection closed (' + e.code + ')');
    }
  }
}
</script>
