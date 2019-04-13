// 云函数入口文件
const cloud = require('wx-server-sdk')
const QcloudSms = require("qcloudsms_js")
const appid = xxxxxxx
const appkey = "xxxxx"
const templateId = xxxx
const smsSign = "xxxx"

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()
  let qcloudsms = QcloudSms(appid, appkey)
  let ssender = qcloudsms.SmsSingleSender()
  let verify = ('000000' + Math.floor(Math.random() * 999999)).slice(-6)
  let activetime = 5
  let params = [verify, activetime]
  ssender.sendWithParam(86, event.phone, templateId,
    params, smsSign, "", "", (err, res, resData) => {
      if (err) {
        console.log("err: ", err);
        reject({
          err
        })
      } else {
        if (resData.result === 0) {
          var { result, errmsg, fee, sid } = resData
        } else {
          var { result, errmsg } = resData
        }
        db.collection('Verify').add({
          data: {
            openId: wxContext.OPENID,
            unionid: wxContext.UNIONID ? wxContext.UNIONID : '',
            phone: event.phone,
            verify: verify,
            activetime: activetime,
            sendtime: new Date().getTime(),
            fee: fee ? fee : '',
            sid: sid ? sid : '',
            sendResult: result,
            errmsg: errmsg,
            recvtime: '',
            recvmsg: '',
            recvresult: '',
            inpuTime: '',
            inputVerify: '',
            inputCount: parseInt(0),
            verifyStatus: false
          }
        }).then(res => {
          resolve({
            code: result,
            msg: result === 0 ? '验证码发送成功' : errmsg
          })
        })
      }
    })
})

