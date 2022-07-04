import Tool from '../../utils/util' 
const app = getApp()

Page({
  data: {
    url: '',
  },
  onLoad: function (options) {
    console.log(decodeURIComponent(options.url));
    this.setData({
      url: decodeURIComponent(options.url)
    })
  },
})
