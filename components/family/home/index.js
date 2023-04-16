// components/family/home/index.js
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
    loading: true,
    host: '',
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    activeTask: {},
    taskList: [],
    topThree: [],
    rankData: {},
    carouselList: [],
  },

  lifetimes: {
    attached() {
      // 获取图片域名地址
      this.gethost(() => {
        this.getCarousel();
        this.getTaskList();
      });
    },
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
    // 获取轮播
    getCarousel() {
      api.get('/api/api/home/platform/task/home', {}, (res) => {
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
    // 切换学生
    onUnerChange(event) {
      this.setData({
        activeTask: event.detail,
      });

      this.getRankData();
    },
    // 获取赛事列表
    getTaskList() {
      api.get('/api/api/home/statistical/task/list', {}, (res) => {
        if (res && res.length > 0) {
          this.setData({
            taskList: res,
            activeTask: {
              name: res[0].taskId,
              title: res[0].taskName,
            },
          });
          this.selectComponent('#tabs').resize();
          this.getRankData();
        }
      });
    },
    // 获取排名
    getRankData() {
      const id = this.data.activeTask.name;
      api.get(`/api/api/home/task/${id}/ranking`, {}, (res) => {
        const list = res || [];
        const topThree = list.slice(0, 3);
        const rankData = list.slice(3);
        rankData.forEach((e) => {
          if (e.ranking < 10) {
            e.ranking = `0${e.ranking}`;
          }
        });
        this.setData({
          topThree,
          rankData,
        });
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
  },
});
