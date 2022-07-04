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
      // url: 'https://demo-aweb.topcj.com/#/livetext'
      url: 'https://app-web.topcj.com/#/livetext'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '摇钱术至尊版',
      path: '/pages/live/index'
    }
  }
})
