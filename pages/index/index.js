import Tool from '../../utils/util' 
const app = getApp()

Page({
  data: {
    url: '',
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
      url: 'https://app-web.topcj.com/#/applet' + Tool.json2search({
        userId: app.globalData.queryUserId || app.globalData.userId,
        loginId: app.globalData.queryLoginId,
        unionId: app.globalData.unionId,
        remark: app.globalData.remark
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '摇钱术至尊版',
      path: '/pages/index/index'
    }
  }
})
