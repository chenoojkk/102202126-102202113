Page({
  data: {
    projectName: '',
    projectDesc: '',
    projectPartner: '',
    imagePath: '',
    shakeName: false,
    shakeDesc: false,
    shakePartner: false,
    shakeImage: false,
    nameFontSize: 16,
    descFontSize: 16,
    partnerFontSize: 16,
    results: [],
    noResults: false
  },

  calculateFontSize(length) {
    return length > 20 ? 12 : 16;
  },

  onNameInput(e) {
    const value = e.detail.value;
    this.setData({
      projectName: value,
      nameFontSize: this.calculateFontSize(value.length)
    });
  },

  onDescInput(e) {
    const value = e.detail.value;
    this.setData({
      projectDesc: value,
      descFontSize: this.calculateFontSize(value.length)
    });
  },

  onPartnerInput(e) {
    const value = e.detail.value;
    this.setData({
      projectPartner: value,
      partnerFontSize: this.calculateFontSize(value.length)
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1, // 限制选择一张图片
      mediaType: ['image'], // 只允许选择图片
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: (res) => {
        this.setData({
          imagePath: res.tempFiles[0].tempFilePath
        });
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },

  resetShake(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: false });
  },

  submitForm() {
    const { projectName, projectDesc, projectPartner, imagePath } = this.data;
    let valid = true;
  
    if (!projectName) {
      this.setData({ shakeName: true });
      valid = false;
    }
    if (!projectDesc) {
      this.setData({ shakeDesc: true });
      valid = false;
    }
    if (!projectPartner) {
      this.setData({ shakePartner: true });
      valid = false;
    }
    if (!imagePath) {
      this.setData({ shakeImage: true });
      valid = false;
    }
  
    if (!valid) {
      wx.showToast({
        title: '请填写所有必填项',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  
    const app = getApp();
    const newProject = {
      projectName: this.data.projectName,
      projectDesc: this.data.projectDesc,
      projectPartner: this.data.projectPartner,
      imagePath: this.data.imagePath,
      user: app.globalData.userInfo.account_id,
      uploadTime: new Date() // 添加当前时间
    };
  
    // 将新项目存储到云数据库中
    const db = wx.cloud.database();
    db.collection('projects').add({
      data: newProject,
      success: res => {
        wx.showToast({
          title: '项目发布成功！',
          icon: 'success',
          duration: 3000,
          position: 'top',
          complete: () => {
            // 清空输入内容
            this.setData({
              projectName: '',
              projectDesc: '',
              projectPartner: '',
              imagePath: '',
              shakeName: false,
              shakeDesc: false,
              shakePartner: false,
              shakeImage: false,
              nameFontSize: 16,
              descFontSize: 16,
              partnerFontSize: 16
            });
            // 跳转到首页
            wx.switchTab({
              url: '/pages/homepage/homepage',
              success: function (e) {
                const page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad(); // 调用首页的 onLoad 方法刷新数据
              }
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '项目发布失败',
          icon: 'none',
          duration: 2000
        });
        console.error('项目发布失败：', err);
      }
    });
  },

  loadProjects() {
    const db = wx.cloud.database();
    db.collection('projects').get({
      success: res => {
        this.setData({
          results: res.data,
          noResults: res.data.length === 0
        });
        wx.stopPullDownRefresh(); // 停止下拉刷新
      },
      fail: err => {
        console.error('加载项目失败：', err);
        wx.stopPullDownRefresh(); // 停止下拉刷新
      }
    });
  },

  onLoad() {
    // 清空数据
    this.setData({
      projectName: '',
      projectDesc: '',
      projectPartner: '',
      imagePath: ''
      
    });
    this.loadProjects(); // 加载项目列表
  }
});