// components/teacher/mine/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myinfo:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPage(e){
      let page = e.currentTarget.dataset.page;
      this.triggerEvent('goPage',{page});
    }
  }
})
