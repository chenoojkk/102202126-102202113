Page({
  data: {
    query: '',
    results: [],
    noResults: false
  },

  onLoad(options) {
    if (options.query) {
      this.setData({ query: options.query });
      this.onSearch();
    }
  },

  onInput(e) {
    this.setData({ query: e.detail.value });
  },

  onSearch() {
    const query = this.data.query.trim();
    if (query === '') {
      this.setData({
        results: [],
        noResults: false
      });
      return;
    }
    const db = wx.cloud.database();
    db.collection('projects').where({
      projectName: db.RegExp({
        regexp: query,
        options: 'i' // 不区分大小写
      })
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            results: res.data,
            noResults: false
          });
        } else {
          this.setData({
            results: [],
            noResults: true
          });
        }
      },
      fail: err => {
        console.error('搜索失败：', err);
        this.setData({
          results: [],
          noResults: true
        });
      }
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
  }
});