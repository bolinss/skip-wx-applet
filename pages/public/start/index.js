// pages/public/start/index.js
/*
启动页面，来源:
1.打开小程序默认首页
2.首页二维码回调
3.设备二维码回调
4.班级二维码回调
5.子账号授权二维码回调
*/

import api from '../../../utils/apiRequest';

const PAGE_ID_INDEX_DEFAULT = -1; // 默认页面
const PAGE_ID_INDEX_TEACHER = 1; // 教师端首页
const PAGE_ID_INDEX_FAMILY = 2; // 家长端首页
const PAGE_ID_INDEX_ADD_DEVICE = 3; // 添加设备页面

const DEFAULT_PAGE_ID = PAGE_ID_INDEX_FAMILY; // 默认首页

Page({
  data: {
    pageHideFlag: false,
    step: 'none', // 当前步骤  默认:none  准备跳转信息:ready  检测权限:auth  开始跳转页面:goto
    redirectToUrl: '', // 跳转的页面地址
    chooseRole: false, // 是否需要选择角色
    permission: {
      // 统一权限许可信息
      roleFamilyFlag: false, // 页面需要家长端角色
      roleTeacherFlag: false, // 页面需要教师端角色
    },
  },

  /**
   * 设置当前步骤
   * @param {string} step 步骤   默认:none  准备跳转信息:ready  检测权限:auth  开始跳转页面:goto
   */
  setStep: function (step) {
    this.setData({
      step: step,
    });
  },

  /**
   * 步骤切换
   */
  nextStep: function () {
    let that = this;
    let step = that.data.step;
    console.log('[步骤切换] ' + step);

    //【步骤】权限检测(无论是否为新用户，api.getLoginInfo()方法都能拿到权限信息)
    if (step === 'auth') {
      let permission = that.data.permission;
      api.getLoginInfo(function (loginInfo) {
        console.log('【步骤】权限检测 - loginInfo', loginInfo);
        console.log('【步骤】权限检测 - permission', permission);

        // 权限判断：微信授权基本资料
        if (!loginInfo.appletUserInfoFlag) {
          // 跳转到基本信息授权页面
          wx.navigateTo({
            url: '/pages/public/login/index',
          });
          return;
        }

        // 权限判断: 教师
        if (permission.roleTeacherFlag) {
          if (!loginInfo.roleTeacherFlag) {
            // 当前登录用户没有教师角色，去授权
            wx.navigateTo({
              url: '/teacherPages/teacherConfirm/index?from=start',
            });
            return;
          }
        }

        // 权限判断: 家长
        if (permission.roleFamilyFlag) {
          if (!loginInfo.roleFamilyFlag) {
            // 当前登录用户没有家长角色，去授权
            // TODO 为用户创建家长版角色
            api.post(
              '/api/applet-user/setRole/family/true',
              {},
              (data) => {
                console.log('[创建家长角色成功]');
                api.refreshLoginInfo(() => {
                  that.nextStep();
                });
              },
              api.showSysError
            );
            return;
          }
        }

        // 判断是否需要进入角色选择页面
        if (that.data.chooseRole && loginInfo.roleTeacherFlag) {
          // 有教师角色，由用户选择页面跳转
          wx.navigateTo({
            url: '/pages/public/chooseRole/index',
          });
        } else {
          // 不需要进入选择页面，进入指定页面跳转
          that.setStep('goto');
          that.nextStep();
        }
      });
      return;
    }

    //【步骤】页面跳转
    if (step === 'goto') {
      console.log("【步骤】页面跳转 - wx.redirectTo", that.data.redirectToUrl)
      wx.redirectTo({
        url: that.data.redirectToUrl,
        fail: function(e) {
          console.error("【步骤】页面跳转 - wx.redirectTo失败", e)
        }
      });
      return;
    }
  },

  selectPage: function (pageId, option) {
    if (PAGE_ID_INDEX_DEFAULT === pageId) {
      pageId = DEFAULT_PAGE_ID;
      this.setData({
        chooseRole: true,
      });
    }
    if (PAGE_ID_INDEX_TEACHER === pageId) {
      this.setData({
        redirectToUrl: '/teacherPages/main/index',
        'permission.roleTeacherFlag': true,
      });
    } else if (PAGE_ID_INDEX_FAMILY === pageId) {
      this.setData({
        redirectToUrl: '/familyPages/main/index',
        'permission.roleFamilyFlag': true,
      });
    } else if (PAGE_ID_INDEX_ADD_DEVICE === pageId) {
      let andRedirectToUrl = "/familyPages/main/index";
      this.setData({
        redirectToUrl: `/familyPages/center/qrcode/index?redirectToUrl=${andRedirectToUrl}&qrcodeResultJSON=${option.qrcodeResultJSON}&qrcodeContent=${option.qrcodeContent}`,
        'permission.roleFamilyFlag': true,
      });

    } else {
      throw '不支持的页面: ' + pageId;
    }
  },

  /**
   * 页面跳转
   * @param {PAGE_ID_*} pageId
   * @param {*} option 页面传参
   */
  gotoPage: function (pageId, option) {
    // 针对不同的页面做处理
    this.setStep('ready');
    this.selectPage(pageId, option);

    // 继续下一步
    this.setStep('auth');
    this.nextStep();
  },

  /**
   * 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
   */
  onHide: function () {
    console.log('[Page][onHide]');
    this.setData({
      pageHideFlag: true,
    });
  },
  /**
   * 页面显示/切入前台/页面跳出后返回等 时触发。
   */
  onShow: function () {
    console.log('[Page][onShow]');
    wx.showLoading({
      title: '加载中',
    });

    if (this.data.pageHideFlag) {
      this.nextStep();
      this.setData({
        pageHideFlag: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('[Page][onLoad]', options);

    // 尝试获取微信扫描结果
    let wxQrCodeContent =
      typeof options.q !== 'string' ? false : decodeURIComponent(options.q);
    if (wxQrCodeContent) {
      // 【页面打开方式】: 小程序二维码
      console.log('[页面打开方式][小程序二维码] ' + wxQrCodeContent);
      // 获取二维码类型
      api.post(
        '/api/tool/globalParseQrCode',
        {
          qrcodeContent: wxQrCodeContent,
        },
        (data) => {
          console.log('[统一入口][二维码类型] ', data);
          this.handleSkipQrcode(data, wxQrCodeContent);
        },
        (errorMessage) => {
          wx.showToast({
            title: errorMessage || '未知扫码错误!',
            icon: 'none',
          });
        }
      );
    } else {
      // 【页面打开方式】: 默认首页方式进入
      console.log("【页面打开方式】: 默认首页方式进入");
      this.gotoPage(PAGE_ID_INDEX_DEFAULT);
    }
  },

  handleSkipQrcode: function (qrCodeData, wxQrCodeContent) {
    wx.showLoading({
      title: '识别中',
    });

    if (qrCodeData.indexCodeFlag && qrCodeData.qrCodeIndexResult) {
      // 首页二维码
      // 前往的小程序首页类型 1家长端 2教师端
      let target = qrCodeData.qrCodeIndexResult.target;
      if (target == 1) {
        this.gotoPage(PAGE_ID_INDEX_FAMILY);
        return;
      }
      if (target == 2) {
        this.gotoPage(PAGE_ID_INDEX_TEACHER);
        return;
      }
    }

    if (qrCodeData.schoolClassCodeFlag) {
      // 班级二维码
      // TODO 处理班级二维码流程
      return;
    }

    if (qrCodeData.subAccountAuthCodeFlag) {
      // 子账号授权二维码
      // TODO 处理子账号授权二维码流程
      return;
    }

    if (qrCodeData.skipDeviceCodeFlag) {
      // 设备二维码
      let qrcodeResultJSON = encodeURIComponent(
        JSON.stringify(qrCodeData)
      );
      let qrcodeContent = encodeURIComponent(wxQrCodeContent);
      this.gotoPage(PAGE_ID_INDEX_ADD_DEVICE, {
        qrcodeResultJSON: qrcodeResultJSON,
        qrcodeContent: qrcodeContent
      });
      return;
    }

    wx.showToast({
      title: '暂不支持的二维码!',
      icon: 'none',
    });
  },
});
