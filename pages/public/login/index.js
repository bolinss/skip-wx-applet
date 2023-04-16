
import api from '../../../utils/apiRequest'

// pages/public/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false
  },

  onChange(e){
    this.setData({
      checked: e.detail
    })
  },
  onTextClick() {
    this.setData({
      checked: !this.data.checked
    })
  },

  onLogin() {
    // 判断是否同意协议
    if (!this.data.checked) {
      wx.showToast({
        title: '请阅读并同意协议',
        icon: 'none'
      });
      return;
    }

    // 获取微信授权信息
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("[用户点击授权获取信息]", res);
        wx.showLoading({
          title: '登录中'
        });

        let userInfo = res.userInfo;

        // 请求后台接口，同步用户信息
        api.post("/api/applet-user/setUserInfo", {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          language: userInfo.language,
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city
        }, data => {
          // 同步用户信息成功
          console.log("[同步用户信息成功]", data);
          api.refreshLoginInfo(() =>{
            wx.navigateBack();
          });

        }, errorMessage => {
          console.error("[登录注册][出错]", errorMessage);
          wx.showToast({
            title: '请求出错，请稍后再试!',
            icon: "none"
          })
        });

      },
      fail: () => {
      }
    })

  },

  goReadAgreement() {
    wx.navigateTo({
      url: '/pages/public/userAgreement/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})