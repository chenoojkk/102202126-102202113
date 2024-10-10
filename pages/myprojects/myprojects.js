Page({
  data: {
    projects: [],
    noResults: false
  },

  onLoad() {
    this.loadMyProjects();
  },

  loadMyProjects() {
    const app = getApp();
    const db = wx.cloud.database();
    const userId = app.globalData.userInfo.account_id;

    db.collection('projects').where({
      user: userId
    }).get({
      success: res => {
        this.setData({
          projects: res.data,
          noResults: res.data.length === 0
        });
      },
      fail: err => {
        console.error('加载项目失败：', err);
        wx.showToast({
          title: '加载项目失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  viewdetails(e) {
    const project = e.currentTarget.dataset.project;
    wx.navigateTo({
      url: '/pages/mp/mp',
      success: function(res) {
        res.eventChannel.emit('sendProjectData', { project });
      }
    });
  },

  deleteProject(e) {
    const projectId = e.currentTarget.dataset.id;
    const db = wx.cloud.database();

    db.collection('projects').doc(projectId).remove({
      success: res => {
        wx.showToast({
          title: '项目删除成功',
          icon: 'success',
          duration: 2000
        });
        this.loadMyProjects(); // 重新加载项目列表
      },
      fail: err => {
        console.error('项目删除失败：', err);
        wx.showToast({
          title: '项目删除失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});