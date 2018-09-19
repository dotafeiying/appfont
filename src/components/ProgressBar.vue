<template>
  <div class="progressContainer" :title="percent">
    <div class="bar-label">{{percent}}%</div>
    <div class="bar bar-success" :style="{width:percent+'%',backgroundColor:color}"></div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  $height: 18px;
  .progressContainer {
    height: $height;
    line-height: $height;
    margin-bottom: 0;
    padding: 0;
    border-radius: 4px;
    border: none;
    overflow: hidden;
    background-color: #ddd;
  }
  .bar-label {
    text-align: center;
    color: #FFFFFF;
    /*font-size: 12px;*/
    text-shadow: -1px 0 1px #333, 0 1px 1px #333, 1px 0 1px #333, 0 -1px 1px #333;
    height: 100%;
  }
  .bar {
    margin-top: -$height;
    background-color: #2f973f;
    /*transition: width .6s ease;*/
    float: left;
    width: 0;
    height: 100%;
    /*font-size: 12px;*/
    color: #fff;
    text-align: center;
    border-radius: 4px;
  }
</style>

<script>
export default {
  name: 'ProgressBar',
  props: [
    'percent',
    'color'
  ],
  data() {
    return {
      result: '',
      uping: 0
    }
  },
  methods: {
    show() {
      // this.$emit('success', true)
    },
    change() {
      // this.data.showBtn = true
    }
  },
  created() {
    // this.$emit('success', true)
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
