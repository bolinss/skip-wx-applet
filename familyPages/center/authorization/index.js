import api from '../../../utils/apiRequest';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    list: [],
  },
  onShow() {
    this.getList();
  },
  goPage(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/familyPages/center/authorization/code/index`,
    });
  },
  // 取消授权
  cancelAuth(e) {
    Dialog.alert({
      title: '确认',
      selector: '#van-dialog-del',
      showCancelButton: true,
      message: '你正在撤销授权！',
    })
      .then((res) => {
        const id = e.target.dataset.id;
        api.del(
          `/api/family/account/authority-manage/auth?childUserId=${id}`,
          {},
          (res) => {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
            });
            this.getList();
          }
        );
      })
      .catch(() => {});
  },
  // 确认授权
  confirmlAuth(e) {
    const id = e.target.dataset.id;
    api.put(
      `/api/family/account/authority-manage/auth?childUserId=${id}`,
      {},
      (res) => {
        wx.showToast({
          title: '授权成功',
          icon: 'success',
        });
        this.getList();
      }
    );
  },
  getList() {
    api.get('/api/family/account/authority-manage/list', {}, (res) => {
      this.setData({
        list: res,
      });
    });
  },
});
