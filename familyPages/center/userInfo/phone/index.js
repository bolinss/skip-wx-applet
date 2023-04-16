import api from '../../../../utils/apiRequest';
Page({
  data: {
    isSend: false,
    smsCode: '',
    phone: '',
    codeId: '',
  },
  onShow: function () {},
  go(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/familyPages/center/${type}/index`,
    });
  },
  getCode() {
    const { phone } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
      });
      return;
    }
    api.get(`api/tool/sendSmsCode?phone=${phone}`, {}, (res) => {
      this.setData({
        isSend: true,
        codeId: res,
      });
    });
  },
  submit() {
    const { codeId, phone, smsCode } = this.data;

    if (!phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
      });
      return;
    }
    if (!smsCode) {
      wx.showToast({
        title: '请填写短信验证码',
        icon: 'none',
      });
      return;
    }
    if (!codeId) {
      wx.showToast({
        title: '请获取短信验证码',
        icon: 'none',
      });
      return;
    }
    const data = {
      codeId,
      phone,
      smsCode,
    };
    api.put(`api/family/account/authority-manage/phone`, { ...data }, (res) => {
      wx.showToast({
        title: '操作成功',
      });
      wx.navigateBack({
        delta: 1,
      });
    });
  },
});
