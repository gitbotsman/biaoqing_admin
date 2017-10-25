/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */
    


export default{
    upbanner(container,pickfiles){
        
    }
    // upbanner(container,pickfiles){
    //     var banner_imageFile=[];
    //     var bannerQiniu = new QiniuJsSDK();
    //     var banner_uploader = bannerQiniu.uploader({
    //         runtimes: 'html5,flash,html4',
    //         browse_button: pickfiles,
    //         container: container,
    //         drop_element: container,
    //         max_file_size: '10mb',
    //         flash_swf_url: 'Moxie.swf',
    //         dragdrop: true,
    //         chunk_size: '0mb',
    //         multi_selection: false,
    //         unique_names: false,
    //         save_key: false,
    //         domain: 'https://img.biaoqing.com/',
    //         get_new_uptoken: false,
    //         auto_start: true,
    //         //unique_names: true,      //设置所有文件名唯一  
    //         filters: {  
    //             mime_types : [ //只允许上传图片  
    //                 { title : "Image files", extensions : "jpg,jpeg,gif,png" },  
    //             ],  
    //             prevent_duplicates : true //不允许选取重复文件  
    //         },  
    //         log_level: 5,
    //         init: {
    //             'Key': function(up, file) {
    //                 var now = new Date();
    //                 var date = now.getFullYear()+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+(now.getDate()<10?"0":"")+now.getDate();
           
    //                 return "topic/banner/"+date+"/"+bannergetFileName(file.name);
    //             },
    //             'FilesAdded': function(up, files) {
    //                 $('.loading').css('display','block')
    //                 var reader = new FileReader();
    //                 reader.readAsDataURL(files[0].getNative());
    //                 reader.onload = (function (e) {
    //                     var image = new Image();
    //                     image.src = e.target.result;
    //                     image.onload = function () {
    //                         if(this.width==750 && this.height==300){
    //                             files[0].width = this.width;
    //                             files[0].height = this.height;
    //                             for (var i = 0; i < files.length; i++) {
    //                                 var fileItem = files[i].getNative(),
    //                                       url = window.URL || window.webkitURL || window.mozURL;
    //                                 var src = url.createObjectURL(fileItem);

    //                                 $('#banner_img_box').val(src);
    //                                 $('.bind_phone_qr_disable').removeClass("bind_phone_qr")
    //                                 $('#banner_pickfiles').removeClass('banner_default').css({
    //                                     'background-image':"url("+src+")" 
    //                                 })
    //                             }
    //                         }else{
    //                             swal({
    //                                 text: '横幅尺寸不正确',
    //                                 showConfirmButton:false,
    //                                 target:'.mySwl_box',
    //                                 width:'auto',
    //                                 timer:1000,
    //                                 animation:false,
    //                             }).catch(swal.noop)
    //                             $.each(banner_uploader.files, function (i, file) {
    //                                 up.removeFile(file);
    //                             });
    //                             $('#banner_img_box').val('');
    //                             $('#banner_pickfiles').addClass('banner_default')

    //                         }
                            
    //                     };
    //                 });
    //                 $.each(banner_uploader.files, function (i, file) {
    //                     if (up.files.length <= 1) {
    //                         return;
    //                     }
    //                     up.removeFile(file);
    //                 });
    //             },
    //             'BeforeUpload': function(up, file) {
    //                 var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
    //             },
    //             'UploadProgress': function(up, file) {
    //             },
    //             'FileUploaded': function(up, file, info) {
    //                 info = eval('('+info+')');
    //                 var imgKey = encodeURI(info.url);
    //                 if(imgKey.indexOf('/')==0){
    //                     imgKey=imgKey.replace("/",'')
    //                 }
    //                 banner_imageFile[0]={image:imgKey+"",isLayer:false};
    //             },
    //             'UploadComplete': function() {
    //                 $('.loading').css('display','none')
    //                 $('.bind_phone_qr_disable').addClass("bind_phone_qr")
    //                 if(banner_imageFile.length>0){
    //                     var banner = banner_imageFile[0]['image'];
    //                     if (banner) {
    //                         $('#banner_img_box').val(banner)
    //                     }
    //                 }
    //             },
                
    //             'Error': function(up, err, errTip) {
    //                 $('.loading').css('display','none')
    //                 if(err.message=='File size error.'){
    //                     swal({
    //                       text: '图片太大请重新上传',
    //                       showConfirmButton:false,
    //                       target:'.mySwl_box',
    //                       width:'auto',
    //                       timer:1500,
    //                       animation:false,
    //                     }).catch(swal.noop)
    //                 }else{
    //                     swal({
    //                       text: err.message,
    //                       showConfirmButton:false,
    //                       target:'.mySwl_box',
    //                       width:'auto',
    //                       timer:1000,
    //                       animation:false,
    //                     }).catch(swal.noop)
    //                 }
    //             }
    //         }
    //     });
    //     console.log(banner_uploader)
    // },

}


// function bannergetFileName(filename) {
//     var tempArr = filename.split(".");
//     var ext;
//     if (tempArr.length === 1 || (tempArr[0] === "" && tempArr.length === 2)) {
//         ext = "";
//     } else {
//         ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case
//     }
//     var userId = $('#header_userId').val();
//     var imgIndex = banner_imageFile.length+1
//     var fileName =userId;
    
//     return getTimeHSS()+fileName+"."+ext;
// }



