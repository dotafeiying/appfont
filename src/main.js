// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './styles/index.less';
import 'font-awesome/scss/font-awesome.scss'

import './assets/iconfont/iconfont.css'

// import EasyScroll from 'easyscroll';
// Vue.use(EasyScroll);

// import BaiduMap from 'vue-baidu-map'

// 引入样式
// import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
// import {VTable, VPagination} from 'vue-easytable'

// import VueBlu from 'vue-blu'
// import 'vue-blu/dist/css/vue-blu.min.css'
//
// Vue.use(VueBlu)

// 注册到全局
// Vue.component(VTable.name, VTable)
// Vue.component(VPagination.name, VPagination)

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(iView);

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: 'GygcEB3Vw3NOYWlHDq1KOOz2vI0C2ZCG'
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
