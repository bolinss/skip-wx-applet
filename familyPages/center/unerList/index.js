import dfun from '../../../utils/dfun';
Page({
  data: {
    unerList: [],
    selected: '',
    qrcodeContent: '',
  },
  onLoad(option) {
    const app = getApp();
    const qrcodeContent = app.globalData.family.qrcodeContent;
    if (qrcodeContent) {
      this.setData({
        qrcodeContent,
      });
    }
  },
  onShow: function () {
    this.getUnerList();
  },
  goDetail(e) {
    const { key } = e.currentTarget.dataset;
    let url = `/familyPages/center/unerList/detail/index`;
    if (key) {
      url += `?sysUnerId=${key}`;
    }
    wx.navigateTo({
      url,
    });
  },
  onSelectChange(e) {
    this.setData({
      selected: e.detail,
    });
  },
  getUnerList() {
    dfun.getAjax('api/family/uner/optionList', {}, 'get', (res) => {
      if (res.succeeded) {
        const data = res.data || [];
        if (data.length > 0) {
          const item = data[0];
          this.setData({
            unerList: res.data,
            activeUner: item.sysUnerId,
          });
        }
      }
    });
  },
  submit() {
    const { selected, unerList } = this.data;
    const uner = unerList.find((e) => {
      return e.sysUnerId === selected;
    });
    if (!uner) {
      wx.showToast({
        title: '选择关联的Uner',
      });
      return;
    }
    wx.redirectTo({
      url: `/familyPages/center/addDevice/index?sysUnerId=${selected}&name=${uner.name}`,
    });
  },
  cancel() {
    wx.navigateBack({
      delta: 1,
    });
  },
});
