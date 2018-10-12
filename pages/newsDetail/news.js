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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
          time: result.date.slice(11, 16),
          read: result.readCount,
          newsItem: result.content,
        });
      },
      complete: () => {
        callback && callback();
      }
    })
  },

  /**
   * 下拉刷新相关函数
   */
  onPullDownRefresh: function () {
    this.getNewsDeatail(this.data.newId, () => {
      wx.stopPullDownRefresh();
    });
  },
})