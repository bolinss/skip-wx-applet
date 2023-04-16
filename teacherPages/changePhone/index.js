import dfun from '../../utils/dfun';
Page({
  data: {
    phoneNumber: '',
    code: '',
    smsCode:'',
    text: '',
  },
  changePhone() {
    if (!this.data.code) {
      dfun.toast('请输入短信验证码');
      return false;
    }
    dfun.getAjax('api/teacher/info/phone',{
      codeId:this.data.smsCode,
      phone:this.data.phoneNumber,
      smsCode:this.data.code
    },'put',res=>{
      if (res.succeeded) {
        dfun.success('手机号修改成功');
        this.back();
      } else {
        dfun.toast(res.errorMessage);
      }
    })
  },
  sendCode() {
    if (!this.data.phoneNumber) {
      dfun.toast('请输入手机号');
      return false;
    }
    if (!dfun.validatePhone(this.data.phoneNumber)) {
      dfun.toast('请输入正确的手机号');
      return false;
    }
    dfun.getAjax(
      'api/tool/sendSmsCode',
      {
        phone: this.data.phoneNumber,
      },
      'get',
      (res) => {
        if (res.succeeded) {
          this.data.smsCode = res.data;
          dfun.success('发送验证成功');
          this.setData({
            text:
              '短信验证码已发送至手机' +
              this.data.phoneNumber +
              '，请在5分钟内完成验证。',
          });
        } else {
          dfun.toast(res.errorMessage);
        }
      }
    );
  },
  onShow: function () {},
  go(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/familyPages/center/${type}/index`,
    });
  },
});
