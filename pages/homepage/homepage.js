Page({
  data: {
    results: [],
    noResults: false,
    latestProjectName: '' // 新增字段存储最新项目名称
  },

  onShow() {
    this.setData({
      results: [],
      noResults: false
    });
    this.loadProjects(); // 重新加载项目列表
    this.loadLatestProject(); // 加载最新项目名称
  },

  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/searchinfo/searchinfo'
    });
  },

  viewdetails(e) {
    const project = e.currentTarget.dataset.project;
    wx.navigateTo({
      url: '/pages/projectintro/projectintro',
      success: function(res) {
        res.eventChannel.emit('sendProjectData', { project });
      }
    });
  },

  navigateToPublish() {
    wx.navigateTo({
      url: '/pages/publishsubject/publishsubject',
    });
  },

  loadProjects() {
    const db = wx.cloud.database();
    db.collection('projects').orderBy('uploadTime', 'desc').get({
      success: res => {
        this.setData({
          results: res.data,
          noResults: false // 确保在加载项目时不显示“未找到相关项目”提示
        });
        wx.stopPullDownRefresh(); // 停止下拉刷新
      },
      fail: err => {
        console.error('加载项目失败：', err);
        wx.stopPullDownRefresh(); // 停止下拉刷新
      }
    });
  },

  loadLatestProject() {
    const db = wx.cloud.database();
    db.collection('projects').orderBy('uploadTime', 'desc').limit(1).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            latestProjectName: res.data[0].projectName
          });
        }
      },
      fail: err => {
        console.error('加载最新项目失败：', err);
      }
    });
  },

  onPullDownRefresh() {
    this.loadProjects(); // 重新加载项目列表
  }
});