import dfun from "../../utils/dfun";

// teacherPages/choosePeople/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allChecked: false,
    sysSchoolClassInfoId: '',
    memberUNerList: [],
    choicedStudens: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classId = options.classId;
    //获取学生列表
    this.initStudentsList();
  },

  submitStudents(){//返回提交选中的学生数据
    this.data.choicedStudens = [];
    this.data.memberUNerList.forEach(e=>{
      if(e.checked){
        this.data.choicedStudens.push(e);
      }
    })
    if( this.data.choicedStudens.length == 0){
      dfun.toast('请至少选择一个学生');
      return false;
    }
    dfun.back(this.data.choicedStudens)
  },

  changeChecked(e) { //修改学生选中状态
    let index = dfun.getData(e);
    this.data.memberUNerList[index].checked = !this.data.memberUNerList[index].checked;
    this.setData({
      memberUNerList:this.data.memberUNerList
    })
  },
  initStudentsList() {
    dfun.getAjax('api/teacher/class/student/list?sysSchoolClassInfoId=' + this.classId, {}, 'get', res => {
      if (res.data) {
        this.data.memberUNerList = res.data;
        this.data.memberUNerList.forEach(e=>{
          e.checked = false;
        })
        this.setData({
          memberUNerList: this.data.memberUNerList
        })
      }
    })
  },
  onCheckedChange(e) {//全选
    this.data.allChecked = e.detail;
    this.data.memberUNerList.forEach(e=>{
      e.checked = this.data.allChecked;
    })
    this.setData({
      allChecked: this.data.allChecked,
      memberUNerList:this.data.memberUNerList
    })

  },

  goBack() {
    wx.navigateBack({
      delta: -1,
    });
  },

  onSearch(e) {
    console.log(e);
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