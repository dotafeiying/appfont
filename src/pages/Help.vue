<template>
  <div style="padding: 20px 20px 20px 20px">
    <Row class="row">
      <Col span="24">
        <div class="panel">
          <div class="panel-heading">
            算法流程图
          </div>
          <div class="panel-body">
            <div class="img_wrap">
              <img class="pic" :src="img_src">
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <!--<div class="row">-->
      <!--<div class="panel">-->
        <!--<div class="panel-heading">-->
          <!--算法流程图-->
        <!--</div>-->
        <!--<div class="panel-body">-->
          <!--<div class="img_wrap">-->
            <!--<img class="pic" :src="img_src">-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>
<style scoped lang="scss">
  .img_wrap {
    /*padding-top: 40px;*/
    text-align: center;
  }
  .pic{
    /*margin: auto;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
  }
</style>
<script>
import img_src from '@/assets/images/流程图.png'
export default {
  data() {
    return {
      img_src
    }
  },
  methods: {

  }
}
</script>
