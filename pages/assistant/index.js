import Tool from '../../utils/util' 
const app = getApp()

Page({
  data: {
    url: '',
    login: false,
    state: false,
	  btnShow: false,
  },
  onLoad: function () {
    if (app.globalData.token) {
      this.readyLoad()
    } else {
      app.readyCallback = () => {
        this.readyLoad()
      }
    }
  },
  readyLoad: function () {
    this.setData({
      url: 'https://app-web.topcj.com/#/vip/informations'
    })
  },
  async loginFn(e){
    if(!this.data.state){
      wx.showToast({
        title: '请同意服务条款',
        icon: 'none',
        duration: 2000
      })
      return
    }
        // 获取手机号
    let url = `https://app-api.topcj.com/dragon/wx/wechat_decrypt`
    const data = await app.getData(
      url, 
      'post',
      { encrypdata: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionkey: app.globalData.sessionkey,
        appid: app.globalData.appid
      },
      { token: app.globalData.token}
    )
    if(data.success){
      let bindurl = `https://app-api.topcj.com/dragon/wx/bind_user_phone`
      let phone = JSON.parse(data.data).purePhoneNumber
      await app.getData(bindurl, 'post', { type: 0, loginIdEn: Tool.encrypt(phone)}, {token: app.globalData.token})
      let userurl = `https://app-api.topcj.com/dragon/user/get_user_profile`
      const userInfo = await app.getData(userurl, 'post', {}, {token: app.globalData.token})
      if(userInfo.success){
        app.globalData.userInfo = userInfo.data
        this.onShow()
      }
    }
	},
	navClick(e) {
    wx.navigateTo({
      url: '../web_view/index?url=' + encodeURIComponent(e.currentTarget.dataset.url)
    })
  },
  onShow(){
    if(app.globalData.userInfo){
      this.setData({
        login: true
      })
    }
  },
  radioChange(){
    this.setData({
      state: !this.data.state,
      btnShow: !this.data.state,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '摇钱术至尊版',
      path: '/pages/index/index'
    }
  },

})
