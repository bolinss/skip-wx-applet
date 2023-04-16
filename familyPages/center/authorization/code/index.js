import api from '../../../../utils/apiRequest';
Page({
  data: {
    code: '',
  },
  onShow() {
    this.getCode();
  },
  getCode() {
    api.get('/api/family/account/authority-manage/qr/code', {}, (content) => {
      const code = api.getAuthUrl(`api/tool/qrCode?content=${content}`);
      this.setData({
        code,
      });
    });
  },
  saveImg() {
    wx.getImageInfo({
      src: this.data.code,
      success: function (img) {
        let path = img.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            dfun.success('保存图片成功,请在手机相册中查看');
          },
          fail: function (res) {
            console.log(res);
            dfun.toast('保存图片失败');
          },
        });
      },
    });
  },
});
