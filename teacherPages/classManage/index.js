import dfun from '../../utils/dfun';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    classData: [],
    searchParams: {
      schoolClassName: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  initData() {
    dfun.getAjax(
      'api/teacher/info/schoolClass/optionList',
      this.data.searchParams,
      'get',
      (res) => {
        this.data.classData = res.data;
        this.setData({
          classData: this.data.classData,
        });
      }
    );
  },

  addClass() {
    wx.navigateTo({
      url: '/teacherPages/addClass/index',
    });
  },

  goClassDetails(e) {
    let opt = dfun.getData(e);
    console.log(opt);
    wx.navigateTo({
      url:
        '/teacherPages/classDetails/index?schoolClassName=' +
        opt.schoolClassName +
        '&sysSchoolClassInfoId=' +
        opt.sysSchoolClassInfoId,
    });
  },

  onSearch(e) {
    this.data.searchParams.schoolClassName = e.detail;
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  },

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
