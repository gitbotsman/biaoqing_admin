import toastr from './toastr.esm'import md5 from 'js-md5'import { base64_encode } from './utils'/* AJAX 文件上传 */export default class Uploader {  static DEFAULTS = {    callback (e) {      console.log(e)    }  }  constructor (url, options) {    if (typeof url !== 'string') {      throw new Error('[Uploader]: url is must be an string!')    }    this.options = Object.assign({}, Uploader.DEFAULTS, options)    this.url = url  }  start (file, options,cb) {    // 优先使用options里的上传url    var url = options.url || this.url    var xhr = new XMLHttpRequest()    var formdata = new FormData()    // 添加文件    formdata.append('file', file, file.name)    // 添加额外参数    Object.keys(options.data).forEach(k => {      formdata.append(k, options.data[k])    })    // 构建上传文件对象    var fileitem = {      name: file.name,      size: file.size,      type: file.type,      url: file.url,      progress: 0,      loaded: 0,      total: 0,      id: 0,      xhr    }    xhr.open('POST', url, true)    xhr.responseType = 'json'    xhr.upload.addEventListener('progress', function (e) {      fileitem.loaded = e.loaded      fileitem.total = e.total      if (e.lengthComputable) {        fileitem.progress = e.loaded / e.total * 100      }    })    // xhr.setRequestHeader("authorization","UPYUN harvey:"+options.sign)    xhr.onreadystatechange=function(){      if(xhr.readyState==4){        cb(xhr.response)      }    }    xhr.addEventListener('abort', function (e) {      console.log('abort', e)    })    xhr.addEventListener('error', function (e) {      console.log('error', e)      toastr.error(e)    })    xhr.addEventListener('load', function (e) {      Object.assign(fileitem, xhr.response.file)    })    xhr.send(formdata)    return fileitem  }  // 添加图片  addFile(files,key){    var $this = this;    var options=$this.Authorization(key);    var filePromise = new Promise(function(resolve, reject){      Array.from(files).forEach(file => {        var upfile = {          file:file,          options:options        }               if (file.type.startsWith('image/')) {          var reader = new FileReader()          reader.readAsDataURL(file)          return reader.onload = (e) => {            var image = new Image();                image.src = e.target.result;                image.onload = function () {                  resolve([this,file,upfile])                }          }        }else{           resolve([file,upfile])        }      })    });    return filePromise;  }  bannergetFileName(filename) {      var tempArr = filename.split(".");      var ext;      if (tempArr.length === 1 || (tempArr[0] === "" && tempArr.length === 2)) {          ext = "";      } else {          ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case      }      var now = new Date();      var date = now.getFullYear()+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+(now.getDate()<10?"0":"")+now.getDate();      var random = Math.floor(Math.random()*9000)+1000;      return date+"/"+this.getTimeHSS()+random+"."+ext;  }  Authorization(key){    var bucket = 'biaoqingimg';//upyun空间名     var form_api_secret ='7ksIaYvblj0Lxc7KILu6lvYfnVg=';    var operator = 'harvey';    var password = md5('bq.1415926');    var options = {      'bucket':bucket,      'expiration':Math.floor(new Date().getTime() / 1000) + 86400,      'save-key':key    }    options=JSON.stringify(options);    var policy = base64_encode(options);//policy 生成    var signature = md5(policy+'&'+form_api_secret);// sigenature生成    var options = {      data:{        'policy':policy,        'signature':signature      }    }    return options;  }  getTimeHSS() {    var now = new Date();        var hh = now.getHours();            //时        var mm = now.getMinutes();          //分        var ss = now.getSeconds();           //秒        var clock = "";        if(hh < 10)        clock += "0";        clock += hh;        if (mm < 10)       clock += '0';         clock += mm;         if (ss < 10)       clock += '0';         clock += ss;         return clock;  }}