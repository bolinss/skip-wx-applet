import api from '../../../utils/apiRequest';
Page({
  data: {
    page: {
      pageNum: 1,
      pageSize: 20,
      total: 0,
    },
    list: [],
  },
  onShow() {
    this.data.list = [];
    const page = this.data.page;
    page.pageNum = 1;
    page.total = 0;
    this.getList();
  },
  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/familyPages/mall/shopDetail/orderDetail/index?id=${id}`,
    });
  },
  getList() {
    const { page } = this.data;
    const data = {
      current: page.pageNum,
      size: page.pageSize,
    };
    api.get(`api/mall/order/list`, { ...data }, (res) => {
      const { records = [], total } = res;
      records.forEach((e) => {
        let text = '';
        switch (e.status) {
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
        e.statusLabel = text;
      });

      const list = this.data.list.concat(records);
      this.setData({
        list,
        ['page.total']: total,
      });
    });
  },
  // 翻页
  more() {
    this.data.page.pageNum++;
    this.getList();
  },
});
