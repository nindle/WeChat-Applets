import CryptoJS from './cryptoJS'

const date = function (value) {
  if (typeof value == 'string') {
    value = value.replace(/-/g, '/');
  }
  if (value){
    this.time = new Date(value)
  }else{
    this.time = new Date()
  }
  

  this.getMonth = () => this.time.getMonth()
  this.getDate = () => this.time.getDate()
  this.getHours = () => this.time.getHours()
  this.getMinutes = () => this.time.getMinutes()
  this.getSeconds = () => this.time.getSeconds()
  this.getFullYear = () => this.time.getFullYear()
  this.getTime = () => this.time.getTime()
  this.getDay = () => this.time.getDay()

  this.timeFormat = (fmt) => {
    const o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds()
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
  }
}

const deepCopy = obj => JSON.parse(JSON.stringify(obj))

const json2search = function (obj) {
  let str = []
  for (let i in obj) {
    if (obj[i] != null){
      str.push(`${i}=${obj[i]}`)
    }
  }
  if (str.length) {
    return '?' + str.join('&')
  } else {
    return ''
  }
}

const search2json = function(str) {
  const arr = str.substring(str.indexOf('?') + 1, str.length).split('&')
  let obj = {}
  for(let i in arr) {
    let k = arr[i].split('=')
    obj[k[0]] = k[1]
  }
  return obj
}

const encrypt = function (str) {
  var key = CryptoJS.enc.Utf8.parse("0102030405060708")
  var iv = CryptoJS.enc.Utf8.parse('0102030405060708')
  var encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC })
  return encrypted.toString()
}

module.exports = {
  date,
  deepCopy,
  json2search,
  search2json,
  encrypt
}
