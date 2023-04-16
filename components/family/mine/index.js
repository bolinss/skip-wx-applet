// components/family/mine/index.js
import dfun from '../../../utils/dfun';
import api from '../../../utils/apiRequest';

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    user: {},
    calorieTotal: 0,
    integralTotal: 0,
  },

  lifetimes: {
    attached() {
      const user = wx.getStorageSync('userInfo');
      this.getAccountInfo();
      this.setData({
        user: user.info,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBindRope(){
      wx.navigateTo({
        url: '/familyPages/bindRope/index',
      })
    },
    go(e) {
      const type = e.currentTarget.dataset.type;
      let page = `/familyPages/center/${type}/index`;
      this.triggerEvent('goPage', { page });
    },
    /* 点击事件 */
    scanCode(event) {
      //调用扫码功能
      wx.scanCode({
        success: (res) => {
          let { result } = res;
          const app = getApp();

          app.globalData.family.qrcodeContent = result;

          dfun.getAjax(
            `api/tool/globalParseQrCode`,
            { qrcodeContent: result },
            'post',
            (res) => {
              if (res.succeeded) {
                const { data } = res;
                app.globalData.family.qrcodeResult = data;

                // 判断二维码类型，是否符合要求
                if (data.schoolClassCodeFlag || data.skipDeviceCodeFlag) {
                  // 添加班级或者绑定设备
                  let qrcodeResultJSON = encodeURIComponent(
                    JSON.stringify(data)
                  );
                  let qrcodeContent = encodeURIComponent(result);
                  wx.navigateTo({
                    url: `/familyPages/center/qrcode/index?qrcodeResultJSON=${qrcodeResultJSON}&qrcodeContent=${qrcodeContent}`,
                  });
                  return;
                }

                if (data.subAccountResult) {
                  // 子账号信息，关联主账号
                  this.relateAccount(data.subAccountResult.mainSysUserId);
                  return;
                }

                wx.showToast({
                  icon: 'error',
                  title: '不支持此二维码',
                });
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.errorMessage,
                });
              }
            }
          );
        },
        fail: (res) => {
          if (res && res.errMsg && res.errMsg.indexOf('cancel') !== -1) {
            wx.showToast({
              title: '扫码取消',
              icon: 'none',
              duration: 2000,
            });
          } else {
            wx.showToast({
              title: '二维码错误',
              icon: 'error',
              duration: 2000,
            });
          }
        },
      });
    },
    // 关联账号
    relateAccount(mainSysUserId) {
      api.post(
        `/api/family/account/authority-manage/qr/code?mainSysUserId=${mainSysUserId}`,
        {},
        (res) => {
          // 跳转到授权列表
          wx.navigateTo({
            url: `/familyPages/center/authorization/index`,
          });
        }
      );
    },
    // 获取积分信息
    getAccountInfo() {
      api.get(
        `/api/family/account/info/integral`,
        { monthFlag: false },
        (res) => {
          this.setData({
            calorieTotal: res.calorieTotal,
            integralTotal: res.integralTotal,
          });
        }
      );
    },
  },
});
