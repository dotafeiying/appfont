<template>
  <div class="container-fluid">
    <div class="row">
      <!--<ul class="nav nav-secondary nav-justified">-->
        <!--<template v-for="item in routes" v-if="item.children">-->
          <!--<router-link v-for="(child,index) in item.children" :key="index" :to="child.path" tag="li" exact-active-class="active">-->
            <!--<a>{{child.name}}</a>-->
          <!--</router-link>-->
        <!--</template>-->
      <!--</ul>-->
      <!--<router-link to="/">About</router-link>-->
      <nav class="navbar navbar-blue" role="navigation">
        <div class="container-fluid">
          <!-- 导航头部 -->
          <div class="navbar-header">
            <!-- 移动设备上的导航切换按钮 -->
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse-example">
              <span class="sr-only">切换导航</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <!-- 品牌名称或logo -->
            <!--<a class="navbar-brand logo" href="your/nice/url"><img :src="img_logo"  alt="EduSoho在线学习平台"> 湖北电信网络优化平台</a>-->
            <router-link to="/" exact-active-class="active" class="navbar-brand logo"><i class="iconfont ivu-icon-dianxin"></i><span>湖北电信网络优化平台</span></router-link>
          </div>
          <!-- 导航项目 -->
          <div class="collapse navbar-collapse navbar-collapse-example">
            <!-- 一般导航项目 -->
            <ul class="nav navbar-nav">
              <template v-for="item in routes" v-if="item.children">
                <router-link v-for="(child,index) in item.children" :key="index" :to="child.path" v-if="child.meta.menu" tag="li" exact-active-class="active">
                  <a>{{child.name}}</a>
                </router-link>
              </template>
            </ul>
            <!-- 右侧的导航项目 -->
            <ul class="nav navbar-nav navbar-right">
              <li><a target="_blank" href="/admin/">后台管理</a></li>
              <li class="dropdown">
                <a href="" class="dropdown-toggle" data-toggle="dropdown">帮助 <b class="caret"></b></a>
                <ul class="dropdown-menu" role="menu">
                  <router-link to="/help" tag="li" exact-active-class="active"><a>分析流程</a></router-link>
                  <router-link to="/introduce" tag="li" exact-active-class="active"><a>算法介绍</a></router-link>
                  <li class="divider"></li>
                  <router-link to="/introduce" tag="li" exact-active-class="active"><a>使用说明</a></router-link>
                  <router-link to="/introduce" tag="li" exact-active-class="active"><a>版本</a></router-link>
                </ul>
              </li>
            </ul>
          </div><!-- END .navbar-collapse -->
        </div>
      </nav>
    </div>

    <div class="row clearfix">
      <div class="col-xs-12 column">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  /*$navColor: #fff;*/
  /*$navHoverColor: #fff;
  $navColor: darken($navHoverColor,15%);*/
  $navHoverColor: #fff;
  $navColor: #D3D3D3;
  $navbgColor: #3a9dff;

  .box {
    /*padding-top: 20px;*/
    /*background-color: #eee;*/
  }
  /*导航条*/
  .navbar-nav > li > a {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .navbar-brand {
    height: auto;
  }
  .navbar {
    margin-bottom: 0;
    border: none;
    a:focus {
      outline: none;
      text-decoration: none;
      color: #2d8cf0;
    }
    .navbar-header .logo {
      padding-top: 15px;
      padding-bottom: 15px;
      color: #fff;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 30px;
        &::before {
          padding-right: 4px;
        }
      }
    }
  }
  .navbar-blue {
    /*background: linear-gradient(143deg,darken($navbgColor,40%) 20%,darken($navbgColor,20%) 81%,$navbgColor);*/
    background: linear-gradient(143deg,#2945cb 20%,#2b83f9 81%,#3a9dff);
    /*background-color: $navbgColor;*/
    border-radius: 0;
    .navbar-nav > .active > a {
      color: $navHoverColor;
      /*font-weight: bold;*/
      /*font-size: 13px;*/
    }
    .navbar-nav > li > a {
      /*color: #bbbec4;*/
      color: $navColor;
      &:focus {
        background-color: transparent;
      }
      &:hover {
        color: $navHoverColor;
        background-color: transparent;
      }
    }
  }
</style>

<script>
// import Uploader from '@/components/Uploader'
import img_logo from '@/assets/logo.png'
// import img_logo from '@/assets/telecom.ico'
export default {
  name: 'layout',
  components: {
    // Uploader
  },
  computed: {
    routes() {
      // console.log(this.$router.options.routes)
      return this.$router.options.routes;
    }
  },
  data() {
    return {
      upath: '',
      result: '',
      uping: 0,
      img_logo
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<!--<style scoped lang="scss">-->
  <!--.logo img {-->
    <!--height: 23px;-->
    <!--width: auto;-->
    <!--display: inline;-->
  <!--}-->
  <!--.navbar {-->
    <!--/*margin-bottom: 10px;*/-->
    <!--background-color: #fff;-->
  <!--}-->
<!--</style>-->
