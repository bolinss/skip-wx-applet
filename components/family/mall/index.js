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
    page: {
      pageNum: 1,
      pageSize: 20,
      total: 0,
    },
    productTitle: '',
    list: [],
  },
  lifetimes: {
    attached() {
      this.getList();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      const { id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/familyPages/mall/shopDetail/index?id=${id}`,
      });
    },
    titleChange(e) {
      const productTitle = e.detail;
      this.data.productTitle = productTitle;
    },
    clearTitle() {
      this.data.productTitle = '';
      this.search();
    },
    search() {
      this.data.page.pageNum = 1;
      this.data.list = [];
      this.getList();
    },
    getList() {
      const { productTitle, page } = this.data;
      const data = {
        productTitle,
        current: page.pageNum,
        size: page.pageSize,
      };
      api.get('api/mall/product/page', { ...data }, (res) => {
        let { records = [], total } = res;
        let { list } = this.data;

        records = list.concat(records);
        this.setData({
          list: records,
          ['page.total']: total,
        });
      });
    },
    // 翻页
    more() {
      this.data.page.pageNum++;
      this.getList();
    },
  },
});
