// familyPages/chooseUNer/index.js

import api from '../../../../utils/apiRequest';

Page({
  data: {
    unerListEmptyFlag: false,
    unerList: [],
    selectedSysUNerId: '',
    sourcePage: {
      selectedSysUNerIdKey: '',
      selectedSysUNerKey: '',
    },
  },
  onLoad: function (options) {
    // 获取默认选择的UNerID
    let defaultSelectedSysUNerId = options.selectedSysUNerId || '';
    // 保存参数数据
    this.setData({
      selectedSysUNerId: defaultSelectedSysUNerId,
      'sourcePage.selectedSysUNerIdKey': options.selectedSysUNerIdKey,
      'sourcePage.selectedSysUNerKey': options.selectedSysUNerKey,
    });
  },
  onShow: function () {
    // 刷新UNer列表
    this.loadUNerList();
  },

  loadUNerList: function () {
    api.get('api/family/uner/optionList', {}, (data) => {
      //data = [];
      let defaultSelectedSysUNerId = this.data.selectedSysUNerId;
      let unerListEmptyFlag = !(data && data.length > 0);
      if (!unerListEmptyFlag) {
        if (!defaultSelectedSysUNerId) {
          defaultSelectedSysUNerId = data[0].sysUnerId;
        }
      }
      this.setData({
        unerListEmptyFlag: unerListEmptyFlag,
        unerList: data,
        selectedSysUNerId: defaultSelectedSysUNerId,
      });
    });
  },
  onSelectedSysUNerId: function (e) {
    let sysUNerId = e.currentTarget.dataset.sysunerid;
    this.setData({
      selectedSysUNerId: sysUNerId,
    });
  },

  /**
   * 跳转到 UNer添加 页面
   */
  gotoAddUNerPage: function () {
    wx.navigateTo({
      url: '/familyPages/center/unerList/detail/index?type=add',
    });
  },

  /**
   * 确认选择UNer
   */
  doSubmit: function () {
    // 当前选择的UNerId
    let selectedSysUNerId = this.data.selectedSysUNerId;
    // 返回页面接收data的key
    let selectedSysUNerIdKey = this.data.sourcePage.selectedSysUNerIdKey;
    let selectedSysUNerKey = this.data.sourcePage.selectedSysUNerKey;

    // 向上一个页面，返回参数
    let currentPages = getCurrentPages();
    let sourcePage = currentPages[currentPages.length - 2];
    let returnData = {};
    // 为返回页面更新 选择的SysUNerId
    if (selectedSysUNerIdKey) {
      returnData[selectedSysUNerIdKey] = selectedSysUNerId;
    }
    // 为返回页面更新 选择的SysUNer对象
    if (selectedSysUNerKey) {
      let selectedSysUNer = {};
      this.data.unerList.map((value) => {
        if (value.sysUnerId === this.data.selectedSysUNerId) {
          selectedSysUNer = value;
        }
      });
      returnData[selectedSysUNerKey] = selectedSysUNer;
    }
    sourcePage.setData(returnData);

    // 返回上一个页面
    wx.navigateBack();
  },
});
