//index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotTitle: "",
    hotSource: "",
    hotTime: "",
    hotImgAdress: "",
    newsItem: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2b88d7',
    });
    wx.setNavigationBarTitle({
      title: '快看·资讯',
    });
    this.getNews();
    console.log('onload');
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
   * 下拉刷新相关函数
   */
  onPullDownRefresh: function() {

    wx.stopPullDownRefresh();

  },

  /**
   * 获取新闻函数
   */
  getNews(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: "gn",
      },
      success: res => {
        //console.log(res);
        let hotRes = res.data.result[0];
        let itemRes = res.data.result.slice(1);
        itemRes.forEach(item => {
          item.date = item.date.slice(11, 16);
          item.source = (item.source === "") ? "快看·资讯" : item.source;
          //console.log(item);
        });
        this.setData({
          hotTitle: hotRes.title,
          hotSource: hotRes.source === "" ? "快看·资讯" : result[0].source,
          hotTime: hotRes.date.slice(11, 16),
          hotImgAdress: hotRes.firstImage,
          newsItem: itemRes,
        });
      },
    })
  }
})