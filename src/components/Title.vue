<template>
  <div class="vtitle">
    <blockquote class="vquote" :style="{borderLeftColor: lineColor}">{{title}}</blockquote>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .vtitle {
    padding-left: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .vquote {
    /*margin-bottom: 10px;*/
    /*padding: 15px;*/
    padding-left: 10px;
    line-height: 22px;
    border-left: 4px solid #2b85e4;
    border-radius: 0 2px 2px 0;
    font-weight: bold;
  }
</style>

<script>
export default {
  name: 'vTitle',
  props: [
    'title',
    'lineColor'
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
