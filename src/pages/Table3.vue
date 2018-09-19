<template>
  <div id="table3" style="padding: 20px 20px 20px 20px">
    <!--工具条-->
    <Row class="row">
      <Col :lg="24" style="background: #fff;padding: 8px 10px;margin-bottom: 20px">
        <Card dis-hover>
          <Form ref="formInline" :model="filters" :rules="ruleInline" :label-width="60" inline>
            <FormItem prop="name" label="搜索字段">
              <Input type="text" v-model="filters.name" placeholder="输入基站编号或者基站名" style="width: 200px">
              </Input>
            </FormItem>
            <FormItem prop="dateValue" label="时间">
              <DatePicker type="datetimerange" :value="filters.dateValue" :options="options" @on-change="handleChange" :clearable=false format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间范围" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem  prop="indoor" label="是否室内站" :label-width="80">
              <Select v-model="filters.indoor" style="width: 80px;">
                <Option v-for="item in indoorChoices" :value="item" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem  prop="scene" label="场景" :label-width="80">
              <Select v-model="filters.scene" style="width: 100px;">
                <Option v-for="item in sceneChoices" :value="item" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem  prop="scene" label="频段" :label-width="80">
              <Select v-model="filters.freqID" style="width: 100px;">
                <Option v-for="item in freqIDChoices" :value="item" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="10">
              <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
            </FormItem>
            <!--<Button  class="pull-right" type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> Export source data</Button>-->
          </Form>
        </Card>
      </Col>
    </Row>
    <!--网元-->
    <Row class="row" :gutter="20">
      <Col span="5">
        <Row style="background: #fff;padding: 10px">
          <Tabs type="card" :animated="false" v-model="tabSelected">
            <TabPane label="网元树" name="tree">
              <div class="scrollbar-hover" style="max-height: 660px; overflow: auto;">
                <!--<tree :data="data3" :load-data="loadData" show-checkbox ref="tree"></tree>-->
                <el-tree
                  ref="tree"
                  :props="props"
                  node-key="id"
                  :default-expanded-keys="[1]"
                  :default-checked-keys="[1]"
                  :load="loadNode"
                  :render-content="renderContent"
                  lazy
                  show-checkbox
                  @check-change="handleCheckChange">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <template v-if="node.level===1">
                      <span class="custom-tree-node">
                        <span>{node.label}</span>
                      </span>
                    </template>
                    <template v-else-if="node.level===2">
                      <span class="custom-tree-node">
                        <span style="margin-right: 4px">
                          <i class="iconfont ivu-icon-ios-arrow-forward"></i>
                        </span>
                        <span>{node.label}</span>
                      </span>
                    </template>
                    <template v-else>
                      <span class="custom-tree-node">
                        <span style="margin-right: 4px;color: blue">
                          <i class="iconfont ivu-icon-jizhanxinhao"></i>
                        </span>
                        <span>{node.label}</span>
                      </span>
                    </template>
                  </span>
                </el-tree>
              </div>
              <!--<div style="max-height: 660px;">-->
                <!--<tree :data="data3" :load-data="loadData" show-checkbox ref="tree"></tree>-->
              <!--</div>-->
              <!--<Tree :data="data2" show-checkbox></Tree>-->
            </TabPane>
            <TabPane label="搜索" name="search">
              <div class="scrollbar-hover" style="max-height: 660px; overflow: auto;">
                <Row>
                  <Button type="text" @click="clearSelect" class="pull-right" size="small"><p class="text-primary">清空选项</p></Button>
                </Row>
                <p class="text-muted">已选中{{model.length}}个基站</p>
                <Select
                  v-model="model"
                  placeholder="模糊查找， 输入基站编号或者小区名"
                  clearable
                  multiple
                  filterable
                  remote
                  transfer
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <Option v-for="(option, index) in selectOptions" :value="option.value" :key="index">
                    <span>{{option.label}}</span>
                    <span style="float:right;color:#b2b2b2">{{option.value}}</span>
                  </Option>
                  <!--<Option v-for="(option, index) in selectOptions" :value="option.value" :key="index">{{option.label}}</Option>-->
                </Select>
              </div>
            </TabPane>
          </Tabs>
        </Row>
      </Col>
      <!--数据表格-->
      <Col span="19">
        <Card dis-hover>
          <!--<Row>-->
            <!--<a v-show="exportIconShow" class="pull-right" @click="exportData" data-toggle="tooltip" data-placement="bottom" title="将结果下载为csv格式"><i class="icon icon-file-excel" style="font-size: 18px"></i></a>-->
          <!--</Row>-->
          <!--<br>-->
          <p slot="title">
            <i class="fa fa-table" aria-hidden="true"></i>
            查询结果
          </p>
          <a v-if="exportIconShow" href="#" slot="extra" @click.prevent="exportData" data-toggle="tooltip" data-placement="bottom" title="将结果下载为csv格式">
            <i class="icon icon-file-excel" style="font-size: 16px"></i>
            导出
          </a>
          <p v-else slot="extra" class="text-primary">{{progress.num? '已查询 '+ progress.num + ' 条' : ''}}{{progress.percent === null || progress.percent == 100 ? '' : '('+progress.percent+'%)'}}</p>
          <Row>
            <Spin fix v-if="spinShow">
              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
              <div>正在查询，请稍后。。。</div>
            </Spin>
            <Table  height="600" size="small" :columns="historyColumns" :data="historyData" ref="table"></Table>
            <Page :current.sync="currentPage" :total="dataCount" :page-size="pageSize" :page-size-opts="
      pageSizeOpts" show-sizer show-total class="paging" @on-change="changePage" @on-page-size-change="changeSize"></Page>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<style lang="scss">
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-table-small td {
    height: 28px;
  }
  .ivu-table-small .ivu-table-cell-with-expand {
    height: 32px;
    line-height: 32px;
  }
  .paging{
    float:right;
    margin-top:10px;
  }
  /***********修改table表格样式--深色系**********/
  .ivu-table th {
    /*border: 1px solid #455b7d;*/
    /*border-bottom: 0;*/
    /*border-right: 0;*/
    /*background-color: #f1f1f1;*/
    /*background: none!important;*/
  }
  .ivu-form-item {
    /*margin-bottom: 0 !important;*/
    /*background-color: #f0f0ee;*/
    /*margin: 0;*/
  }
  /*滚动条样式覆盖*/
  .scrollbar-hover::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-tree-node {
    padding-left: 4px;
    flex: 1;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    /*font-size: 12px;*/
    padding-right: 8px;
    label {
      margin-bottom: 0;
    }
  }
</style>
<script>
// import util from '../utils/index'
import {parseTime} from '../utils/index'
import {export_data, get_table_limit, get_table, get_enb_tree, get_choice} from '@/api/api';
import expandRow from '@/components/table-expand.vue';
import ScrollBar from '@/components/ScrollBar.vue'
// import ScrollBar from "../components/ScrollBar";

export default {
  components: {
    ScrollBar,
    expandRow
  },
  data() {
    const validateDate = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('Please enter your datetime'));
      } else {
        callback();
      }
    };
    const start = new Date();
    const end = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    const startStr = parseTime(start);
    const endStr = parseTime(end);
    return {
      progress: {
        num: null,
        percent: null
      },
      num: 0,
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      filters: {
        name: '',
        enbid: '',
        cellname: '',
        enbList: null,
        indoor: '全部',
        scene: '全部',
        freqID: '全部',
        dateValue: [startStr, endStr]
      },
      indoorChoices: ['全部', '是', '否'],
      sceneChoices: [],
      freqIDChoices: [],
      ruleInline: {
        dateValue: [
          { validator: validateDate, trigger: 'change' }
        ]
      },
      pk: null,
      options: {
        shortcuts: [
          {
            text: '1 week',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '1 month',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '3 months',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      spinShow: false,
      exportIconShow: false,
      ajaxHistoryData: [],
      ajaxHistoryData_copy: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      currentPage: 1,
      pageSize: 20,
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
          title: '日期',
          key: 'finish_time',
          minWidth: 75,
          align: 'center',
          sortable: true
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
        // {
        //   title: 'lng',
        //   key: 'lng',
        //   maxWidth: 110
        // },
        // {
        //   title: 'lat',
        //   key: 'lat',
        //   maxWidth: 110
        // },
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
          title: '结果',
          key: 'result',
          align: 'center',
          minWidth: 80
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                  // padding: '1px 5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, 'View'),
              // h('Button', {
              //   props: {
              //     type: 'error',
              //     size: 'small'
              //   },
              //   on: {
              //     click: () => {
              //       // this.$router.push({ path: '/hello' })
              //       // alert(params.index)
              //       this.$router.push({name: '单站分析', query: {enbid: params.row.enbid, cellid: params.row.cellid}})
              //       // this.remove(params.index)
              //     }
              //   }
              // }, 'Delete')
            ]);
          }
        }

      ],
      // historyData: [],
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
      tabSelected: 'tree',
      data3: [{
        title: '湖北省',
        type: 'province',
        value: '湖北省',
        expand: true,
        checked: true,
        loading: true,
        children: []
      }],
      loading: false,
      selectOptions: [],
      model: ''
      // data3: []
    }
  },
  computed: {
    historyData() {
      let historyData;
      let _start = (this.currentPage - 1) * this.pageSize;
      let _end = this.currentPage * this.pageSize;
      if (this.dataCount < this.pageSize) {
        historyData = this.ajaxHistoryData;
      } else {
        historyData = this.ajaxHistoryData.slice(_start, _end);
      }
      return historyData
    }
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    renderContent(h, { node, data, store }) {
      // console.log(node)
      if (node.level === 1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>);
      }
      if (node.level === 2) {
        return (
          <span class="custom-tree-node">
            <span style="margin-right: 4px">
              <i class="iconfont ivu-icon-ios-arrow-forward"></i>
            </span>
            <span>{node.label}</span>
          </span>);
      }
      if (node.level === 3) {
        return (
          <span class="custom-tree-node">
            <span style="margin-right: 4px;color: blue">
              <i class="iconfont ivu-icon-jizhanxinhao"></i>
            </span>
            <span>{node.label}</span>
        </span>);
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: 1, name: '湖北省', type: 'province', value: '湖北省' }])
      }
      if (node.level === 1) {
        let para = {
          tabSelected: this.tabSelected
        };
        get_enb_tree(para).then(res => {
          // console.log(res.data);
          let data = res.data.data.map((item, index) => {
            return { id: parseInt('2' + index), name: item, type: 'city', value: item }
          })
          resolve(data)
        })
        // return resolve([{ name: 'region1' }, { name: 'region2' }]);
      }
      if (node.level === 2) {
        let para = {city: node.data.name, tabSelected: this.tabSelected};
        console.log(para);
        get_enb_tree(para).then(res => {
          let data = res.data.data.map((item, index) => {
            return {
              id: '3' + index,
              name: item.cellname || item.enbid + '_' + item.cellid,
              type: 'cell',
              value: item.enbid + '_' + item.cellid,
              leaf: true
            }
          })
          resolve(data)
        })
      }
      if (node.level > 3) return resolve([]);
    },
    // 获取历史记录信息
    handleListApproveHistory() {
      this.exportIconShow = false;
      this.progress = {
        num: null,
        percent: null
      };
      this.ajaxHistoryData = [];
      // this.historyData = [];
      this.ajaxHistoryData_copy = [];
      // 保存取到的所有数据
      // let enbList = null;
      if (this.tabSelected === 'tree') {
        this.filters.enbList = this.$refs.tree.getCheckedNodes().map(value => {
          return [value.type, value.value]
        });
      } else {
        this.filters.enbList = this.model.map(item => { return ['cell', item] })
      }
      // console.log(dataTree);
      let para = {
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize,
        name: this.filters.name,
        dateStart: this.filters.dateValue ? this.filters.dateValue[0] : '',
        dateEnd: this.filters.dateValue ? this.filters.dateValue[1] : '',
        enbList: this.filters.enbList,
        indoor: this.filters.indoor,
        scene: this.filters.scene,
        freqID: this.filters.freqID
      };
      this.spinShow = true;
      this.websocketsend(JSON.stringify(para))
      // get_table(para).then(res => {
      //   this.spinShow = false;
      //   // console.log(res.data.rows);
      //   this.ajaxHistoryData = res.data.rows;
      //   this.dataCount = res.data.total;
      //   this.pk = res.data.pk;
      //   if (this.dataCount > 0) {
      //     this.exportIconShow = true;
      //   }
      //   this.ajaxHistoryData_copy = this.ajaxHistoryData;
      //   if (this.dataCount < this.pageSize) {
      //     this.historyData = this.ajaxHistoryData;
      //   } else {
      //     this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
      //   }
      // }).catch(res => {
      //   alert(res)
      // })
    },
    initChoice() {
      get_choice().then(res => {
        this.sceneChoices = res.data.sceneChoices;
        this.freqIDChoices = res.data.freqIDChoices;
      })
    },
    changePage(index) {
      // this.currentPage = index;
      // let _start = (index - 1) * this.pageSize;
      // let _end = index * this.pageSize;
      // this.historyData = this.ajaxHistoryData.slice(_start, _end);
    },
    changeSize(size) {
      // this.currentPage = 1;
      this.pageSize = size;
      // if (this.dataCount < this.pageSize) {
      //   this.historyData = this.ajaxHistoryData;
      // } else {
      //   this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
      // }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.$Message.success('Success!');
          this.currentPage = 1;
          this.handleListApproveHistory();
        } else {
          this.$Message.error('Fail!');
        }
      });
      // this.dataCount = this.ajaxHistoryData.length;
      // this.currentPage = 1;
      // this.changePage(1)
    },
    initTreeData() {
      let para = {
        tabSelected: this.tabSelected
      };
      return get_enb_tree(para).then(res => {
        this.data3[0].loading = false;
        // return new Promise((resolve, reject) => { resolve(res.data.data.map(item => { return {'title': item, 'value': item, 'loading': false, children: []} })) })
        this.data3[0].children = res.data.data.map(item => {
          return {
            'title': item,
            'type': 'city',
            'value': item,
            'loading': false,
            render: (h, { root, node, data }) => {
              return h('span', {
                style: {
                  // display: 'inline-block',
                  width: '100%'
                }
              }, [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-folder-outline'
                    },
                    style: {
                      marginRight: '2px'
                    }
                  }),
                  h('span', data.title)
                ])
              ]);
            },
            children: []
          }
        })
      })
    },
    loadData(item, callback) {
      // console.log(JSON.stringify(item))
      if (item.title === '湖北省') {
        let para = {
          tabSelected: this.tabSelected
        };
        get_enb_tree(para).then(res => {
          const data = res.data.data.map(item => {
            return {
              title: item,
              type: 'city',
              value: item,
              loading: false,
              render: (h, { root, node, data }) => {
                return h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%'
                  }
                }, [
                  h('span', [
                    h('Icon', {
                      props: {
                        type: 'ios-folder-outline'
                      },
                      style: {
                        marginRight: '8px'
                      }
                    }),
                    h('span', data.title)
                  ])
                ]);
              },
              children: []
            }
          });
          callback(data);
        })
        // const data = await this.initTreeData();
        // callback(data);
      } else {
        let para = {city: item.title, tabSelected: this.tabSelected};
        get_enb_tree(para).then(res => {
          const data = res.data.data.map(item => {
            return {
              title: item.cellname || item.enbid + '_' + item.cellid,
              type: 'cell',
              value: item.enbid + '_' + item.cellid,
              // render: (h, { root, node, data }) => {
              //   return h('span', {
              //     style: {
              //       display: 'inline-block',
              //       width: '100%'
              //     }
              //   }, [
              //     h('span', [
              //       h('i', {
              //         class: 'iconfont ivu-icon-jizhanxinhao',
              //         style: {
              //           marginRight: '2px',
              //           color: 'blue'
              //         }
              //       }),
              //       h('span', data.value)
              //     ])
              //   ]);
              // },
            }
          });
          callback(data);
        });
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let para = {
          tabSelected: this.tabSelected
        };
        get_enb_tree(para).then(res => {
          this.loading = false;
          // console.log(res.data.data)
          // console.log(res.data.data.slice(1, 3).filter(item => item.cellname.indexOf('武汉') > -1));
          let list = res.data.data.map(item => {
            return {
              value: item.enbid + '_' + item.cellid,
              label: item.cellname || item.enbid + '_' + item.cellid
            }
          })
          this.selectOptions = list.filter(item => item.label.indexOf($.trim(query)) > -1 || item.value.indexOf($.trim(query)) > -1);
        })

        // setTimeout(() => {
        //   this.loading = false;
        //   let list1 = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
        //   let list = list1.map(item => {
        //     return {
        //       value: item,
        //       label: item
        //     };
        //   });
        //   this.selectOptions = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
        // }, 4000);
      } else {
        this.selectOptions = [];
      }
    },
    clearSelect() {
      this.model = '';
      this.selectOptions = ''
    },
    // 下载文件
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], {type: 'data:attachment/csv;charset=utf-8'});
      let url = URL.createObjectURL(blob);
      console.log(url)
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', 'excel.csv');
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blob);
    },
    exportData() {
      // let para = {
      //   name: this.filters.name,
      //   type: 'csv',
      //   pk: this.pk
      // };
      // let config = {
      //   responseType: 'blob'
      // };
      // let name = this.filters.name;
      // let dateStart = this.filters.dateValue[0];
      // let dateEnd = this.filters.dateValue[1];
      // let enbList = JSON.stringify(this.filters.enbList);
      // let url_download = `/app/export_data/?format=csv&name=${name}&
      //                 dateStart=${dateStart}&dateEnd=${dateEnd}&enbList=${enbList}`;
      let url_download = `/app/export_data/?format=csv&pk=${this.pk}`;
      window.open(url_download)
      // export_data(para, config).then(res => {
      //   console.log(res);
      //   // this.download(res.data)
      //   // let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
      // }).catch(res => {
      //   alert(res)
      // })
    },
    handleChange(date) {
      this.filters.dateValue = date;
    },
    show(index) {
      this.$Modal.info({
        title: 'BTS Info',
        content: `enbid：${this.ajaxHistoryData[index].enbid}<br>
                  cellid：${this.ajaxHistoryData[index].cellid}<br>
                  cellname：${this.ajaxHistoryData[index].cellname}<br>
                  lng：${this.ajaxHistoryData[index].lng}<br>
                  lat：${this.ajaxHistoryData[index].lat}<br>`
      })
    },
    initWebSocket() { // 初始化weosocket
      // ws地址
      // console.log(process.env.PORT)
      const wsuri = 'ws://10.39.211.151:8000/app/get_table/';
      // const wsuri = process.env.WS_API + '/websocket/threadsocket';
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) { // 数据接收
      // console.log(e.data);
      let data = JSON.parse(e.data);
      // console.log(data);
      this.spinShow = false;
      this.progress.num = data.num;
      this.progress.percent = data.total ? (Math.round((data.num / data.total) * 10000) / 100).toFixed(0) : null;
      if (data.code === 0) {
        // this.num = data.num;
        // this.ajaxHistoryData.push(data.rows)
        this.ajaxHistoryData.push.apply(this.ajaxHistoryData, data.rows);
        this.dataCount = data.num;
        // if (this.dataCount < this.pageSize) {
        //   this.historyData = this.ajaxHistoryData;
        // } else {
        //   this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
        // }
      } else {
        this.websock.close();
        let duration = data.duration;
        this.$Message.info(`耗时 ${duration}秒`);
        // this.ajaxHistoryData = data.rows;
        this.dataCount = data.total;
        this.pk = data.pk;
        if (this.dataCount > 0) {
          this.exportIconShow = true;
        }
        // this.ajaxHistoryData_copy = this.ajaxHistoryData;
        // if (this.dataCount < this.pageSize) {
        //   this.historyData = this.ajaxHistoryData;
        // } else {
        //   this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
        // }
      }

      // this.ajaxHistoryData_copy = this.ajaxHistoryData;
      // if (this.dataCount < this.pageSize) {
      //   this.historyData = this.ajaxHistoryData;
      // } else {
      //   this.historyData = this.ajaxHistoryData.slice(0, this.pageSize);
      // }
      // }
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
    }
  },
  created() {
    // this.initTreeData();
    this.initChoice()
    this.initWebSocket()
    // this.handleListApproveHistory();
  },
  mounted() {
    /* eslint-disable */
    $('[data-toggle="tooltip"]').tooltip({
      placement: 'bottom'
    });
  }
}
</script>
