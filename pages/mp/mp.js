const utils = require("../../utils/util");

Page({
  data: {
    project: {}
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendProjectData', (data) => {
      this.setData({
        project: data.project
      });
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