// components/slect/index.js
import dfun from '../../../utils/dfun.js'
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
    value: { //选人标题
      type: Number,
      value: new Date(new Date().toLocaleDateString()).getTime(),
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          this.setData({
            currentDate: newVal,
            title: dfun.formatTime(newVal, 'YMD')
          })
        }

      }
    },
    dateType: { //日期类型
      type: String,
      value: 'date'
    },
    minDate: { //最小选择时间
      type: Number,
      value: 1577808000000//2020-01-01 00:00:00
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
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
    onCancel() { //点击取消
      this.triggerEvent('hasShowPop',false);
      this.setData({
        showSelect: false
      })
    },
    onConfirm(e) { //点击确认
      let timeData = e.detail;
      if (this.data.dateType == 'time' && !isNaN(timeData)) {
        timeData = '00:00';
      }
      let timeStr = this.data.dateType == 'date' ? dfun.formatTime(timeData, 'YMD') : this.data.dateType == 'datetime' ? dfun.formatTime(timeData, 'YMDHM') : timeData;

      this.setData({
        title: timeStr,
        showSelect: false
      })
      this.triggerEvent('sendTimeData', e.detail);
      this.triggerEvent('hasShowPop',false);
    }
  }
})