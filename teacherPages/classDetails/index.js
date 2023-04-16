import dfun from '../../utils/dfun';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    schoolClassName: '',
    studentsData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sysSchoolClassInfoId = options.sysSchoolClassInfoId;
    this.sysSchoolInfoId = options.sysSchoolInfoId;
    this.setData({
      schoolClassName: options.schoolClassName,
    });
  },

  deleteStudents(e) {
    console.log(e);
    let opt = dfun.getData(e);
    dfun.confirm('确定要删除' + opt.name + '吗？', () => {
      dfun.getAjax(
        'api/teacher/class/student/' +
          opt.sysUnerId +
          '/' +
          opt.sysSchoolClassInfoId,
        {},
        'delete',
        (res) => {
          if (res.succeeded) {
            dfun.success('删除成功');
            this.initData();
          } else {
            dfun.toast(res.errorMessage);
          }
        }
      );
    });
  },

  initData() {
    dfun.getAjax(
      'api/teacher/class/student/list',
      {
        sysSchoolClassInfoId: this.sysSchoolClassInfoId,
      },
      'get',
      (res) => {
        this.data.studentsData = res.data;
        this.setData({
          studentsData: this.data.studentsData,
        });
      }
    );
  },

  addStudents() {
    wx.navigateTo({
      url:
        '/teacherPages/addStudents/index?sysSchoolInfoId=' +
        this.sysSchoolInfoId +
        '&sysSchoolClassInfoId=' +
        this.sysSchoolClassInfoId,
    });
  },

  deleteClass() {
    dfun.confirm('确定要删除该班级吗？', () => {
      dfun.getAjax(
        'api/teacher/school/class/school/class/' + this.sysSchoolClassInfoId,
        {},
        'delete',
        (res) => {
          if (res.succeeded) {
            dfun.back();
          } else {
            dfun.toast(res.errorMessage);
          }
        }
      );
    });
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
