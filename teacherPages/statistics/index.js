import dfun from '../../utils/dfun';
import api from '../../utils/apiRequest';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskName: '', //任务名称
    competitionType: '', //任务类型
    competitionTypeLabel:'',//任务类型中文
    columns: ['跳绳次数', '跳绳时间'],
    classList: [],
    classOriginList: [],
    choiceClass: '',
    choiceClassLabel:'',//选择班级中文
    choiceClassId: '',
    otherPageData: [],
    taskTargetNum: '', //任务目标
    targetText: '任务目标',
    isDraft:false,//是否为草稿
    bindDeviceData:[],//已绑定设备的成员
    tempDeviceMap:{},//绑定临时设备Map
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取班级列表
    this.getClassList()
  },
  
  saveInfo(e) { //保存草稿
   
  },
  choiceClassFunc(e){//选择班级
    let opt = dfun.getData(e);
    this.data.choiceClass = opt;
    this.setData({
      choiceClass:this.data.choiceClass
    })
  },
  getClassList() { //获取班级列表
    dfun.getAjax('api/teacher/info/schoolClass/optionList', {}, 'get', res => {
      if (res.data && res.data.length != 0) {
        this.data.classOriginList = res.data;
        this.data.choiceClass = this.data.classOriginList[0];
        this.setData({
          classOriginList:this.data.classOriginList,
          choiceClass:this.data.choiceClass
        })
      }
    })
  },
  getClassData(e) { //获取选择的班级
    let index = e.detail.index;
    this.data.choiceClassId = this.data.classOriginList[index].sysSchoolClassInfoId;
  },

  getSelectData(e) { //获取任务类型
    let index = e.detail.index;
    if(index == 0){
      this.data.competitionType = 'COUNT';
      this.data.targetText = '请输入跳绳次数';
    }else{
      this.data.competitionType = 'TIME';
      this.data.targetText = '请输入跳绳时间（秒）'
    }
    this.setData({
      targetText: this.data.targetText
    })
  },

  goChoosePeople() {
    if (this.data.choiceClass) {
      wx.navigateTo({
        url: '/teacherPages/choosePeople/index?classId=' + this.data.choiceClass.sysSchoolClassInfoId,
      });
    } else {
      dfun.toast('请先选择班级');
    }

  },
  //跳转临时设备
  goTemp() {
    if(!this.data.otherPageData || this.data.otherPageData.length == 0){
      dfun.toast('请选择组员');
      return false;
    }
    wx.setStorageSync('choicedStudentsData', this.data.otherPageData);
    wx.navigateTo({
      url: '/teacherPages/tempEquipment/index',
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
    this.data.tempDeviceMap = {};
    this.data.bindDeviceData.forEach(e=>{
      this.data.tempDeviceMap[e.sysUnerId] = e.bindDevice
    })
    this.setData({
      bindDeviceData:this.data.bindDeviceData
    })
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