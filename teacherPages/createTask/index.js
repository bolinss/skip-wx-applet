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
    console.log(options)
    //获取班级列表
    this.getClassList(function(){
      if(options.sysSkipTeacherTaskId){//获取草稿详情
        dfun.getAjax('api/teacher/task/historyTask',{
          sysSkipTeacherTaskId:options.sysSkipTeacherTaskId
        },'get',res=>{
          let data = res.data;
          this.data.taskName = data.taskName;
          this.data.competitionType = data.competitionType;
          this.data.competitionTypeLabel = this.data.competitionType=='COUNT'?'跳绳次数':'跳绳时间';
          this.data.taskTargetNum = data.competitionValueNum?data.competitionValueNum:data.competitionValueSecond;
          this.data.choiceClassId = data.sysSchoolClassInfoId;
          this.data.classOriginList.forEach(e=>{
            if(e.sysSchoolClassInfoId == this.data.choiceClassId){
              this.data.choiceClassLabel = e.schoolClassName;
            }
          })
          this.data.otherPageData = data.memberListInfo.tempDeviceUNerList;
          this.data.tempDeviceMap = data.tempDeviceMap;
          this.setData({
            taskName:this.data.taskName,
            competitionTypeLabel:this.data.competitionTypeLabel,
            taskTargetNum:this.data.taskTargetNum,
            choiceClassLabel:this.data.choiceClassLabel,
            otherPageData:this.data.otherPageData,
            bindDeviceData:this.data.otherPageData,
          })
          console.log(res)
        })
      }
    }.bind(this));
    
  },
  
  saveInfo(e) { //保存草稿
    this.data.isDraft = dfun.getData(e);
    if(!this.data.taskName){
      dfun.toast('请输入任务名称');
      return false;
    }
    if(!this.data.competitionType){
      dfun.toast('请选择任务类型');
      return false;
    }
    if(!this.data.taskTargetNum){
      dfun.toast('请输入任务目标');
      return false;
    }
    if(!this.data.choiceClassId){
      dfun.toast('请选择班级');
      return false;
    }
    if(!this.data.otherPageData){
      dfun.toast('请选择组员');
      return false;
    }
    let memberUnerIdList = [];
    this.data.otherPageData.forEach(e=>{
      memberUnerIdList.push(e.sysUnerId);
    })
    let params = {
      competitionType:this.data.competitionType,
      draftFlag:this.data.isDraft,
      memberUnerIdList:memberUnerIdList,
      sysSchoolClassInfoId:this.data.choiceClassId,
      taskName:this.data.taskName,
      tempDeviceMap:this.data.tempDeviceMap
    }

    if(this.data.competitionType == 'COUNT'){
      params.competitionValueNum = this.data.taskTargetNum;
    }else if(this.data.competitionType == 'TIME'){
      params.competitionValueSecond = this.data.taskTargetNum;
    }
    api.post('api/teacher/task/addTask',params,res=>{
      dfun.success('操作成功');
    })
  },
  getClassList(func) { //获取班级列表
    dfun.getAjax('api/teacher/info/schoolClass/optionList', {}, 'get', res => {
      if (res.data) {
        this.data.classOriginList = res.data;
        this.data.classOriginList.forEach(e => {
          this.data.classList.push(e.schoolClassName);
        })
        this.setData({
          classList: this.data.classList
        })
        if(func){
          func();
        }
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
    if (this.data.choiceClassId) {
      wx.navigateTo({
        url: '/teacherPages/choosePeople/index?classId=' + this.data.choiceClassId,
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