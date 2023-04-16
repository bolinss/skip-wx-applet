const {
  default: dfun
} = require("../../utils/dfun");
import api from '../../utils/apiRequest';

// teacherPages/classCode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: '', //班级ID
    codeSrc: '', //二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.classId = options.classId;
    //获取二维码code内容
    dfun.getAjax('api/teacher/school/class/qr/code/' + this.data.classId, {}, 'get', res => {
      if (res.data) {
        //获取二维码
        this.data.codeSrc = api.getAuthUrl(`api/tool/qrCode?content=${res.data}`);
        console.log(this.data.codeSrc)
        this.setData({
          codeSrc: this.data.codeSrc
        })
      }
    })
  },

  saveImg() {
    wx.getImageInfo({
      src: this.data.codeSrc,
      success:function(img){
        let path = img.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            dfun.success('保存图片成功,请在手机相册中查看');
          },
          fail: function (res) {
            console.log(res)
            dfun.toast('保存图片失败')
          }
        })
      }
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