// teacherPages/myInfo/index.js
import dfun from '../../utils/dfun';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myinfo: {},
  },

  goClassManage() {
    wx.navigateTo({
      url: '/teacherPages/classManage/index',
    });
  },

  goChangePhone() {
    wx.navigateTo({
      url: '/teacherPages/changePhone/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // dfun.getAjax('api/teacher/info/schoolClass/optionList',{},'get',res=>{
    //   console.log(res)
    // })
    dfun.getAjax('api/teacher/info', {}, 'get', (res) => {
      let userInfo = wx.getStorageSync('userInfo');
      this.data.myinfo = res.data;
      this.data.myinfo.userAvatarUrl = userInfo.info.userAvatarUrl;
      this.data.myinfo.userNickName = userInfo.info.userNickName;
      this.setData({
        myinfo: this.data.myinfo,
      });
    });
  },

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
