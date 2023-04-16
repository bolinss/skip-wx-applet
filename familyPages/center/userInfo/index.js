import api from '../../../utils/apiRequest';
Page({
  data: {
    user: {},
    code: '',
  },
  onShow: function () {
    const user = wx.getStorageSync('userInfo');
    this.getCode();
    this.setData({
      user: user.info,
    });
  },
  go(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/familyPages/center/userInfo/${type}/index`,
    });
  },
  getCode() {
    api.get(
      '/api/family/account/authority-manage/invitation/code',
      {},
      (res) => {
        this.setData({
          code: res,
        });
      }
    );
  },
});
