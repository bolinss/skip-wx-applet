// index.js
import dfun from '../../../utils/dfun.js';
//获取应用实例
const app = getApp();
// 首页
const pageIndex = '/familyPages/main/index';

Page({
  data: {
    show: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //查看是否授权
    wx.login({
      success: (res) => {
        wx.showLoading({
          title: '加载中...',
        });

        if (res.code) {
          // 登录成功
          dfun.getAjax(
            '/api/applet-user/wx/login',
            { code: res.code },
            'get',
            (res) => {
              const data = res.data;
              wx.setStorageSync('token', data.token);
              if (data.appletUserInfoFlag) {
                const { info } = data;
                // 已经授权
                wx.setStorageSync('userInfo', info);

                if (data.roleFamilyFlag && data.roleTeacherFlag) {
                  // 两种角色都有，去选择角色页面
                  wx.redirectTo({
                    url: '/familyPages/main/index',
                  });
                } else if (data.roleFamilyFlag) {
                  // 只有家长角色,去家长首页
                  wx.redirectTo({
                    url: pageIndex,
                  });
                } else {
                  // 创建家长角色
                  this.creatRole(info);
                }
              } else {
                // 显示授权页面，点击可授权
                this.setData({ show: true });
              }
            }
          );
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  },
  // 创建家长角色
  creatRole() {
    dfun.getAjax(
      `/api/applet-user/setRole/family?roleFamilyFlag=true`,
      {},
      'post',
      (res) => {
        wx.redirectTo({
          url: pageIndex,
        });
      }
    );
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别',
      success: (res) => {
        const userInfo = JSON.parse(res.rawData);
        // 上传用户信息
        this.setUserInfo(userInfo);
      },
      fail: (res) => {
        //不授权
        console.log(res);
        return;
      },
    });
  },
  // 上传用户信息
  setUserInfo(obj) {
    const token = wx.getStorageSync('token');
    dfun.getAjax(`/api/applet-user/setUserInfo`, { ...obj }, 'post', (res) => {
      wx.setStorageSync('userInfo', obj);
      this.creatRole();
    });
  },
});
