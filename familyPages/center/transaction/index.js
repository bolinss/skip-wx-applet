import api from '../../../utils/apiRequest';
Page({
  data: {
    activeTab: 'all',
    calorieTotal: 0,
    integralTotal: 0,
    timeRevenueCalore: 0,
    timeExpenseCalore: 0,
    timeExpenseIntegral: 0,
    timeRevenueIntegral: 0,
    list: [],
    page: {
      pageSize: 20,
      pageNum: 1,
      total: 0,
    },
  },
  onShow: function () {
    this.data.list = [];
    const page = this.data.page;
    page.pageNum = 1;
    page.total = 0;
    this.getAccountInfo();
    this.getIntegralList();
  },
  tabChange(e) {
    const { id } = e.currentTarget.dataset;
    this.data.page.pageNum = 1;
    this.data.list = [];
    if (id === 'ca') {
      this.getCalorieList();
    } else {
      this.getIntegralList();
    }
    this.setData({
      activeTab: id,
    });
  },
  goExchange() {
    wx.navigateTo({
      url: `/familyPages/center/transaction/exchange/index`,
    });
  },
  // 获取积分信息
  getAccountInfo() {
    api.get(`/api/family/account/info/integral`, { monthFlag: true }, (res) => {
      const {
        calorieTotal,
        integralTotal,
        timeRevenueCalore,
        timeExpenseCalore,
        timeExpenseIntegral,
        timeRevenueIntegral,
      } = res;
      this.setData({
        calorieTotal,
        integralTotal,
        timeRevenueCalore,
        timeExpenseCalore,
        timeExpenseIntegral,
        timeRevenueIntegral,
      });
    });
  },
  // 获取积分交易记录
  getIntegralList() {
    const { page } = this.data;
    const data = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    };
    api.get(`/api/family/account/info/integral/list`, { ...data }, (res) => {
      const list = this.data.list.concat(res.list);
      this.setData({
        list,
        ['page.total']: res.total,
      });
    });
  },
  // 获取卡路里交易记录
  getCalorieList() {
    const { page } = this.data;
    const data = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    };
    api.get(`/api/family/account/info/calorie/list`, { ...data }, (res) => {
      const list = this.data.list.concat(res.list);
      this.setData({
        list,
        ['page.total']: res.total,
      });
    });
  },
  // 翻页
  more() {
    this.data.page.pageNum++;
    if (this.data.activeTab === 'ca') {
      this.getCalorieList();
    } else {
      this.getIntegralList();
    }
  },
});
