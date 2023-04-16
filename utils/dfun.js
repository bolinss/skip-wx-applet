import config from '../config/config.js';

import apiRequest from '../utils/apiRequest.js'

export default {
  /*
  url:接口地址
  params:参数
  type:请求名称
  sfunc:成功回调
  efunc：失败回调
  */
  getAjax: function (url, params, types, sfunc, efunc) {
    // 兼容修改：跳绳接口请求，使用apiRequest
    if (url.indexOf('http') !== 0) {
      return apiRequest.send({
        method: types,
        url: url,
        data: params,
        success: resData => {
          sfunc({
            succeeded: true,
            data: resData
          });
        },
        fail: (errorMessage, errorCode) => {
          sfunc({
            succeeded: false,
            errorMessage: errorMessage,
            errorCode: errorCode
          });
        }
      });
    }

    var ajaxUrl = url.indexOf('http') != -1 ? url : config.base + url;
    var token = wx.getStorageSync('token');
    var timer;
    timer = setTimeout(() => {
      wx.showLoading({
        title: '加载中...',
      });
    }, 2000);
    wx.request({
      url: ajaxUrl,
      method: types,
      header: {
        'content-type': 'application/json',
        Authorization: token,
      },
      data: params,
      success: function (res) {
        wx.hideLoading();
        clearTimeout(timer);
        if (res.data.code === 401) {
          //登录过期
          sfunc(res.data);
          // wx.redirectTo({
          // 	url: '/pages/main/index/index'
          // })
        } else {
          sfunc(res.data);
        }
      },
      fail: function (res) {
        if (efunc) efunc(res);
      },
    });
  },
  goLogin() {
    //跳转登录页
    this.toast('未登录，无法操作');
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/main/index/index',
      });
    }, 1500);
  },
  /**
   * 返回当前日期YMD格式,
   * addDay:+-多少天
   */
  getDate: function (addDay) {
    var day;
    if (addDay) {
      if (addDay > 0) {
        day = this.formatTime(new Date().getTime() + 86400000 * addDay, 'YMD');
      } else {
        day = this.formatTime(new Date().getTime() - 86400000 * addDay, 'YMD');
      }
    } else {
      day = this.formatTime(new Date().getTime(), 'YMD');
    }
    return day;
  },
  getTime: function () {
    var data = new Date();
    var hour = this.addZero(data.getHours());
    var minute = this.addZero(data.getMinutes());
    return hour + ':' + minute;
  },
  //格式化时间
  formatTime: function (value, type) {
    if (!value) return null;

    if (!type) {
      type = 'YMDHMS';
    }
    var dataTime = '';

    var data = new Date(value);
    var year = data.getFullYear();
    var month = this.addZero(data.getMonth() + 1);
    var day = this.addZero(data.getDate());
    var hour = this.addZero(data.getHours());
    var minute = this.addZero(data.getMinutes());
    var second = this.addZero(data.getSeconds());
    if (type == 'YMD') {
      dataTime = year + '-' + month + '-' + day;
    } else if (type == 'YMDHMS') {
      dataTime =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second;
    } else if (type == 'YMDHM') {
      dataTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    } else if (type == 'HMS') {
      dataTime = hour + ':' + minute + ':' + second;
    } else if (type == 'YM') {
      dataTime = year + '-' + month;
    } else if (type == 'YYYY') {
      dataTime = year;
    }
    return dataTime; //将格式化后的字符串输出到前端显示
  },
  addZero: function (val) {
    if (val < 10) {
      return '0' + val;
    } else {
      return val;
    }
  },
  confirm: function (content, sfun) {
    wx.showModal({
      content: content,
      success: function (opt) {
        if (opt.confirm) {
          sfun();
        }
      },
    });
  },
  toast: function (content) {
    wx.showToast({
      icon: 'none',
      title: content,
    });
  },
  toast2: function (content) {
    wx.showToast({
      title: content,
    });
  },
  toast3: function (content) {
    wx.showToast({
      icon: 'loading',
      title: content,
    });
  },
  back: function (data, opt) {
    opt = opt || 1;
    let pages = getCurrentPages();
    let prePage = pages[pages.length - (opt + 1)]
    prePage.setData({
      otherPageData: data
    })
    wx.navigateBack({
      delta: opt,
    });
  },
  // <i-message id="message" /> "i-message": "/dist/message/index"
  success: function (content, sfun, delay) {
    //content:成功提示文字，sfun：成功后回调函数，delay：回调函数延迟时间，默认1秒
    var delay = delay || 500;
    var content = content || '操作成功';
    wx.showToast({
      icon: 'success',
      title: content,
    });
    if (sfun) {
      setTimeout(function () {
        sfun();
      }, delay);
    }
  },
  getData(e) {
    if (e)
      return e.currentTarget.dataset.opt;
  },
  validatePhone(phoneNumber) {
    if (!phoneNumber) return false;
    let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return myreg.test(phoneNumber);
  }
};