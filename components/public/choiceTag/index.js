// components/choiceTag/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSingle: { //是否单选
      type: Boolean,
      value: true,
    },
    maxlength: { //最多选择几个
      type: Number,
      value: 0,
    },
    tagBox: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        if (newVal && newVal.length != 0) {
          newVal.forEach(e => {
            e.checked = false;
          })
        }
        this.setData({
          tagBox: newVal
        })
      }
    },
    defaultData: {//默认选中数据
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          let choiceData = newVal.split(',');
          choiceData.forEach(e1=>{
            this.data.tagBox.forEach(e2=>{
              if(e1 == e2.tag_name){
                e2.checked = true;
              }
            })
          })
          this.setData({
            tagBox: this.data.tagBox
          })
        }
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tagBox: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choiceTag(e) {
      let index = e.currentTarget.dataset.index;
      let checked = e.currentTarget.dataset.checked;
      if (this.data.isSingle) {
        this.data.tagBox.forEach(e => {
          e.checked = false;
        })
        this.data.tagBox[index].checked = true;
      } else {
        if(this.data.maxlength != 0 && !checked){//表示有最大选择个数限制
          let numTrue = 0;
          this.data.tagBox.forEach(item=>{
            if(item.checked){
              numTrue++;
            }
          })
          if(numTrue >= this.data.maxlength){
            wx.showToast({
              icon:'none',
              title: '最多选择'+this.data.maxlength+'个',
            })
          }else{
            this.data.tagBox[index].checked = !checked;
          }
        }else{
          this.data.tagBox[index].checked = !checked;
        }
        
      }
      this.setData({
        tagBox: this.data.tagBox
      })
      let choiceBox = [];
      this.data.tagBox.forEach(e=>{
        if(e.checked){
          choiceBox.push(e);
        }
      })
      this.triggerEvent('setTagData',choiceBox);
    }
  }
})