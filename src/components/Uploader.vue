<template>
  <div id="up">
    <div id='zuiUploader' class="uploader" data-url="/app/upload/">
      <div class="uploader-message text-center">
        <div class="content"></div>
        <button type="button" class="close">×</button>
      </div>
      <div class="uploader-files file-list file-list-lg" data-drag-placeholder="请拖拽文件到此处"></div>
      <div class="uploader-actions">
        <div class="uploader-status pull-right text-muted"></div>
        <button type="button" class="btn btn-link uploader-btn-browse"><i class="icon icon-plus"></i> 选择文件</button>
        <button type="button" class="btn btn-link uploader-btn-start"><i class="icon icon-cloud-upload"></i> 开始上传</button>
      </div>
    </div>
    <!--<div id="result" class="datagrid"></div>-->
  </div>
</template>

<script>
// import axios from 'axios';
// import { upload } from '../api/api';
// Vue.prototype.$http = axios;
// import $ from 'jquery';

export default {
  name: 'Uploader',
  props: [
    'showBtn'
  ],
  data() {
    return {
      upath: '',
      result: '',
      uping: 0
    }
  },
  methods: {
    show() {
      this.$emit('success', true)
    },
    change() {
      this.data.showBtn = true
    }
  },
  created() {
    // this.$emit('success', true)
  },
  mounted() {
    /* eslint-disable */
    // $('#result').modalTrigger({custom: '<h1>此内容是自定义的</h1><p>哈哈:)</p>'});
    // this.showBtn = true
    // this.data.showBtn = true
    let self=this;

    $('#zuiUploader').uploader({
      // limitFilesCount: 1,
      // deleteConfirm: true,
      // removeUploaded: true,
      chunk_size: 0,
      max_retries:0,
      multipart_params: function(file, params) {
        return {filename: file.name, extension: file.ext};
      },
      deleteActionOnDone: function(file, doRemoveFile){
        return true
      },
      filters: {
        // 只允许上传图片或图标（.ico）
        mime_types: [
          {title: '表格', extensions: 'xlsx,xls'},
          // {title: '图标', extensions: 'ico'}
        ],
        // 最大上传文件为 1MB
        // max_file_size: '1mb',
        // 不允许上传重复文件
        prevent_duplicates: false
      },
      onFilesAdded: function(file) {
        self.$emit('success', false);
        let files = this.getFiles();
        files.length >1 && this.removeFile(files[0]);
      },
      responseHandler: function(responseObject, file){
        // console.log(JSON.parse(responseObject.response).result);
        let data=JSON.parse(responseObject.response);
        let code =data.status_code;
        let result=data.result;
        let msg=data.msg;
        let row_error =data.row_error;
        let cell_error =data.cell_error;
        let config = {};
        if (cell_error) {
          cell_error.forEach(item => {
            config[item] = {
              // html: true,
              // className: 'text-danger',
              style: {
                color: '#fff',
                backgroundColor: 'red'
              }
            }
          });
        }
        if (row_error) {
          row_error.forEach(item => {
            config['R' + item] = {
              // html: true,
              // className: 'text-danger',
              style: {
                // color: '#fff',
                backgroundColor: '#ffe5ef'
              }
            }
          });
        }
        // let file_path = data.file_path;
        // let file_path_id = data.file_path_id;

        // let rows=JSON.parse(responseObject.response).rows;
        // let cols=JSON.parse(responseObject.response).cols;
        // let options={
        //   dataSource: {
        //     cols:cols,
        //     array:rows
        //   },
        //   // ... 其他初始化选项
        // };
        //
        // $('.datagrid').remove();
        // let $div=$(`<div class='datagrid' id='{file.id}'></div>`);
        // $('#up').append($div);
        // $div.datagrid(options);


        // $('#result').html(JSON.parse(responseObject.response).result)
        // $('#result').modalTrigger({custom: JSON.parse(responseObject.response).result});
        // $('#result').html(result);
        // $('.previewtable').datagrid();
        result=result+`<div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
                        </div>`;
        let modalTrigger = new $.zui.ModalTrigger({custom: result,backdrop: 'static',size: 'lg',title: `${msg}（${file.name}）:`});
        modalTrigger.show();
        $('.previewtable').datagrid({
          configs: config
        });
        $(document).ready(function(){
          $("#save").click(function(){
            modalTrigger.close();
          });
        });
        if(code===0){
          // let result=data.result;
          // let msg=data.msg;
          let file_path = data.file_path;
          let file_path_id = data.file_path_id;
          self.$emit('success', true);
          self.$emit('get_file_path', file_path_id, file_path);
        } else {
          self.$emit('success', false);
          return 'error!'
        }
      }
    });
  },
  beforeDestroy() {
    let uploader = $('#zuiUploader').data('zui.uploader');
    uploader.destroy()
  }
}
</script>

<style scoped>

</style>
