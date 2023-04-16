import api from '../../../../utils/apiRequest';
Page({
  onShow() {
    this.getDetail();
  },
  onLoad(option) {
    const { id } = option;
    this.data.id = id;
  },
  data: {
    id: '',
    detail: {},
  },
  goAddress() {
    wx.navigateTo({
      url: `/familyPages/center/userInfo/address/index?orderId=${this.data.id}&id=${this.data.detail.addressId}`,
    });
  },
  getDetail() {
    const { id } = this.data;
    api.get(`api/mall/order/detail/${id}`, {}, (res) => {
      let text = '';
      switch (res.status) {
        case 'WAIT_PAY':
          text = '待付款';
          break;
        case 'WAIT_DELIVERY':
          text = '待发货';
          break;
        case 'HAS_DELIVERY':
          text = '已发货';
          break;
        case 'COMPLETE':
          text = '已完成';
          break;
        case 'CLOSE':
          text = '已关闭';
          break;
      }
      res.statusLabel = text;
      this.setData({
        detail: res,
      });
    });
  },
  cancel() {
    const { id } = this.data;
    api.put(`api/mall/order/cancel?orderId=${id}`, {}, (res) => {
      wx.navigateBack({
        delta: 1,
      });
    });
  },
  pay() {
    const { id } = this.data;
    api.post(`/api/wxpay/order/${id}`, {}, (res) => {
      const { signType, timeStamp, packageValue, nonceStr, paySign } = res;
      wx.requestPayment({
        timeStamp,
        nonceStr,
        package: packageValue,
        signType,
        paySign,
        success(res) {
          wx.redirectTo({
            url: '/familyPages/center/order/index',
          });
        },
        fail(res) {
          wx.showToast({
            icon: 'error',
            title: res,
          });
        },
      });
    });
  },
});
