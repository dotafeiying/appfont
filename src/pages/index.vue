<template>
  <div>
    <!--<input type="file" value=""  id="file"  @change='onUpload'>//注意不能带括号-->
    <input type="file" @change="getFile($event)" />
    <button @click="upload">上传</button>
    <div>{{ result }}</div>
    <div v-if="uping==1">正在上传中</div>
  </div>
</template>

<script>
import axios from 'axios';
// Vue.prototype.$http = axios;

export default {
  name: 'index',
  data() {
    return {
      upath: '',
      result: '',
      uping: 0
    }
  },
  methods: {
    upload: function() {
      console.log(this.upath);
      let zipFormData = new FormData();
      zipFormData.append('filename', this.upath);// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      this.uping = 1;
      axios.post('/app/upload/', zipFormData, config).then((response) => {
        // let _this = this;
        // console.log(_this)
        console.log(response);
        console.log(response.data);
        // console.log(response.bodyText);

        let resultobj = response.data;
        this.uping = 0;
        this.result = resultobj.size;
      });
      // axios.post('http://localhost:8000/app/upload/', zipFormData, config).then(function(response) {
      //   let _this = this;
      //   console.log(_this)
      //   console.log(response);
      //   console.log(response.data);
      //   // console.log(response.bodyText);
      //
      //   let resultobj = response.data;
      //   // this.uping = 0;
      //   this.result = resultobj.size;
      // });
    },
    getFile: function(event) {
      this.upath = event.target.files[0];
    }
  }
}
</script>

<style scoped>

</style>
