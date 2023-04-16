import config from '../config/config.js';

/**
 * API统一接口请求 (工具自动维护token，使用时无需关注)
 * 注: 请求接口时会自动携带token，禁止[扩展]用于请求第三方接口!!!
 */
export default {
  /**
   * 将指定url追加token
   * @param {string} url 链接
   * @returns 带有token的URL
   */
  getAuthUrl: function (url) {
    return (
      (url.indexOf('http') === 0 ? url : config.base + url) +
      (url.indexOf('?') === -1 ? '?' : '&') +
      'Authorization=' +
      this.getToken()
    );
  },
  /**
   * 获取当前的token值
   * @returns token
   */
  getToken: function () {
    return wx.getStorageSync('token');
  },
  /**
   * 获取当前的登录信息（权限信息与资料信息）
   * @param {Function} callbackFun 数据回调函数
   */
  getLoginInfo: function (callbackFun) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // 本地权限信息有缓存，直接返回缓存数据
        callbackFun(res.data);
      },
      fail: function () {
        // 本地没有缓存，向平台获取
        that._resetToken(callbackFun);
      },
    });
  },
  /**
   * 无需重新登录刷新权限信息
   */
  refreshLoginInfo: function (successFun) {
    this.get(
      '/api/applet-user/wx/loginInfo',
      {},
      (loginInfo) => {
        console.log('[刷新权限信息]', loginInfo);
        this.setLoginInfo(loginInfo);
        successFun(loginInfo);
      },
      this.showSysError
    );
  },
  /**
   * 发送接口网络请求
   * @param {*} option 请求参数
   * @param {boolean} 是否忽略自动登录
   */
  send: function (option, ignoreResetToken) {
    let that = this;
    option.url = option.url || '';
    if (option.url.indexOf('http') !== 0) {
      option.url = config.base + option.url;
    }
    option.method = option.method || 'GET';
    option.header = option.header || {};
    option.header['content-type'] = 'application/json';
    if (!option.ignoreAuth) {
      // 接口需要身份验证
      option.header['Authorization'] = that.getToken();
    }
    let copyFun = {
      success: option.success,
      fail: option.fail || that.showError,
    };
    option.success = function (res) {
      if (res.statusCode !== 200) {
        copyFun.fail('接口请求出错，请稍后再试!', -1);
      } else {
        if (typeof res.data === 'object') {
          if (typeof res.data.succeeded !== 'undefined') {
            // Api统一响应格式处理
            if (res.data.succeeded) {
              copyFun.success(res.data.data);
            } else {
              if (res.data.loginFlag) {
                // 身份无效，需要重新登录
                if (ignoreResetToken) {
                  console.log(
                    '系统出错，自动登录后，重复出现身份无效!',
                    option
                  );
                  that.showSysError();
                } else {
                  option.success = copyFun.success;
                  option.fail = copyFun.fail;
                  that._resetToken(option);
                }
              } else if (res.data.permissionFlag) {
                // 登录用户无权限
                copyFun.fail(
                  res.data.errorMessage || '无权操作!',
                  res.data.errorCode || -1,
                  res.data
                );
              } else {
                // 其它业务错误
                copyFun.fail(
                  res.data.errorMessage || '操作出错!',
                  res.data.errorCode || -1,
                  res.data
                );
              }
            }
          } else {
            // 不支持的响应对象
            copyFun.fail('系统错误，不支持的响应格式!', -1);
          }
        } else {
          // 不支持的响应的数据
          copyFun.fail('系统错误，不支持的响应数据!', -1);
        }
      }
    };
    option.fail = function (e) {
      copyFun.fail('网络请求出错!', -1);
    };
    wx.request(option);
  },
  /**
   * GET请求
   * @param {String} url 接口地址
   * @param {*} data 参数数据
   * @param {Function(data, completeRes)} successFun 成功回调
   * @param {Function(errorMessage, errorCode)} errorFun 失败回调
   */
  get: function (url, data, successFun, errorFun) {
    this.send({
      method: 'GET',
      url: url,
      data: data,
      success: successFun,
      fail: errorFun,
    });
  },
  /**
   * POST请求
   * @param {String} url 接口地址
   * @param {*} data 参数数据
   * @param {Function(data, completeRes)} successFun 成功回调
   * @param {Function(errorMessage, errorCode)} errorFun 失败回调
   */
  post: function (url, data, successFun, errorFun) {
    this.send({
      method: 'POST',
      url: url,
      data: data,
      success: successFun,
      fail: errorFun,
    });
  },
  /**
   * DELETE请求
   * @param {String} url 接口地址
   * @param {*} data 参数数据
   * @param {Function(data, completeRes)} successFun 成功回调
   * @param {Function(errorMessage, errorCode)} errorFun 失败回调
   */
  del: function (url, data, successFun, errorFun) {
    this.send({
      method: 'DELETE',
      url: url,
      data: data,
      success: successFun,
      fail: errorFun,
    });
  },
  /**
   * PUT请求
   * @param {String} url 接口地址
   * @param {*} data 参数数据
   * @param {Function(data, completeRes)} successFun 成功回调
   * @param {Function(errorMessage, errorCode)} errorFun 失败回调
   */
  put: function (url, data, successFun, errorFun) {
    this.send({
      method: 'PUT',
      url: url,
      data: data,
      success: successFun,
      fail: errorFun,
    });
  },
  /**
   * 统一显示错误
   * @param {string} errorMessage
   * @param {string} errorCode
   */
  showError: function (errorMessage, errorCode) {
    wx.showToast({
      title: errorMessage || '操作失败!',
      icon: 'none',
      duration: 2000,
    });
  },
  /**
   * 统一显示不可处理的系统错误
   */
  showSysError: function () {
    wx.showToast({
      title: '非常抱歉，小程序出现不可解决的错误!  请重新打开小程序!',
      icon: 'none',
      duration: 1000 * 60,
    });
  },
  setToken: function (tokenValue) {
    console.log('[更新Token] ' + tokenValue);
    wx.setStorageSync('token', tokenValue);
  },
  setLoginInfo: function (loginInfo) {
    console.log('[更新登录信息]setLoginInfo()', loginInfo);
    wx.setStorageSync('userInfo', loginInfo);
    this.setToken(loginInfo.token);
  },
  /**
   * 重新获取token(wx.login()无需用户授权即可请求)
   * @param {*} requestOption token获取成功，重新发起的请求数据或回调方法
   */
  _resetToken: function (requestOption) {
    let that = this;
    console.log('Token已过期，重新获取中...');
    wx.login({
      success: function (res) {
        if (res.code) {
          // 使用微信小程序code，请求api获取新的token
          wx.request({
            method: 'GET',
            url: config.base + '/api/applet-user/wx/login',
            data: {
              code: res.code,
            },
            success: function (res) {
              console.log('ApiTokenRes', res);
              if (res.statusCode === 200 && typeof res.data === 'object') {
                if (res.data.succeeded) {
                  that.setLoginInfo(res.data.data);
                  // 获取Token成功后，重新发起请求。(此次请求，关闭自动登录，避免陷入无限自动登录)
                  if (typeof requestOption === 'function') {
                    requestOption(res.data.data);
                  } else {
                    that.send(requestOption, true);
                  }
                  return;
                }
              }
              console.error(
                '[apiRequest.js] /api/applet-user/wx/login 接口响应出错!',
                res
              );
              that.showSysError();
            },
            fail: function (e) {
              console.error(
                '[apiRequest.js]wx.login() 获取小程序Code，响应错误!',
                e
              );
              that.showSysError();
            },
          });
        } else {
          that.showSysError();
        }
      },
      fail: function (e) {
        console.error('[apiRequest.js]wx.login() 获取小程序Code错误!', e);
        that.showSysError();
      },
    });
  },
};
