// components/slect/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { //选人标题
      type: String,
      value: '下拉选择',
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          title: newVal
        })
      }
    },
    hasBgColor: { //是否含有背景色
      type: Boolean,
      value: true
    },
    columns: { //选人标题
      type: Array,
      value: ['暂无数据'],
      observer: function (newVal, oldVal, changedPath) {
        this.setData({
          columns: newVal
        })
      }
    },
    defaultData: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          this.data.defaultIndex = this.data.columns.indexOf(newVal);
          this.setData({
            title: newVal,
            defaultIndex: this.data.defaultIndex
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSelect: false,
    changeValue: '',
    confirmValue: {},
    defaultIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showColumn() {
      this.triggerEvent('hasShowPop',true);
      this.setData({
        showSelect: true
      })
    },
    onChange(e) { //切换选项
      this.data.changeValue = e.detail;
    },
    onCancel() { //点击取消
      this.triggerEvent('hasShowPop',false);
      this.setData({
        showSelect: false
      })
    },
    onClose() { //点击取消
      this.triggerEvent('hasShowPop',false);
      this.setData({
        showSelect: false
      })
    },
    onConfirm() { //点击确认
      if (!this.data.changeValue) {
        this.data.changeValue = {
          value: this.data.columns[0],
          index: 0
        }
      }
      this.setData({
        title: this.data.changeValue.value,
        showSelect: false
      })
      this.triggerEvent('sendSelectData', {
        index:this.data.changeValue.index,
        value:this.data.changeValue.value==='不限'?'':this.data.changeValue.value
      });
      this.triggerEvent('hasShowPop',false);
    }
  }
})