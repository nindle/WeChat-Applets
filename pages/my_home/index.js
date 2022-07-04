import Tool from '../../utils/util' 
import { md5 } from '../../utils/md5' 
import base64 from '../../utils/base64' 
const app = getApp()

Page({
  data: {
    url: '',
    userInfo: null,
    token: null,
    authLogin: null
  },
  onShow(){
    if(app.globalData.userInfo){
      this.onLoad()
      this.setData({
        userInfo: app.globalData.userInfo
      })
      let userId = app.globalData.userInfo.topUserId
      let deadline = Date.now()
      let key = "075dfa7becf54cc4aff1d75080983eb9"
      let sign =md5(key + deadline + userId)
      let query = `userId=${userId}&deadline=${deadline}&sign=${sign}`
      let authLogin = base64.encode(query)
      if(authLogin){
        this.setData({
          authLogin: authLogin,
        })
      }
    }
  },
  onLoad: function () {
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    if(app.globalData.token){
      this.setData({
        token: app.globalData.token
      })
    }
  },
  // 跳转web-view
  navClick(e) {
    let userId = app.globalData.userInfo.topUserId
    let deadline = Date.now()
    let key = "075dfa7becf54cc4aff1d75080983eb9"
    let sign =md5(key + deadline + userId)
    let query = `userId=${userId}&deadline=${deadline}&sign=${sign}`
    let authLogin = base64.encode(query)
    console.log(authLogin);
    if(authLogin){
      this.setData({
        authLogin: authLogin,
      })
    }
    wx.navigateTo({
      url: '../web_view/index?url=' + encodeURIComponent(e.currentTarget.dataset.url)
    })
  },
  // 跳转web-view
  navClicks(e) {
    wx.navigateTo({
      url: '../web_view/index?url=' + encodeURIComponent(e.currentTarget.dataset.url)
    })
  },
  goIndex(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  settings(){
    wx.navigateTo({
      url: '../settings/index'
    })
  },
  async bindPhone(e) {
    // 获取手机号
    let url = `https://app-api.topcj.com/dragon/wx/wechat_decrypt`
    const data = await this.getData(
      url, 
      'post',
      {
        encrypdata: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionkey: app.globalData.sessionkey,
        appid: app.globalData.appid
      },
      {
        token: app.globalData.token
      }
    )
    if(data.success){
      let bindurl = `https://app-api.topcj.com/dragon/wx/bind_user_phone`
      let phone = JSON.parse(data.data).purePhoneNumber
      await this.getData(bindurl, 'post', { type: 0, loginIdEn: Tool.encrypt(phone)}, {token: app.globalData.token})
      let userurl = `https://app-api.topcj.com/dragon/user/get_user_profile`
      const userInfo = await this.getData(userurl, 'post', {}, {token: app.globalData.token})
      app.globalData.userInfo = userInfo.data
      let userId = app.globalData.userInfo.topUserId

      let deadline = Date.now()
      let key = "075dfa7becf54cc4aff1d75080983eb9"
      let sign =md5(key + deadline + userId)
      let query = `userId=${userId}&deadline=${deadline}&sign=${sign}`
      let authLogin = base64.encode(query)
      if(authLogin){
        this.setData({
          authLogin: authLogin,
          token: app.globalData.token,
          userInfo: userInfo.data
        })
      }
    }
  },
    // 封装接口
  getData(url, type, param, header){
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: type,
        data: param,
        header: header,
        success (res) {
          resolve(res.data)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },

  onShareAppMessage: function () {
    return {
      title: '摇钱术至尊版',
      path: '/pages/my_home/index'
    }
  },
})
