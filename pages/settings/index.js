import Tool from '../../utils/util' 
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },
  readyLoad: function () {
    
  },
  async esc(e) {
    let url = `https://app-api.topcj.com/dragon/user/login_out`
    const  data  = await this.getData(url, 'get', {},  {token: app.globalData.token})
    if(data.success){
      app.globalData.userInfo = null
      await app.login()
      wx.reLaunch({
        url: '../my_home/index'
      })
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
})
