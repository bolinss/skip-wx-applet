import dfun from '../../utils/dfun';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    studentsData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.studentsData = wx.getStorageSync('choicedStudentsData');
    this.data.studentsData.forEach(e=>{
      e.bindDevice = '';
    })
    this.setData({
      studentsData:this.data.studentsData
    })
    
  },

  changeBind(e){//修改绑定状态
    console.log(e)
    let data = dfun.getData(e);
    let index = e.currentTarget.dataset.index;
    if(data.bindDevice){
      dfun.confirm('确定要解除绑定吗？',()=>{
        this.data.studentsData[index].bindDevice = '';
        this.setData({
          studentsData:this.data.studentsData
        })
        dfun.success('解除绑定成功');
      })
    }else{
      wx.scanCode({
        success: (res) => {
          wx.showLoading({
            title: '加载中...',
          })
          //解析二维码
          dfun.getAjax('api/teacher/task/parseDeviceCode',{
            qrcodeContent:res.result
          },'post',res2=>{
            wx.hideLoading();
            if(res2.succeeded){
              dfun.success('绑定成功');
              this.data.studentsData[index].bindDevice = res2.data.sysSkipDeviceId;
              this.setData({
                studentsData:this.data.studentsData
              })
            }else{
              dfun.toast(res2.errorMessage);
            }
          })
          
        },
        fail:()=>{
          dfun.toast('扫描二维码失败');
        }
      })
    }
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
  onUnload: function () {
    let bindDeviceData = [];
    this.data.studentsData.forEach(e=>{
      if(e.bindDevice){
        bindDeviceData.push(e);
      }
    })
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    prePage.setData({
      bindDeviceData: bindDeviceData
    })
  },

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
