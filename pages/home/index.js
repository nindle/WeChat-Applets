import Tool from '../../utils/util' 
const app = getApp()

Page({
  onShareAppMessage: function () {
    return {
      title: '摇钱术至尊版',
      path: '/pages/index/index'
    }
  },
  data: {
    url: '',
    navTab: [
      {
				name: '盘前精选',
				icon: '../../assets/home/home_icon1.png',
				url: 'https://app-web.topcj.com/#/topiclist/23'
      },
      {
				name: '昨夜今晨',
				icon: '../../assets/home/home_icon2.png',
				url: 'https://app-web.topcj.com/#/topiclist/25'
      },
      {
				name: '热点挖宝',
				icon: '../../assets/home/home_icon3.png',
				url: 'https://app-web.topcj.com/#/topiclist/17'
      },
      {
				name: '一图看懂',
				icon: '../../assets/home/home_icon4.png',
				url: 'https://app-web.topcj.com/#/topiclist/39'
      },
      {
				name: '策略精粹',
				icon: '../../assets/home/home_icon5.png',
				url: 'https://app-web.topcj.com/#/topiclist/45'
      },
      {
				name: '资金风向标',
				icon: '../../assets/home/home_icon6.png',
				url: 'https://app-web.topcj.com/#/topiclist/19'
      },
      {
				name: '操盘纲要',
				icon: '../../assets/home/home_icon7.png',
				url: 'https://app-web.topcj.com/#/topiclist/35'
      },
      {
				name: '首席观点',
				icon: '../../assets/home/home_icon8.png',
				url: 'https://app-web.topcj.com/#/topiclist/41'
      },
    ],
    videoList: [],
    articleList: [],
    bannerLeft: {},
    bannerRight: {}, 
    platform: '', //设备信息
    videoShow: null,
    login: false,
    state: false,
		btnShow: false,
		
  },
  onShow(){
    if(app.globalData.userInfo){
      this.setData({
        login: true
      })
    }
  },
  onLoad: function () {
    this._observer = wx.createIntersectionObserver(this)
    this._observer
    .relativeTo('.root')
    .observe('.videoShow', res => {
      if(res.intersectionRatio === 0){
        this.videoContext.stop()
      }
    })
    this.getTopic(29)
    this.getTopic(31)
    this.getArticleList(1)
    this.getArticleList(117)
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        if(res.system.substring(0, 3) === 'iOS'){
          this.setData({
            platform: 1
          })
        }else {
          this.setData({
            platform: 2
          })
        }
      }
    })
  },
  navClick(e) {
    wx.navigateTo({
      url: '../web_view/index?url=' + encodeURIComponent(e.currentTarget.dataset.url)
    })
  },
  // 获取专题信息
  async getTopic(id){
    let url = `https://app-api.topcj.com/dragon/special/getById/${id}`
    const data = await this.getData(url, 'get', {})
    if(data.success){
      if(id === 29){
        for (const item of data.data.stocks) {
          item.pctChangeRate = await this.getStock(item.stockId, item.marketType)
        }
        this.setData({
          bannerLeft: data.data
        })
      }else if(id === 31){
        for (const item of data.data.stocks) {
          item.pctChangeRate = await this.getStock(item.stockId, item.marketType)
        }
        this.setData({
          bannerRight: data.data
        })
      }
    }
  },
  // 获取股票信息
  async getStock(stockid, market){
    let url = `https://p-api.topxlc.com/lvd/stock/secondline?stockid=${stockid}.${market}`
    const data = await this.getData(url, 'get', {})
    if (data.code === 8200) {
      let pctChangeRate = data.result[0]?.pctChangeRate.toFixed(2);
      return pctChangeRate
    } else {
      return undefined
    } 
  },
  // 获取文章列表
  async getArticleList(id){
    let url = `https://app-api.topcj.com/dragon/info/stock_content`
    const data = await this.getData(url, 'POST', {infoTypeId: id, from: 0, size: id === 1 ? 100 : 5}, {'platform': this.platform})
    if(data.success){
      if(id === 117){
        this.setData({
          videoList: data.data
        })
      }
      data.data = data.data.map((e)=>{
        e.ntime = this.configTime(e.ntime)
        return e
      })
      this.setData({
        articleList: data.data
      })
    }
  },
  // 同意注册
  radioChange(){
    this.setData({
      state: !this.data.state,
      btnShow: !this.data.state,
    })
  },
  // 登录
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
    const data = await this.getData(
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
      await this.getData(bindurl, 'post', { type: 0, loginIdEn: Tool.encrypt(phone)}, {token: app.globalData.token})
      let userurl = `https://app-api.topcj.com/dragon/user/get_user_profile`
      const userInfo = await this.getData(userurl, 'post', {}, {token: app.globalData.token})
      if(userInfo.success){
        app.globalData.userInfo = userInfo.data
        this.onShow()
      }
    }
    console.log(app.globalData);
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
  // 点击播发视频
  clickVideoPlay(e){
    this.videoContext = wx.createVideoContext(e.currentTarget.dataset.videoref)
    this.videoContext.play()
    this.videoContext.requestFullScreen()
    this.setData({
      videoShow: e.currentTarget.dataset.videoid
    })
  },
  // 格式化时间
  configTime(time){
    var date = new Date(parseFloat(time))
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = (date.getDate()).toString().padStart(2, '0')
    return `${year}-${month}-${day}` 
  }
})
