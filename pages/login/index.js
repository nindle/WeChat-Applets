import Tool from '../../utils/util' 
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    wx.hideHomeButton()
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  },
  readyLoad: function () {
    
  },
  bindPhone: function (e) {
    wx.request({
      url: `https://app-api.topcj.com/dragon/wx/wechat_decrypt`,
      method: 'post',
      data: {
        encrypdata: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionkey: app.globalData.sessionkey,
        appid: app.globalData.appid
      },
      header: {
        'content-type': 'application/json',
        token: app.globalData.token
      },
      success: ({ data }) => {
        if (data.success) {
          let phone = JSON.parse(data.data).purePhoneNumber

          wx.request({
            url: `https://app-api.topcj.com/dragon/wx/bind_user_phone`,
            method: 'post',
            data: {
              type: 0,
              loginIdEn: Tool.encrypt(phone)
            },
            header: {
              'content-type': 'application/json',
              token: app.globalData.token
            },
            success: () => {
              wx.redirectTo({
                url: '/pages/index/index'
              })
            }
          })
        }
      }
    })
  }
})
