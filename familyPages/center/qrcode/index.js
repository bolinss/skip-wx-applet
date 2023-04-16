import dfun from '../../../utils/dfun';
Page({
  data: {
    // 当前选择的UNer
    activeUNer: {
      name: '',
      sysUnerId: '',
    },
    // 二维码原始内容
    qrcodeContent: '',
    // 统一小程序二维码扫描结果内容
    qrcodeResult: {},
    // 二维码错误信息
    qrcodeErrorFlag: false,
    qrcodeErrorMessage: '',
    toRedirectToUrl: ''
  },
  onLoad(option) {
    let qrcodeContent = decodeURIComponent(option.qrcodeContent);
    let qrcodeResultJSON = decodeURIComponent(option.qrcodeResultJSON);
    let qrcodeResult = JSON.parse(qrcodeResultJSON);
    if (option.redirectToUrl) {
      // 自定义跳转页面
      this.setData({
        toRedirectToUrl: option.redirectToUrl
      });
    }
    console.log('[qrcodeResult]', qrcodeResult);
    this.setData({
      qrcodeContent: qrcodeContent,
      qrcodeResult: qrcodeResult,
    });

    // 设备二维码处理
    if (qrcodeResult.skipDeviceCodeFlag) {
      let skipDevice = qrcodeResult.skipDevice;

      // 判断是否属于自己的设备
      if (skipDevice.ownDeviceFlag) {
        // 自己的设备，允许修改绑定；并设置选择UNer信息
        this.setData({
          activeUNer: skipDevice.sysUnerInfo || {},
        });
        return;
      }

      // 判断设备是否可以绑定
      if (skipDevice.deviceActivationState === 'USED_FORMALLY') {
        this.setData({
          qrcodeErrorFlag: true,
          qrcodeErrorMessage: '此设备已被其它人绑定，不能重复绑定!',
        });
        return;
      }
      if (skipDevice.deviceActivationState === 'USED_TEMP') {
        this.setData({
          qrcodeErrorFlag: true,
          qrcodeErrorMessage: '此设备已被绑定为临时设备，不能绑定!',
        });
        return;
      }

      // 可以进行正常绑定
      return;
    }

    // 班级二维码处理
    if (qrcodeResult.schoolClassCodeFlag) {
      return;
    }

    // 全部都无法解析
    this.setData({
      qrcodeErrorFlag: true,
      qrcodeErrorMessage: '抱歉，二维码解析出现异常!',
    });
  },
  goUnerList() {
    wx.navigateTo({
      url:
        '/familyPages/center/unerList/chooseUNer/index?selectedSysUNerKey=activeUNer&selectedSysUNerId=' +
        this.data.activeUNer.sysUnerId,
    });
  },
  submit() {
    console.log('this.data.activeUNer', this.data.activeUNer);
    if (!this.data.activeUNer || !this.data.activeUNer.sysUnerId) {
      wx.showToast({
        title: '请选择关联的UNer',
        icon: 'none',
      });
      return;
    }
    let sysUnerId = this.data.activeUNer.sysUnerId;

    if (this.data.qrcodeResult.schoolClassCodeFlag) {
      this.classByUner(sysUnerId);
    } else if (this.data.qrcodeResult.skipDeviceCodeFlag) {
      this.deviewByUner(sysUnerId);
    }
  },
  // 班级绑定uner
  classByUner(selected) {
    const sysSchoolClassInfoId =
      this.data.qrcodeResult.schoolClass.sysSchoolClassInfoId;

    dfun.getAjax(
      `api/family/uner/class/bing?sysSchoolClassInfoId=${sysSchoolClassInfoId}&unerId=${selected}`,
      {},
      'post',
      (res) => {
        if (res.succeeded) {
          wx.showToast({
            title: '绑定成功',
          });
          wx.navigateBack({
            delta: 1,
          });
        } else {
          wx.showToast({
            icon: 'error',
            title: res.errorMessage,
          });
        }
      }
    );
  },
  // 设备绑定Uner
  deviewByUner(selected) {
    const qrcodeContent = this.data.qrcodeContent;
    const data = {
      qrcodeContent,
      sysUnerId: selected,
    };
    dfun.getAjax(
      'api/family/device/parseDeviceCode',
      { ...data },
      'post',
      (res) => {
        if (res.succeeded) {
          wx.showModal({
            title: '添加成功',
            content: '设备添加成功！您可以在设备管理中，查看新添加的设备',
            showCancel: false,
            success: function () {

              this.cancel();

              
            },
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.errorMessage,
          });
        }
      }
    );
  },
  cancel() {
    if (!this.data.toRedirectToUrl) {
      wx.navigateBack({
        delta: 1,
      });
    } else {
      wx.redirectTo({
        url: this.data.toRedirectToUrl
      });
    }
  },
});
