function getUrlParam(paramName) {
  var url = window.location.href;
  var reg = new RegExp("(\\?|&)" + paramName + "=([^&]*)(&|$)");
  var param = url.substr(1).match(reg);
  if (param != null) {
    return param[2];
  }
  return null;
}
function encodeParam(param) {
  if (param) {
    return encodeURIComponent(param);
  } else {
    return "";
  }
}
function getCodeParam(param) {
  if (param) {
    return decodeURIComponent(param);
  } else {
    return "";
  }
}
function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number(bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}
function uploadCropImg(blob) {
  var formdata = new FormData();
  formdata.append('imageFile', blob);
  formdata.append('validate', 'validate');
  formdata.append('clientid', 'h5')
  $.ajax({
    url: 'https://api.shufashibie.com/wz/recognize',//http://39.107.32.119:8088
    type: 'POST',
    data: formdata,
    contentType: false,
    processData: false
  }).done(function (data) {
    if (data.status === 0) {
      localStorage.setItem('file', JSON.stringify(data.result))
      window.location.href = 'recognize.html?filename='+data.result.filename
    } else {
      $("#promp-msg").text(data.message).parent().removeClass('am-hide').addClass('am-alert-danger').removeClass('am-alert-success')
    }
  }).fail(function () {

  })
}
//裁剪
function startCropper() {
  var $img =  $("#img-view")
  $img.cropper('destroy');
  $img.cropper({
    modal: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    autoCrop: true,
    autoCropArea: 1,
    center: true,
    crop: function (e) {
      var json = [
        '{"x":' + e.x,
        '"y":' + e.y,
        '"height":' + e.height,
        '"width":' + e.width,
        '"rotate":' + e.rotate + '}'
      ].join();
    }
  });
}
//获取上传文件显示路径
function getObjectURL(file) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}
//base64图片转换为blob对象文件
function convertBase64UrlToBlob(urlData){
  var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte//处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob( [ab] , {type : 'image/png'});
}