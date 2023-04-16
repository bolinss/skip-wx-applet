import dfun from '../../../../utils/dfun.js';
import util from '../../../../utils/util.js';
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    sysUnerId: '',
    name: '',
    idCard: '',
    gender: 1,
    genderList: [
      { text: '男', id: 1 },
      { text: '女', id: 2 },
    ],
    sysSchoolInfoId: '',
    sysSchoolInfoName: '',
    dateOfBirth: '',
    dateOfBirthName: '',
    minDate: new Date(1900, 0, 1).getTime(),
    height: '',
    weight: '',
    pickerKey: '',
    schoolList: [],
    pickerList: [],
    pickerShow: false,
    showCalendar: false,
  },
  onLoad(option) {
    const { sysUnerId } = option;
    if (sysUnerId) {
      this.data.sysUnerId = sysUnerId;
      this.getUnerInfo();
    }
  },
  onShow() {
    this.getSchoolList();
  },
  getUnerInfo() {
    const { sysUnerId } = this.data;
    dfun.getAjax(
      `api/family/uner/info?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          let { data = {} } = res;
          const {
            name,
            idCard,
            gender,
            sysSchoolInfoId,
            schoolInfo = {},
            dateOfBirth,
            height,
            weight,
            sysUnerId,
          } = data;

          this.setData({
            name,
            idCard,
            gender,
            sysSchoolInfoName: schoolInfo ? schoolInfo.schoolName : '',
            sysSchoolInfoId,
            dateOfBirth: new Date(dateOfBirth).getTime(),
            dateOfBirthName: dateOfBirth,
            height,
            weight,
            sysUnerId,
          });
        }
      }
    );
  },
  // 确认选择
  onPickerConfirm(e) {
    const { value } = e.detail;
    const { id, text } = value;
    let data;
    if (this.data.pickerKey === 'sysSchoolInfoId') {
      data = {
        sysSchoolInfoName: text,
        sysSchoolInfoId: id,
      };
    } else {
      data = {
        gender: id,
      };
    }
    this.setData({
      ...data,
      pickerShow: false,
    });
  },
  // 取消选择
  onPickerCancel() {
    this.setData({
      pickerShow: false,
    });
  },
  onCancelCalendar() {
    this.setData({
      showCalendar: false,
    });
  },
  // 打开选择
  pickerShowChange(e) {
    let pickerList;
    const { key } = e.target.dataset;
    if (key === 'sysSchoolInfoId') {
      pickerList = this.data.schoolList;
    } else {
      pickerList = this.data.genderList;
    }
    this.setData({
      pickerKey: key,
      pickerList,
      pickerShow: true,
    });
  },
  // 打开或者选择
  onShowCalendar() {
    this.setData({
      showCalendar: !this.data.showCalendar,
    });
  },
  onConfirmCalendar(e) {
    this.onShowCalendar();
    const date = new Date(e.detail);
    this.setData({
      dateOfBirthName: util.formatTime(date, '-'),
      dateOfBirth: date,
    });
  },
  // 获取学校列表
  getSchoolList() {
    dfun.getAjax(`api/applet/school/list`, {}, 'get', (res) => {
      if (res.succeeded) {
        let { data = [] } = res;
        data = data.map((e) => {
          const { sysSchoolInfoId, schoolName } = e;
          return {
            text: schoolName,
            id: sysSchoolInfoId,
          };
        });

        this.data.schoolList = data;
      }
    });
  },
  // 删除uner
  delete() {
    Dialog.alert({
      title: '确认',
      selector: '#van-dialog-del',
      showCancelButton: true,
      message: '确认删除Uner',
    })
      .then((res) => {
        const { sysUnerId } = this.data;
        dfun.getAjax(
          `api/family/uner/?sysUnerId=${sysUnerId}`,
          {},
          'delete',
          (res) => {
            if (res.succeeded) {
              wx.showToast({
                title: '删除成功',
              });
              wx.navigateBack({
                delta: 1,
              });
            }
          }
        );
      })
      .catch(() => {});
  },
  submit() {
    const {
      name,
      idCard,
      gender,
      sysSchoolInfoId,
      dateOfBirth,
      height,
      weight,
      sysUnerId,
    } = this.data;

    if (!sysSchoolInfoId) {
      wx.showToast({
        icon: 'error',
        title: '请选择学校',
      });
      return;
    }

    const data = {
      name,
      idCard,
      gender,
      sysSchoolInfoId,
      dateOfBirth: dateOfBirth ? util.formatTime(dateOfBirth, '-') : '',
      height,
      weight,
    };

    let type = 'post';
    if (sysUnerId) {
      type = 'put';
      data.sysUnerId = sysUnerId;
    }
    dfun.getAjax(`/api/family/uner/`, { ...data }, type, (res) => {
      if (res.succeeded) {
        wx.showToast({
          title: '保存成功',
        });
        wx.navigateBack({
          delta: -1,
        });
      }
    });
  },
});
