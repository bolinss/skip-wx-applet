// components/family/train/index.js
import dfun from '../../../utils/dfun.js';
import api from '../../../utils/apiRequest';
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    timer: null,
    host: '',
    notice: '',
    loading: true,
    carouselList: [],
    pickerShow: false,
    isOpen: false,
    unerList: [],
    activeUner: {},
    lastInfo: {},
    markInfo: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gethost(cb) {
      api.get('/api/tool/file/host', {}, (res) => {
        this.data.host = res;
        cb && cb();
      });
    },
    goMatch(e) {
      const { key, canClick } = e.currentTarget.dataset;
      const { host } = this.data;
      if (canClick) {
        wx.navigateTo({
          url: `/familyPages/match/index?id=${key}&host=${host}`,
        });
      }
    },
    // 获取公告
    getNotice() {
      api.get('/api/api/notice/task', {}, (res) => {
        let text = [];
        res.forEach((e) => {
          text.push(e.taskDescription);
        });

        this.setData({
          notice: text.join('，'),
        });
        this.data.timer = setInterval(() => {
          let first = text.slice(0, 1);
          text = text.slice(1);
          text += first;
          this.setData({
            notice: text,
          });
        }, 500);
      });
    },
    // 获取赛事信息
    getCarousel() {
      api.get('/api/api/home/platform/task/train', {}, (res) => {
        const { host } = this.data;
        for (let key in res) {
          const list = res[key];
          list.forEach((e) => {
            e.taskTitleImg = host + e.taskTitleImg;
          });
        }

        this.setData({
          loading: false,
          carouselList: res,
        });
      });
    },
    // 打开选择
    pickerShowChange(e) {
      this.setData({
        pickerShow: true,
      });
    },
    // 确认选择
    onPickerConfirm(e) {
      const activeUner = e.detail.value;

      this.setData({
        activeUner,
      });
      this.getData();
      this.onPickerCancel();
    },
    // 取消选择
    onPickerCancel() {
      this.setData({
        pickerShow: false,
      });
    },
    handleOpen() {
      let { isOpen } = this.data;
      this.setData({
        isOpen: !isOpen,
      });
    },
    // 查询训练成绩，非展开
    getMarkInfo() {
      dfun.getAjax(
        `api/family/uner/mark/info`,
        { sysUnerId: this.data.activeUner.sysUnerId },
        'get',
        (res) => {
          if (res.succeeded) {
            const { data = {} } = res;

            this.setData({
              markInfo: data,
            });
          }
        }
      );
    },
    // 获取最后一次跳绳计时
    getLastInfo() {
      dfun.getAjax(
        `api/family/uner/mark/last/info`,
        { sysUnerId: this.data.activeUner.sysUnerId },
        'get',
        (res) => {
          if (res.succeeded) {
            const { data = {} } = res;
            const { now, previous } = data;
            data.rate = (Math.abs((now - previous) / previous) * 100).toFixed(
              2
            );
            this.setData({
              lastInfo: data,
            });
          }
        }
      );
    },
    // 获取Uner列表
    getUnerList() {
      dfun.getAjax('api/family/uner/optionList', {}, 'get', (res) => {
        if (res.succeeded) {
          const data = res.data || [];
          if (data.length > 0) {
            data.forEach((e) => {
              e.id = e.sysUnerId;
              e.text = e.name;
            });
            const item = data[0];
            this.setData({
              unerList: data,
              activeUner: item,
            });
            this.getData();
          }
        }
      });
    },
    getData() {
      this.getLastInfo();
      this.getMarkInfo();
    },
    goStatistics() {
      wx.navigateTo({
        url: '/familyPages/statistics/index',
      });
    },
    goDevice() {
      wx.navigateTo({
        url: '/familyPages/center/device/index?activeAction=3',
      });
    },
  },
  lifetimes: {
    attached() {
      clearInterval(this.data.timer);
      this.gethost(() => {
        this.getCarousel();
      });
      this.getUnerList();
      this.getNotice();
    },
  },
});
