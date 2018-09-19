<template>
  <section>page6...
    <div id="map"></div>
  </section>
</template>
<style>
  #map{
    width:100%;
    height:400px;
  }
</style>
<script>
export default {
  data() {

  },
  methods: {

  },
  mounted: function(){
    var map = new BMap.Map("map");                        // 创建Map实例
    map.centerAndZoom(new BMap.Point(105.000, 38.000), 5);     // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom();                        //启用滚轮放大缩小
    var data = [{'lng': 105.52, 'lat': 38.43},{'lng': 105.32, 'lat': 38.43},{'lng': 105.62, 'lat': 38.43}]
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
      var points = [];  // 添加海量点数据
      for (var i = 0; i < data.length; i++) {
        points.push(new BMap.Point(data[i]['lng'], data[i]['lat']));
      }
      console.log(points)
      var options = {
        size: BMAP_POINT_SIZE_SMALL,
        shape: BMAP_POINT_SHAPE_STAR,
        color: '#d340c3'
      }
      var pointCollection = new BMap.PointCollection(points);  // 初始化PointCollection
      pointCollection.addEventListener('click', function (e) {
        alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
      });
      console.log(pointCollection)
      console.log(pointCollection.isVisible())
      map.addOverlay(pointCollection);  // 添加Overlay
      console.log(map)

    } else {
      alert('请在chrome、safari、IE8+以上浏览器查看本示例');
    }
  }
}
</script>
