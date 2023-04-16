import dfun from '../../utils/dfun'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentsName: '',
    studentsCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sysSchoolClassInfoId = options.sysSchoolClassInfoId
    this.sysSchoolInfoId = options.sysSchoolInfoId
  },

  goClassCode() { //跳转班级二维码页面
    wx.navigateTo({
      url: '/teacherPages/classCode/index?classId=' + this.sysSchoolClassInfoId,
    })
  },

  addStudents() {
    if (!this.data.studentsName) {
      dfun.toast('请输入学生姓名');
      return false;
    }

    if (!this.data.studentsCode) {
      dfun.toast('请输入学生证件号');
      return false;
    }

    dfun.getAjax('api/teacher/class/student', {
      name: this.data.studentsName,
      idCard: this.data.studentsCode,
      classId: this.sysSchoolClassInfoId,
      sysSchoolClassInfoId: this.sysSchoolInfoId
    }, 'post', res => {
      if (res.succeeded) {
        dfun.back();
      } else {
        dfun.toast(res.errorMessage);
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