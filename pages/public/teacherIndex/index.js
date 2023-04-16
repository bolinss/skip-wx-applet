// index.js
import dfun from '../../../utils/dfun.js';
//获取应用实例
const app = getApp();
// 首页
const pageIndex = '/teacherPages/main/index';

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
                const { info, appletUserTeacherInfoFlag } = data;
                // 已经授权，缓存用户信息
                wx.setStorageSync('userInfo', info);
                if (data.roleTeacherFlag) {
                  // 有教师角色，直接去教师首页
                  wx.redirectTo({
                    url: pageIndex,
                  });
                } else {
                  // 创建教师角色
                  this.creatRole(appletUserTeacherInfoFlag);
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
  /**
   * 创建教师角色
   * @param {Boolean} hasTeacherInfo  是否有教师信息，true进入教师首页，false, 去认证教师西悉尼
   */
  creatRole(hasTeacherInfo) {
    dfun.getAjax(
      `/api/applet-user/setRole/teacher?roleTeacherFlag=true`,
      {},
      'post',
      (res) => {
        wx.redirectTo({
          url: hasTeacherInfo
            ? pageIndex
            : '/teacherPages/teacherConfirm/index',
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
      wx.setStorageSync('userInfo', info);
      // 这种情况下代表肯定没有认证教师资料，所以传参false
      this.creatRole(false);
    });
  },
});
