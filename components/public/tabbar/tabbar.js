// components/public/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      //是否单选
      type: Number,
      value: 0,
    },
    edition: {
      //0家长端1教师端
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbarData: [],
    parentData: [
      {
        name: '首页',
        icon: '../../../static/public/images/tabbar1.png',
        select_icon: '../../../static/public/images/tabbar1_s.png',
        page: 'home',
      },
      {
        name: '商城',
        icon: '../../../static/public/images/tabbar2.png',
        select_icon: '../../../static/public/images/tabbar2_s.png',
        page: 'mall',
      },
      {
        name: '',
        icon: '../../../static/public/images/tabbar_add.png',
      },
      {
        name: '训练',
        icon: '../../../static/public/images/tabbar3.png',
        select_icon: '../../../static/public/images/tabbar3_s.png',
        page: 'train',
      },
      {
        name: '我的',
        icon: '../../../static/public/images/tabbar4.png',
        select_icon: '../../../static/public/images/tabbar4_s.png',
        page: 'mine',
        backgroundColor: '#4F90FF',
        frontColor: '#ffffff',
      },
    ],
    teacherData: [
      {
        name: '首页',
        icon: '../../../static/public/images/tabbar1.png',
        select_icon: '../../../static/public/images/tabbar1_s.png',
        page: 'home',
      },
      {
        name: '工具',
        icon: '../../../static/public/images/tabbar5.png',
        select_icon: '../../../static/public/images/tabbar5_s.png',
        page: 'tools',
      },
      {
        name: '我的',
        icon: '../../../static/public/images/tabbar4.png',
        select_icon: '../../../static/public/images/tabbar4_s.png',
        page: 'mine',
        backgroundColor: '#468aff',
        frontColor: '#ffffff',
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabChange(opt) {
      this.setData({
        active: opt.detail,
      });
    },
    goPage(opt) {
      let { page, name, backgroundColor, frontColor } =
        opt.currentTarget.dataset.opt;
      console.log(name)
      if(!name){
        this.scanCode();
      }else{
        this.triggerEvent('showPage', {
          page,
          name,
          backgroundColor,
          frontColor,
        });
      }
      
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
            icon: 'none',
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
  },
  ready() {
    this.tabbarData =
      this.data.edition == 0 ? this.data.parentData : this.data.teacherData;
    this.setData({
      tabbarData: this.tabbarData,
    });
  },
 
});
