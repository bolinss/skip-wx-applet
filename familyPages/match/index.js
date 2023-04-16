import api from '../../utils/apiRequest';
Page({
  data: {
    sysSkipPlatformTaskId: '',
    host: '',
    detail: {},
    unerList: [],
    activeUner: '',
  },
  onLoad(option) {
    const { id, host } = option;
    this.data.sysSkipPlatformTaskId = id;
    this.data.host = host;
    this.getDetail();
    this.getUnerList();
  },
  onShow: function () {},
  back() {
    const { sysSkipPlatformTaskId, activeUner } = this.data;
    if (activeUner.join) {
      //取消报名
      api.del(
        `/api/platform/task/cancel/${sysSkipPlatformTaskId}?sysUnerId=${activeUner.sysUnerId}`,
        {},
        (res) => {
          wx.showToast({
            title: '取消成功',
          });
          this.getUnerList();
        }
      );
    } else {
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  onUnerChange(event) {
    const { name } = event.detail;
    const obj = this.data.unerList.find((e) => {
      return e.sysUnerId === name;
    });
    this.setData({
      activeUner: obj,
    });
  },
  // 报名
  sign() {
    const { sysSkipPlatformTaskId, activeUner } = this.data;
    if (activeUner.join) {
      return;
    }
    api.post(
      `/api/platform/task/${sysSkipPlatformTaskId}?sysUnerId=${activeUner.sysUnerId}`,
      {},
      (res) => {
        wx.showToast({
          title: '报名成功',
        });
        this.getUnerList();
      }
    );
  },
  getUnerList() {
    const { sysSkipPlatformTaskId } = this.data;
    api.get(
      `/api/platform/task/sign-up/${sysSkipPlatformTaskId}`,
      {},
      (res) => {
        const data = res || [];
        if (data.length > 0) {
          const item = data[0];
          this.setData({
            unerList: data,
            activeUner: item,
          });
          this.selectComponent('#tabs').resize();
        }
      }
    );
  },
  getDetail() {
    const { sysSkipPlatformTaskId } = this.data;
    api.get(`/api/platform/task/${sysSkipPlatformTaskId}`, {}, (res) => {
      res.taskIntroduction = this.changeImgPath(res.taskIntroduction || '');
      res.taskIntroduction = res.taskIntroduction.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto" '
      );
      this.setData({
        detail: res,
      });
    });
  },
  changeImgPath(content) {
    var b = /<img [^>]*src=['"]([^'"]+)[^>]*>/g; // img 标签取src里面内容的正则
    var s = content.match(b); // 取到所有img标签 放到数组 s里面
    if (!s) {
      return '';
    }
    for (var i = 0; i < s.length; i++) {
      var srcImg = s[i].replace(b, '$1'); //取src面的内容
      if (srcImg.slice(0, 4) == 'http' || srcImg.slice(0, 5) == 'https') {
        //若src前4位置或者前5位是http、https则不做任何修改
        console.log('不做任何修改');
      } else {
        //修改富文本字符串内容 img标签src 相对路径改为绝对路径
        content = content.replaceAll(srcImg, this.data.host + srcImg);
      }
    }

    return content;
  },
});
