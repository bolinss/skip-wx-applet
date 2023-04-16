import dfun from '../../utils/dfun.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    dfun.getAjax('api/teacher/device/list', {}, 'get', res => {
      this.data.deviceData = res.data;
      this.setData({
        deviceData: this.data.deviceData
      })
    })
  },
  scanCode() {
    
    const _this = this;
    wx.scanCode({
      success(res) {
        if (res) {
          wx.showLoading({
            title: '加载中...',
          })
          let code = res.result;
          dfun.getAjax('api/teacher/device/parseDeviceCode', {
            qrcodeContent: code
          }, 'post', res => {
            wx.hideLoading()
            if (res.succeeded) {
              dfun.success('添加设备成功');
              _this.onLoad();
            } else {
              dfun.toast(res.errorMessage);
            }
          })
        }
      },
      fail(err){
        dfun.toast('无效的二维码');
      }
    })
  },

  deleteDevice(e) { //删除设备
    let data = dfun.getData(e);
    dfun.confirm('确定要删除该设备吗？', () => {
      dfun.getAjax('api/teacher/device/?sysSkipDeviceRefTeacherId=' + data, {}, 'delete', res => {
        if (res.succeeded) {
          dfun.success('删除设备成功');
          this.onLoad();
        } else {
          dfun.toast(res.errorMessage);
        }
      })
    })
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