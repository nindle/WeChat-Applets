App({
  onLaunch: function (options) {
    this.globalData.queryLoginId = options.query.loginId || ''
    this.globalData.remark = options.query.remark || ''
    this.login(options.query.userId || '')
  },
  onShow: function(options) {
    this.globalData.queryLoginId = options.query.loginId || ''
    this.globalData.queryUserId = options.query.userId || ''
  },
  login: function(bindUserId) {
    this.globalData.queryUserId = bindUserId
    wx.login({
      success: res => {
        if (!res.code) {
          wx.showToast({
            title: '登录失败：1002',
            icon: 'error'
          })
          return
        }
        wx.request({
          url: 'https://app-api.topcj.com/dragon/wx/wechat_login',
          method: 'post',
          data: {
            type: 3,
            code: res.code,
            aid: this.globalData.aid,
            bindUserId: bindUserId ? Number(bindUserId) : null
          },
          header: {
            'content-type': 'application/json'
          },
          success: ({data}) => {
            if(!data.success) {
              if(this.globalData.tryCount === 0) {
                this.globalData.tryCount ++
                setTimeout(() => {
                  this.login(bindUserId)
                }, 1000)
                return
              }

              if(bindUserId && this.readyCallback) {
                this.readyCallback()
                return
              }
              wx.redirectTo({
                url: '/pages/login/index'
              })
              return
            }else{
              this.globalData.token = data.data.token
              this.globalData.openId = data.data.openId
              this.globalData.unionId = data.data.unionId
              this.globalData.userId = data.data.userId
              this.globalData.sessionkey = data.data.sessionkey
            }
            if(!data.data.mobile && !bindUserId) {
              wx.redirectTo({
                url: '/pages/login/index'
              })
            }

            if (this.readyCallback) {
              this.readyCallback()
            }
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: '登录失败：1001',
          icon: 'error'
        })
      }
    })
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
  globalData: {
    aid: 34,
    token: '',      //登录信息
    appid: 'wx728417d5c919dcf1',    //小程序ID
    sessionkey: '',
    unionId: '',
    openId: '',
    userId: '',
    queryUserId: '',
    queryLoginId: '',
    tryCount: 0,
    userInfo: null,
    remark: ''
  }
})