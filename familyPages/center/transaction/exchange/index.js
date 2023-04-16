import api from '../../../../utils/apiRequest';
Page({
  data: {
    activeTab: '',
    surplusCalorie: 0,
    list: [],
  },
  onShow() {
    this.getList();
    this.getAccountInfo();
  },
  tabChange(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      activeTab: id,
    });
  },
  getList() {
    api.get(`/api/family/account/info/integralExchangeList`, {}, (res) => {
      const list = res;
      if (list.length > 0) {
        this.setData({
          list,
          activeTab: list[0].exchangeSysId,
        });
      }
    });
  },
  submit() {
    const { activeTab } = this.data;
    api.get(
      `/api/family/account/info/integralExchange`,
      { exchangeSysId: activeTab },
      (res) => {
        wx.navigateBack({
          delta: 1,
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
        const { surplusCalorie } = res;
        this.setData({
          surplusCalorie,
        });
      }
    );
  },
});
