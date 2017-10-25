import Treetable from './treetable.esm'
import toastr from './toastr.esm'
import swal from 'sweetalert'
import $ from 'jquery'


/* 生成当前时间戳对应的62进制形式短链接 */
export const shorten = function () {
  var DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var seq = new Date().getTime()
  var len = DIGITS.length
  var arr = []
  do {
    arr.unshift(DIGITS.charAt(seq % len))
    seq = parseInt(seq / len)
  } while (seq != 0)
  return arr.join('')
}
export const base64_encode = function(a) {
  var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var c, d, e, f, g, h, i, j, k = 0,
  l = 0,
  m = "",
  n = [];
  if (!a) {
    return a
  }
  a = utf8_encode(a + "");
  do {
    c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, f = j >> 18 & 63, g = j >> 12 & 63, h = j >> 6 & 63, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i)
  } while ( k < a . length );
  switch (m = n.join(""), a.length % 3) {
  case 1:
    m = m.slice(0, -2) + "==";
    break;
  case 2:
    m = m.slice(0, -1) + "="
  }
  return m
}
function utf8_encode(a) {
    if (null === a || "undefined" == typeof a){
      return ""
    }
    var b = a + "";
    var c = "",
    d, e, f = 0;
    d = e = 0,
    f = b.length;
    for (var g = 0; f > g; g++) {
      var h = b.charCodeAt(g);
      var i = null;
      if (128 > h) {
        e++
      } else {
        if (h > 127 && 2048 > h) {
          i = String.fromCharCode(h >> 6 | 192, 63 & h | 128)
        } else {
          if (63488 & h ^ !0) {
            i = String.fromCharCode(h >> 12 | 224, h >> 6 & 63 | 128, 63 & h | 128)
          } else {
            if (64512 & h ^ !0) {
              throw new RangeError("Unmatched trail surrogate at " + g)
            }
            var j = b.charCodeAt(++g);
            if (64512 & j ^ !0) {
              throw new RangeError("Unmatched lead surrogate at " + (g - 1))
            }
            h = ((1023 & h) << 10) + (1023 & j) + 65536,
            i = String.fromCharCode(h >> 18 | 240, h >> 12 & 63 | 128, h >> 6 & 63 | 128, 63 & h | 128)
          }
        }
      }
      null !== i && (e > d && (c += b.slice(d, e)), c += i, d = e = g + 1)
    }
    return e > d && (c += b.slice(d, f)),
    c
  }


export function treeify (el, expanded) {
  return new Treetable(el, {
    clickableNodeNames: true,
    expandable: true,
    indent: 35,
    onInitialized () {
      Object.keys(expanded).forEach(n => {
        this.expandNode(n)
      })
    },
    onNodeCollapse () {
      delete expanded[this.id]
    },
    onNodeExpand () {
      expanded[this.id] = 1
    }
  })
}

/* 模态框 */
export class Modal {
  constructor (el, options) {
    this.el = el
    this.options = options
  }

  // TODO: 添加动画效果
  show (cb) {
    document.body.classList.add('modal-open')
    this.el.style.display = 'block'
    setTimeout(() => {
      this.el.classList.add('show')
      cb && cb()
    })
    this.el.addEventListener('click', (e) => {
      if (e.target !== this.el) return
      this.hide()
    })
  }

  hide () {
    this.el.classList.remove('show')
    setTimeout(() => {
      document.body.classList.remove('modal-open')
      this.el.style.display = 'none'
    }, 300)
  }
}

export const showResponse = function (response, success, fail) {
  if (response.data.success) {
    return swal({type: 'success', title: '操作成功', text: '您的操作已经执行成功!'}, () => {
      success && success()
    })
  }
  if (response.data.errors) {
    toastr.warning(Object.keys(response.data.errors).map(k => response.data.errors[k]).join('<br>'))
  }
  if (response.data.msg) {
    swal('操作失败', response.data.msg, 'error')
  }
  fail && fail()
}

export const del = function (confirmed) {
  return swal({
    type: 'warning',
    title: '您确定?',
    text: '删除的记录将不能恢复!',
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '是的, 我要删除!',
    confirmButtonColor: '#DD6B55',
    showLoaderOnConfirm: true,
    closeOnConfirm: false
  }, confirmed)
}

/* returns duration from millisecends in hh:mm:ss format */
export const format = function (secends, millis) {
  if (!secends) return ''
  secends = millis ? Math.floor(secends / 1000) : secends
  var hou = Math.floor(secends / 3600),
      min = Math.floor(secends % 3600 / 60),
      sec = Math.floor(secends % 60)

  hou = hou ? hou + ':' : ''
  return hou + hou ? pad(min) : min + ':' + pad(sec)
}

/* 个位前补零 */
export const pad = function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// ybfsajszqt

/* 格式化文件大小 */
export const filesize = function (bytes) {
  var unit = 'B'
  if (bytes > 1024) {
    bytes /= 1024
    unit = 'KB'
  }
  if (bytes > 1024) {
    bytes /= 1024
    unit = ' MB'
  }
  return Number(bytes.toFixed(1)) + ' ' + unit
}

/* 计算已过去的时间 */
export const timepast = function (timestamp) {
  var uminute = 60,
      uhour   = uminute * 60,
      uday    = uhour * 24,
      umonth  = uday * 30,
      uyear   = umonth * 12,
      diff    = (new Date().getTime() - timestamp) / 1000
  if (diff < 60) return Math.abs(Math.ceil(diff)) + '秒前'
  var year = parseInt(diff / uyear)
  if (year > 0) return year + '年前'
  var month = parseInt(diff / umonth)
  if (month > 0) return month + '个月前'
  var week = parseInt(diff / (uday * 7))
  if (week > 0) return week + '周前'
  var days = parseInt(diff / uday)
  if (days > 0) return days + '天前'
  var hours = parseInt(diff / uhour)
  if (hours > 0) return hours + '小时前'
  var minites = parseInt(diff / uminute)
  if (minites > 0) return minites + '分钟前'
}
/* 格式化时间 */
export const formatTime = function (ns) {
  var timeFormate = new Date(ns);
  var now = new Date();
  var nowYear = now.getFullYear();
  　　var year = timeFormate.getFullYear(),
    　　month = zero(timeFormate.getMonth() + 1),
    　　date = zero(timeFormate.getDate()),
    　　hour = zero(timeFormate.getHours()),
    　　minute = zero(timeFormate.getMinutes()),
    　　second = zero(timeFormate.getSeconds());

  if (nowYear == year) {
    var time = month + "-" + date + " " + hour + ":" + minute;
  } else {
    var time = year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }
  return time;
}

function zero(time) {
  var time = String(time)
  if (time.length < 2) {
    return '0' + time
  } else {
    return time
  }
}

/* 触发DOM事件 */
export const triggerEvent = function (el, name, data) {
  var evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  if (data) {
    Object.assign(evt, data)
  }
  el.dispatchEvent(evt)
}

/* 匹配最近的祖先节点 */
export const closest = function (el, selector, ctx = document) {
  if (!el) return null
  while (el = el.parentNode) {
    if (el === ctx || matches(el, selector)) {
      return el
    }
  }
}

/* 判断元素是否匹配给定的CSS选择器 */
export const matches = function (el, selector) {
  if (!el) return false
  selector = selector.split('.')
  var tag = selector.shift().toUpperCase(),
      re  = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g')
  return (
    (tag === '' || el.nodeName.toUpperCase() === tag) &&
    (!selector.length || ((' ' + el.className + ' ').match(re) || []).length === selector.length)
  )
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = function (func, wait, immediate) {
  var timeout, args, context, timestamp, result

  var later = function () {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function () {
    context = this
    args = arguments
    timestamp = Date.now()
    var callnow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callnow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}


/* 鼠标移入图片上时放大图片 */
export const viewImg = function (e, maxWidth) {
  var $this = $(e.target);
  var clientY = parseInt(e.clientY);
  var src = $this.find('.biaoqing-list-cover-img').attr('src');
  var orignWidth = $this.find('.biaoqing-list-cover-img').attr('data-width'),
      orignHeight = $this.find('.biaoqing-list-cover-img').attr('data-height');
  
  

  var width = parseInt(orignWidth);
  var height = parseInt(orignHeight);

  if(orignWidth==undefined || orignHeight==undefined){
    var img  = new Image();
    img.src = src;
    if(img.complete){
        var width=img.width;
        var height=img.height;
    }else{
      img.onload = function(){
        var width=img.width;
        var height=img.height;
      }
    }
  }//no width

  if(width > maxWidth){
    if(width!=height){
      height = (height/width)*maxWidth;
      width = maxWidth;
    }else{
      width = maxWidth;
      height = maxWidth;
    }
  }
  
  src=src.replace('!thumb240','')
  var html ="<div class='img-view-con'><img src="+src+"></div>"
  if(clientY-50 < height){
    height=clientY-50;
  }
  $this.prepend(html)
  $this.find('.img-view-con').css({
    'maxWidth':maxWidth,
    right:'-'+width+'px',
    top:'-'+height+'px'
  })
  $this.find('.img-view-con img').css({
    'maxWidth':maxWidth
  })


}
/* 鼠标移出图片上时取消放大图片 */
export const clearViewImg = function (e) {
  var $this = $(e.target);
  $this.find('.img-view-con').remove();
}
