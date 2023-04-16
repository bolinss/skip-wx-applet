import dfun from '../../../utils/dfun';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    curSysSchoolInfoId: '',
    activeAction: '1',
    activeUner: '',
    activeUnerInfo: {},
    unerList: [],
    deviceList: [],
    statistical1V1: {},
    statistical1v1History: [],
    statisticalHonor: {},
    statisticalHonorHistory: [],
    dialogShow: false,
    dialogTitle: '',
    pickerShow: false,
    pickerList: [],
    updateKey: '',
    updateValue: '',
    focus: false,
  },
  onLoad(options) {
    const { activeAction } = options;
    if (activeAction) {
      this.setData({
        activeAction,
      });
    }
    this.setData({
      beforeClose: (action) => {
        const { updateValue } = this.data;
        if (action === 'confirm') {
          if (!updateValue) {
            wx.showToast({
              title: '请输入内容',
            });
          } else {
            this.confirmSubmit();
          }
        } else {
          this.setData({
            updateValue: '',
          });
          return true;
        }
      },
    });
  },
  onShow: function () {
    this.getUnerList();
  },
  onCollapseChange(event) {
    this.setData({
      activeAction: event.detail,
    });
  },
  go(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/familyPages/center/userInfo/address/detail/index`,
    });
  },
  onPickerConfirm(event) {
    const { id } = event.detail.value;
    wx.showToast({ title: `当前值：${id}` });
  },
  // 确认选择
  onPickerConfirm(e) {
    const { value } = e.detail;

    const sysUnerId = this.data.activeUner;
    const { updateKey } = this.data;
    const { id } = value;
    const data = {
      sysUnerId,
      [updateKey]: id,
    };

    if (updateKey === 'sysSchoolInfoId') {
      this.data.curSysSchoolInfoId = value.id;
    }

    this.updateUnerInfo(data);
  },
  // 取消选择
  onPickerCancel() {
    this.setData({
      pickerShow: false,
    });
  },
  // 打开选择
  pickerShowChange(e) {
    const { key } = e.target.dataset;
    if (key === 'sysSchoolInfoId') {
      this.getSchoolList();
    } else {
      this.getClasslList();
    }

    this.setData({
      updateKey: key,
      pickerShow: true,
    });
  },
  // 打开更改弹窗
  dialogShowChange(e) {
    const { name, key } = e.target.dataset;
    this.setData({
      dialogShow: true,
      dialogTitle: name,
      updateKey: key,
    });

    setTimeout(() => {
      this.setData({
        focus: true,
      });
    }, 100);
  },
  // 确定更改
  confirmSubmit() {
    const sysUnerId = this.data.activeUner;
    const { updateKey, updateValue } = this.data;
    const data = {
      sysUnerId,
      [updateKey]: updateValue,
    };
    this.updateUnerInfo(data);
  },
  updateUnerInfo(data) {
    dfun.getAjax(`/api/family/uner/`, { ...data }, 'put', (res) => {
      if (res.succeeded) {
        wx.showToast({
          title: '修改成功',
        });
        this.setData({
          updateValue: '',
          dialogShow: false,
          pickerShow: false,
        });
        this.getUnerInfo();
      }
    });
  },
  goPage() {
    const app = getApp();

    app.globalData.family.qrcodeContent = '';
    wx.navigateTo({
      url: '/familyPages/center/unerList/index',
    });
  },
  // 切换学生
  onUnerChange(event) {
    this.setData({
      activeUner: event.detail.name,
    });
    this.getData();
  },
  // 获取学生个人信息
  getUnerInfo() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/uner/info?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data } = res;
          if (data) {
            this.setData({
              activeUnerInfo: data,
            });
          }
        }
      }
    );
  },
  // 获取学生列表
  getUnerList() {
    dfun.getAjax('api/family/uner/optionList', {}, 'get', (res) => {
      if (res.succeeded) {
        const data = res.data || [];
        if (data.length > 0) {
          const item = data[0];
          this.setData({
            unerList: res.data,
            activeUner: item.sysUnerId,
          });
          this.selectComponent('#tabs').resize();
          this.getData();
        }
      }
    });
  },
  // 获取设备列表
  getDeviceList() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/device/uner/deviceList?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = [] } = res;
          data.forEach((e) => {
            const { deviceState } = e;
            let text = '';
            if (deviceState === 'DELIVERED') {
              text = '出厂';
            } else if (deviceState === 'NORMAL') {
              text = '正常';
            } else if (deviceState === ' OFFLINE') {
              text = '离线';
            } else {
              text = '低电量';
            }
            e.deviceStateLabel = text;
          });
          this.setData({
            deviceList: data,
          });
        }
      }
    );
  },
  // 删除设备
  delDevice(e) {
    Dialog.alert({
      title: '确认',
      selector: '#van-dialog-del',
      showCancelButton: true,
      message: '确认删除设备',
    })
      .then((res) => {
        const sysUnerId = this.data.activeUner;
        const refId = e.target.dataset.refid;
        dfun.getAjax(
          `api/family/device/uner/removeDevice?refId=${refId}&sysUnerId=${sysUnerId}`,
          {},
          'get',
          (res) => {
            if (res.succeeded) {
              this.getDeviceList();
              wx.showToast({ title: '删除成功' });
            }
          }
        );
      })
      .catch(() => {});
  },
  // 获取1V1统计数据
  getStatistical1V1() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/uner/statistical/1v1/info?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = {} } = res;
          data.percent =
            (data.success / (data.failure + data.success)).toFixed(2) * 100;
          this.setData({
            statistical1V1: data,
          });
        }
      }
    );
  },
  // 分页获取1V1历史数据
  getStatistical1v1History() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/uner/statistical/1v1/list?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = [] } = res;
          data.forEach((e) => {
            e.battleResultText = e.battleResult === 'SUCCESS' ? '胜' : '负';
            e.battleStartTime = e.battleStartTime.split(' ')[0];
          });
          this.setData({
            statistical1v1History: data,
          });
        }
      }
    );
  },
  // 获取荣誉榜统计数据
  getStatisticalHonor() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/uner/statistical/honorRoll/info?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = [] } = res;
          this.setData({
            statisticalHonor: data,
          });
        }
      }
    );
  },
  // 分页获取荣誉榜历史数据
  getStatisticalHonorHistory() {
    const sysUnerId = this.data.activeUner;
    dfun.getAjax(
      `api/family/uner/statistical/honorRoll/list?sysUnerId=${sysUnerId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          const { data = [] } = res;
          data.forEach((e) => {
            const { myRanking } = e;
            if (myRanking === 1) {
              e.myRankingCss = 'rank-1';
              e.myRankingText = '冠军';
            } else if (myRanking === 2) {
              e.myRankingCss = 'rank-2';
              e.myRankingText = '亚军';
            } else if (myRanking === 3) {
              e.myRankingCss = 'rank-3';
              e.myRankingText = '季军';
            } else {
              e.myRankingCss = '';
              e.myRankingText = `第${myRanking}名`;
            }
          });
          this.setData({
            statisticalHonorHistory: data,
          });
        }
      }
    );
  },
  getData() {
    this.getUnerInfo();
    this.getDeviceList();
    this.getStatistical1V1();
    this.getStatistical1v1History();
    this.getStatisticalHonor();
    this.getStatisticalHonorHistory();
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

        this.setData({
          pickerList: data,
        });
      }
    });
  },
  // 获取班级列表
  getClasslList() {
    let { curSysSchoolInfoId } = this.data;
    if (!curSysSchoolInfoId) {
      curSysSchoolInfoId = this.data.activeUnerInfo.schoolInfo.sysSchoolInfoId;
    }
    dfun.getAjax(
      `api/applet/school/class/list?sysSchoolInfoId=${curSysSchoolInfoId}`,
      {},
      'get',
      (res) => {
        if (res.succeeded) {
          let { data = [] } = res;
          data = data.map((e) => {
            const { sysSchoolClassInfoId, schoolClassName } = e;
            return {
              text: schoolClassName,
              id: sysSchoolClassInfoId,
            };
          });
          this.setData({
            pickerList: data,
          });
        }
      }
    );
  },
});
