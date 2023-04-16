import dfun from '../../utils/dfun.js'
import config from '../../config/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: 0,
    pageNum: 1,
    pageCount:0,
    listData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isDraft = this.data.tabbar == 0 ? false : true;
    this.initData(isDraft);
  },

  initData(draft) {
    dfun.getAjax('api/teacher/task/historyTaskList/' + draft, {
      pageNum: this.data.pageNum,
      pageSize: config.onePageNum
    }, 'get', res => {
      if (res.data) {
        this.data.listData = res.data.list;
        this.data.pageCount = res.data.total;
        this.setData({
          listData: this.data.listData
        })
      }
    })
  },
  changeTabbar(opt) {
    this.data.tabbar = dfun.getData(opt);
    this.setData({
      tabbar: this.data.tabbar
    })
    this.data.pageNum = 1;
    this.data.listData = [];
		this.data.pageCount = 0;
    let isDraft = this.data.tabbar == 0 ? false : true;
    this.initData(isDraft);

  },

  deleteDraft(e){//删除草稿任务
    let opt = dfun.getData(e);
    dfun.confirm('确定要删除该任务吗？',()=>{
      dfun.getAjax('api/teacher/task/draftTask?draftId='+opt.sysSkipTeacherTaskId,{
      },'delete',res=>{
        if(res.succeeded){
          dfun.success('删除草稿成功');
          this.data.pageNum = 1;
          this.data.listData = [];
          this.data.pageCount = 0;
          let isDraft = this.data.tabbar == 0 ? false : true;
          this.initData(isDraft);
        }else{
          dfun.toast(res.errorMessage);
        }
      })
    })
  },
  goEdit(e){//编辑草稿
    let opt = dfun.getData(e);
    wx.navigateTo({
      url: '/teacherPages/createTask/index?sysSkipTeacherTaskId='+opt.sysSkipTeacherTaskId,
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
    const _this = this;
	  if (this.data.pageNum * config.onePageNum < _this.data.pageCount){
		  this.data.pageNum++;
		  wx.showLoading({
			  title: '加载中...',
		  })
		  this.initData();
	  }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})