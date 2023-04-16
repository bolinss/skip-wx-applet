import dfun from '../../utils/dfun'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusIndex: 0, // 光标所在位置
    value: '', // 实际输入的值
    focus: true, // 是否获得焦点
    password: '', //替换显示的值*
    unerData:[],
    columns:[],
    unerId:''
  },

  getSelectData(e){
    let index = e.detail.index;
    this.data.unerId = this.data.unerData[index].sysUnerId;
  },

  setValue(e) {
    // 设置光标
    this.data.value = e.detail.value;
    this.setData({
      value: this.data.value,
      focusIndex: this.data.value.length,
      focus: this.data.value.length < 6,
      password: this.data.value
    })
  },
  inputBlur(e) {
    // if (e.detail.value.length === 6) {
    //   this.triggerEvent('complated', {
    //     value: e.detail.value
    //   })
    // }
  },

  submitCode() {
    if(!this.data.unerId){
      dfun.toast('请先选择一个uner');
      return false;
    }
    if(!this.data.value || this.data.value.length != 6){
      dfun.toast('请输入正确的验证码');
      return false;
    }
    dfun.getAjax('/api/family/device/bind',{
      code:this.data.value,
      sysUnerId:this.data.unerId
    },'post',res=>{
      if(res.succeeded){
        dfun.success('绑定成功');
        setTimeout(()=>{
          dfun.back();
        },500)
      }else{
        dfun.toast(res.errorMessage)
      }
    })
    // dfun.toast(this.data.value)
    // this.data.password = ''
    // this.data.focusIndex = 0;
    // this.setData({
    //   password: this.data.password,
    //   focusIndex: this.data.focusIndex
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取Uner列表
    dfun.getAjax('api/family/uner/optionList', {}, 'get', (res) => {
      if (res.succeeded) {
        this.data.unerData = res.data;
        res.data.forEach(e=>{
          this.data.columns.push(e.name);
        })
        this.setData({
          unerData:this.data.unerData,
          columns:this.data.columns
        })
      }
    });
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