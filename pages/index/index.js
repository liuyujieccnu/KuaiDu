//index.js
const newsType = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other'];
const cnNewsType = {
  'gn': '国内',
  'gj': '国际',
  'cj': '财经',
  'yl': '娱乐',
  'js': '军事',
  'ty': '体育',
  'other': '其他'
};
let newsBuffer={
  'gn': '',
  'gj': '',
  'cj': '',
  'yl': '',
  'js': '',
  'ty': '',
  'other': ''
}
let currentNewsID = "gn";
var touchDot = 0; //触摸时的原点
var time = 0; //  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = ""; // 记录/清理 时间记录
var tmpFlag = true;


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
    tabItem: newsType,
    cnItem: cnNewsType,
    current: "bar-current",
    currentNewsID: currentNewsID,
    hotId: "",
    newsId: ""
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
    this.getNews(currentNewsID);
    //console.log('onload');
  },
  /**
   * 下拉刷新相关函数
   */
  onPullDownRefresh: function() {
    this.getNews(currentNewsID, () => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 新闻选项切换函数
   */
  onTapSwitch: function(event) { //不能用箭头函数，否则无法setData
    //直接刷新数据即可
    //console.log(event.target.id.split("-")[0]);
    //console.log(newsType.indexOf(event.target.id.split("-")[0]));
    if (newsType.indexOf(event.target.id.split("-")[0]) !== -1) {
      currentNewsID = event.target.id.split("-")[0];
      this.setData({
        currentNewsID: currentNewsID,
      });
      //this.getNews(event.target.id.split("-")[0]);
      this.checkAndLoadNews(event.target.id.split("-")[0]);
    }
  },

  /**
   * 触摸开始事件
   */
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      time++;
    }, 100);
  },

  /**
   * 触摸移动事件
   */
  touchMove: function(e) {
    let touchMove = e.touches[0].pageX;
    //console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      if (tmpFlag && currentNewsID !== "other") {
        tmpFlag = false;
        if (currentNewsID !== "other") {
          currentNewsID = newsType[newsType.indexOf(currentNewsID) + 1];
        }
        this.setData({
          currentNewsID: currentNewsID,
        });
        this.checkAndLoadNews(currentNewsID);
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10) {
      if (tmpFlag && currentNewsID !== "gn") {
        tmpFlag = false;
        if (currentNewsID !== "gn") {
          currentNewsID = newsType[newsType.indexOf(currentNewsID) - 1];
        }
        this.setData({
          currentNewsID: currentNewsID,
        });
        this.checkAndLoadNews(currentNewsID);
      }
    }
  },

  /**
   * 触摸结束事件
   */
  touchEnd: function(e) {

    //this.getNews(currentNewsID);
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
  },

  /**
   * 网络获取新闻函数
   */
  getNews(newsType, callback) {
    console.log('网络获取数据');
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsType,
      },
      success: res => {
        //console.log(res);
        this.loadNews(res);
        newsBuffer[newsType]=res;
        //console.log(newsBuffer);
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
  /**
   * 点击进入新闻详情
   */
  onTapNewsDetail:function(event) {
    //console.log(event.target.id);
    if(event.target.id.split('-')[0].length===13){
      wx.navigateTo({
        url: `/pages/newsDetail/news?id=${event.target.id.split('-')[0]}`,
      });
    }
  },
  /**
   * 检查新闻是否已获取并展示
   * 如果已经获取便直接展示，未获取则获取之后展示
   */
  checkAndLoadNews(newsType){
    console.log(newsType);
    console.log(newsBuffer[newsType]);
    if(newsBuffer[newsType]!==""){
      this.loadNews(newsBuffer[newsType]);
    }else{
      this.getNews(newsType);
    }
  },
  /**
   * 加载展示新闻
   */
  loadNews(res){
    let hotRes = res.data.result[0];
    let itemRes = res.data.result.slice(1);
    itemRes.forEach(item => {
      item.date = `${item.date.slice(5,10)} ${item.date.slice(11, 16)}`;
      item.source = (item.source === "") ? "快看·资讯" : item.source;
      item.id = item.id;
      item.firstImage = item.firstImage === "" ? "../../images/kuaikan.png" : item.firstImage;
      //console.log(item);
    });
    this.setData({
      hotTitle: hotRes.title,
      hotSource: hotRes.source === "" ? "快看·资讯" : hotRes.source,
      hotTime: `${hotRes.date.slice(5, 10)} ${hotRes.date.slice(11, 16)}`,
      hotImgAdress: hotRes.firstImage === "" ? "../../images/kuaikan.png" : hotRes.firstImage,
      newsItem: itemRes,
      hotId: hotRes.id,
    });
  }
})