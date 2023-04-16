import dfun from '../../utils/dfun'
import api from '../../utils/apiRequest'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: '',
    certificateNo: '',
    sysSchoolInfoId: '',
    teacherPhone: '',
    teacherPhoneCode: '',
    teacherPhoneCodeId: '',
    text: '',
    schoolListData: [],
    schoolList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from === "start") {
      setTimeout(() => {
        // 延迟弹出，避免在真机环境下，无法弹出提示
        wx.showToast({
          title: '您需要先填写资料',
          icon: 'none',
          duration: 2000
        });
      }, 1000);
    }

    dfun.getAjax('api/applet/school/list', {}, 'get', res => {
      this.data.schoolListData = res.data;
      if (this.data.schoolListData) {
        this.data.schoolList = [];
        this.data.schoolListData.forEach(e => {
          this.data.schoolList.push(e.schoolName);
        })
      }
      this.setData({
        schoolList: this.data.schoolList
      })
    })
  },
  getSelectData(e) {
    let index = e.detail.index;
    this.data.sysSchoolInfoId = this.data.schoolListData[index].sysSchoolInfoId;
  },
  sendCode() {
    if (!this.data.teacherPhone) {
      dfun.toast('请输入手机号');
      return false;
    }
    if(!dfun.validatePhone(this.data.teacherPhone)){
      dfun.toast('请输入正确的手机号码');
      return false;
    }
    dfun.getAjax('api/tool/sendSmsCode', {
      phone: this.data.teacherPhone
    }, 'get', res => {
      if (res.succeeded) {
        dfun.success('发送验证成功');
        this.data.teacherPhoneCodeId = res.data;
        this.setData({
          text: '短信验证码已发送至手机' + this.data.teacherPhone + '，请在5分钟内完成验证。'
        })
      } else {
        dfun.toast(res.errorMessage);
      }
    })
  },
  submit() {
    if (!this.data.realName) {
      dfun.toast('请输入真实姓名');
      return false;
    }
    if (!this.data.certificateNo) {
      dfun.toast('教师资格证编号');
      return false;
    }
    if (!this.data.sysSchoolInfoId) {
      dfun.toast('请选择任职学校');
      return false;
    }
    if (!this.data.teacherPhone) {
      dfun.toast('请输入手机号');
      return false;
    }
    if(!dfun.validatePhone(this.data.teacherPhone)){
      dfun.toast('请输入正确的手机号码');
      return false;
    }
    if (!this.data.teacherPhoneCode) {
      dfun.toast('请输入手机号短信验证码');
      return false;
    }

    wx.showModal({
      title: '提交确认',
      content: '请确认您填写的信息真实有效，否则将无法通过审核!',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '提交中',
          });
          // 提交资料
          api.post("api/applet-user/setTeacherInfo", {
            realName: this.data.realName,
            certificateNo: this.data.certificateNo,
            sysSchoolInfoId: this.data.sysSchoolInfoId,
            teacherPhone: this.data.teacherPhone,
            teacherPhoneCode: this.data.teacherPhoneCode,
            teacherPhoneCodeId: this.data.teacherPhoneCodeId
          }, () => {
            // 提交成功
            api.refreshLoginInfo(() => {
              wx.navigateBack();
            });

          }, (errorMessage) => {
            wx.hideLoading({
              success: (res) => {},
            });
            dfun.toast(errorMessage);

          })

        } else if (res.cancel) {
          
        }
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