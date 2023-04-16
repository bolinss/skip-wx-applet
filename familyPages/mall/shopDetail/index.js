import api from '../.././../utils/apiRequest';
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
  getDetail() {
    const { id } = this.data;
    api.get(`api/mall/product/${id}`, {}, (res) => {
      res.productIntroduction = res.productIntroduction.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto" '
      );
      this.setData({
        detail: res,
      });
    });
  },
  // 兑换
  submit() {
    const { id, detail } = this.data;
    const data = {
      // 支付方式
      payType: 1,
      // 商品id
      sysMallProductId: id,
      // 使用积分
      useIntegration: detail.integralPrice,
    };
    api.post(`api/mall/order/generate`, { ...data }, (res) => {
      const id = res.sysMallOrderId;
      wx.navigateTo({
        url: `/familyPages/mall/shopDetail/confirmOrder/index?id=${id}`,
      });
    });
  },
});
