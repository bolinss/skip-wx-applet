// teacherPages/main/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPage: 'home',
  },

  showPage(e) {
    let { page, name, frontColor, backgroundColor } = e.detail;
    this.setData({
      showPage: page,
    });
    wx.setNavigationBarTitle({
      title: name,
    });
    let fontColor = frontColor ? frontColor : '#000000';
    let bgColor = backgroundColor ? backgroundColor : '#fff';

    wx.setNavigationBarColor({
      frontColor: fontColor,
      backgroundColor: bgColor,
    });
  },

  goPage(e) {
    wx.navigateTo({
      url: e.detail.page,
    });
  },

  goTearcher() {
    wx.navigateTo({
      url: '/pages/public/teacherIndex/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
