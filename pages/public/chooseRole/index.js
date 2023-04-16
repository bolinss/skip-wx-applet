// pages/public/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onGotoFamilyPage: function() {
    this.gotoPage(2);
  },

  onGotoTeacherPage: function() {
    this.gotoPage(1);
  },

  gotoPage: function(pageId, option) {
    // 设置start页面的跳转地址
    this.selectPage(pageId, option);
    this.getStartPage().setStep('goto');
    
    // 返回到start页面，让其进行跳转
    wx.navigateBack();
  },

  getStartPage: function() {
    let currentPages = getCurrentPages();
    return currentPages[currentPages.length - 2];
  },

  selectPage: function(pageId, option) {
    this.getStartPage().selectPage(pageId, option);
  },

})