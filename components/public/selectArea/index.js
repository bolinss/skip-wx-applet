// components/slect/index.js
import areaList from '../../../config/city.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {//选人标题
			type: String,
			value: '下拉选择',
			observer: function (newVal, oldVal, changedPath){
        let data = newVal.split('-');
        let dataText = data[0] == data[1]?data[0]:newVal;
				this.setData({
					titleText:dataText
				})
			}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaList:areaList,
    showSelect:false,
    confirmValue:{},
    defaultData:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showColumn(){
      this.setData({
        showSelect:true
      })
    },
    onCancel(){//点击取消
      this.setData({
        showSelect:false
      })
    },
    onConfirm(e){//点击确认
      let initData = JSON.parse(JSON.stringify(e.detail));
      let areaData = e.detail.values;
      if(areaData[0].name == areaData[1].name){
        areaData.splice(0,1);
      }
      let areaStr = '';
      areaData.forEach((e,index)=>{
        areaStr += index === 0 ? e.name : ' - ' + e.name;
      })
      this.setData({
        title:areaStr,
        showSelect:false
      })
      this.triggerEvent('sendAreaData', initData);
    }
  }
})
