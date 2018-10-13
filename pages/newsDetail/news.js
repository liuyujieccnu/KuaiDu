// pages/newsDetail/news.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newId: "",
    title: "",
    source: "",
    time: "",
    read: "",
    newItem: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '快看·资讯',
    });
    //console.log(options);
    this.setData({
      newId: options.id,
    });
    this.getNewsDeatail(this.data.newId);
  },
  /**
   * 获取新闻详情
   */
  getNewsDeatail(newsid, callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsid,
      },
      success: res => {
        //console.log(res);
        let result = res.data.result;
        //console.log(result);
        this.setData({
          title: result.title,
          source: result.source === "" ? "快看·资讯" : result.source,
          time: `${result.date.slice(5, 10)} ${result.date.slice(11, 16)}`,
          read: result.readCount,
          newsItem: result.content,
        });
      },
      fail: err => {
        wx.showToast({
          title: '网络请求失败',
        });
      },
      complete: () => {
        typeof callback === 'function' && callback();
      }
    })
  },
})