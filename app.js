import dfun from './utils/dfun.js';
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // wx.getSetting({
    // 	success(res) {
    // 		if (!res.authSetting['scope.userInfo']) {
    // 			console.log(1)
    // 		}else{
    // 			console.log(2)
    // 			wx.authorize({
    // 				scope: 'scope.userInfo',
    // 				success(res2) {
    // 					// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    // 					//wx.startRecord();
    // 					console.log(res2)
    // 				}
    // 			})
    // 		}
    // 	},
    // 	fail(res){

    // 	}
    // })
    // 登录
    // wx.login({
    // 	success: res => {
    // 		// 发送 res.code 到后台换取 openId, sessionKey, unionId
    // 		dfun.getAjax('api/BaseAPI/MimiOpenId', {
    // 			jsCode: res.code
    // 		}, 'post', function (res2) {//平台登录
    // 			if (res2.data.code != 1){//登录失败
    // 				if (!res2.data.data.unionid) {//无unionid（没有授权，需要调方法授权）

    // 					wx.authorize({
    // 						scope: 'scope.userInfo',
    // 						success:function(settingInfo){
    // 							console.log(settingInfo)
    // 						}
    // 					})
    // 					wx.getUserInfo({
    // 						success: function (res3) {

    // 							dfun.getAjax('api/BaseAPI/MiniDecodeUserInfo', {
    // 								"session_key": res2.data.data.session_key,
    // 								"encryptedData": res3.encryptedData,
    // 								"iv": res3.iv
    // 							}, 'POST', function (res4) {
    // 								console.log(res4)
    // 							})
    // 						}
    // 					})

    // 				} else {//有unionid（已授权）
    // 					wx.redirectTo({
    // 						url: '/pages/other/bindPhone/bindPhone'
    // 					})
    // 				}

    // 			}else{//登录成功
    // 				wx.setStorageSync("token", res4.data.token);
    // 				wx.switchTab({
    // 					url: '/pages/main/workbench/workbench'
    // 				})
    // 			}

    // 		})
    // 	}
    // })

    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
  globalData: {
    //这个参数不表上当前登录用户,仅用于全局传参.当前登录用户在Storage里面
    userInfo_opt: null,
    // 家长端
    family: {
      // 二维码扫码结果
      qrcodeContent: '',
      // 二维码扫描结果
      qrcodeResult: '',
    },
  },
});
