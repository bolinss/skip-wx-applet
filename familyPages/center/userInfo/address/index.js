import dfun from '../../../../utils/dfun.js';
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    list: [],
    selectedAddress: '',
    orderId: '',
  },
  onLoad(option) {
    const { orderId, id } = option;
    this.setData({
      orderId: orderId,
      selectedAddress: id,
    });
  },
  onShow() {
    this.getList();
  },
  getList() {
    dfun.getAjax(
      '/api/applet-user-consignee-address/list',
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = [] } = res;
          const { orderId } = this.data;
          if (orderId) {
            // 设置订单的选中地址, onLoad方法中已设置
            // this.setData({
            //   selectedAddress: orderId,
            // });
          } else {
            // 设置默认选中
            const selectedAddress = data.find((e) => {
              return e.defaultAddress;
            });
            if (selectedAddress) {
              this.setData({
                selectedAddress: selectedAddress.sysConsigneeAddressId,
              });
            }
          }

          this.setData({
            list: data,
          });
        }
      }
    );
  },
  selectChange(e) {
    const { orderId } = this.data;
    const id = e.detail;
    if (orderId) {
      this.setOrderAddress(orderId, id);
    } else {
      this.onDefaultAddressChange(id);
    }
  },
  setOrderAddress(orderId, id) {
    dfun.getAjax(
      `/api/mall/order/${orderId}/address/${id}`,
      {},
      'put',
      (res) => {
        if (res.succeeded) {
          wx.navigateBack({
            delta: 1,
          });
        }
      }
    );
  },
  onDefaultAddressChange(id) {
    dfun.getAjax(
      `/api/applet-user-consignee-address/default-address?consigneeAddressId=${id}`,
      {},
      'put',
      (res) => {
        if (res.succeeded) {
          wx.showToast({
            title: '设置成功',
          });
        }
      }
    );
  },
  delete(e) {
    Dialog.confirm({
      title: '提示',
      message: '确认删除',
    })
      .then(() => {
        const { id } = e.target.dataset;
        dfun.getAjax(
          `/api/applet-user-consignee-address/${id}`,
          {},
          'delete',
          (res) => {
            if (res.succeeded) {
              this.getList();
              wx.showToast({
                title: '删除成功',
              });
            }
          }
        );
      })
      .catch();
  },
  goDetail(e) {
    const { pos } = e.target.dataset;
    let url = `/familyPages/center/userInfo/address/detail/index`;
    if (pos !== undefined) {
      url += `?action=${JSON.stringify(this.data.list[pos])}`;
    }
    wx.navigateTo({
      url,
    });
  },
});
