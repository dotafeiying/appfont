<template>
  <div>
    <!--<Row class="expand-row">-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">小区名: </span>-->
      <!--<span class="expand-value">{{ row.cellname }}</span>-->
      <!--</Col>-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">频点号: </span>-->
      <!--<span class="expand-value">{{ row.freqID }}</span>-->
      <!--</Col>-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">场景: </span>-->
      <!--<span class="expand-value">{{ row.scene }}</span>-->
      <!--</Col>-->
    <!--</Row>-->
    <!--<Row>-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">是否室内站: </span>-->
      <!--<span class="expand-value">{{ row.indoor }}</span>-->
      <!--</Col>-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">邻小区信息: </span>-->
      <!--<span class="expand-value"><pre class="" style="max-height: 350px;overflow: auto;" contenteditable="true">{{row.n_cell | ncellFilter}}</pre></span>-->
      <!--</Col>-->
      <!--<Col span="8">-->
      <!--<span class="expand-key">日期: </span>-->
      <!--<span class="expand-value">{{ row.finish_time }}</span>-->
      <!--</Col>-->
    <!--</Row>-->
    <Row style="background-color: #fff">
      <span class="expand-key">邻小区信息: </span>
      <Tabs :animated="false">
        <TabPane label="详情" icon="ios-list-outline">
          <!--<Col span="8">-->
          <!--<span class="expand-key">邻小区信息: </span>-->
          <span class="expand-value"><pre class="" style="max-height: 350px;overflow: auto;" contenteditable="true">{{ncellData | ncellFilter}}</pre></span>
          <!--</Col>-->
        </TabPane>
        <TabPane label="表格" icon="grid">
        <Table size="small" :columns="columns" :data="ncellData" border></Table>
        </TabPane>
        <!--<TabPane label="标签三">标签三的内容</TabPane>-->
      </Tabs>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '基站号',
          key: 'enbid',
          minWidth: 15
        },
        {
          title: '小区号',
          key: 'cellid',
          minWidth: 12
        },
        {
          title: '小区名',
          key: 'cellname',
          minWidth: 280
        },
        {
          title: 'freqID',
          key: 'freqID'
        },
        {
          title: 'indoor',
          key: 'indoor'
        },
        // {
        //   title: 'lng',
        //   key: 'lng'
        // },
        // {
        //   title: 'lat',
        //   key: 'lat'
        // },
        // {
        //   title: 'pdcp_down_flow',
        //   key: 'pdcp_down_flow'
        // },
        // {
        //   title: 'pdcp_up_flow',
        //   key: 'pdcp_up_flow'
        // },
        // {
        //   title: 'prb_percent',
        //   key: 'prb_percent'
        // },
        {
          title: 'scene',
          key: 'scene'
        },
        {
          title: '是否高负荷',
          key: '是否高负荷'
        },
        {
          title: '距离',
          key: '距离'
        }
      ],
      // data: JSON.parse(this.row.n_cell.replace(/NaN/g, 'null'))
    }
  },
  computed: {
    // ncell: function() {
    //   return JSON.stringify(eval('(' + this.row.n_cell + ')'), null, 2);
    // }
    ncellData: function() {
      return JSON.parse(this.row.n_cell.replace(/NaN/g, 'null'))
    }
  },
  filters: {
    ncellFilter(ncell) {
      return ncell.length === 0 ? '无' : JSON.stringify(ncell, null, 2);
      // return JSON.stringify(JSON.parse(ncell.replace(/NaN/g, 'null')), null, 2);
      // return JSON.stringify(JSON.parse(JSON.stringify(ncell)), null, 2);
    }
  },
  created() {
    // console.log(JSON.parse(this.row.n_cell.replace(/NaN/g, 'null')))
  },
  beforeDestroy() {
    // console.log("Home destroy");
    // this.row = null;
    // this.columns = null;
    // this.data = null;
  }
};
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .expand-key{
    font-weight: bold;
  }
</style>
