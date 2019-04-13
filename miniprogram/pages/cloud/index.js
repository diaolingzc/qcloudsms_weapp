// pages/cloud/index.js
const app = getApp()

Page({
    data: {
        pageHeight: '',
    },
    onLoad: function () {
        this.setData({
            pageHeight: app.globalData.pageHeight
        })
    },

    CopyLink(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.link,
            success: res => {
                console.log(res)
                wx.showToast({
                    title: '已复制',
                    duration: 1000,
                })
            }
        })
    },
})