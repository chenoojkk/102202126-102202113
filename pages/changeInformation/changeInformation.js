Page({
  data: {
    name: '',
    grade: '',
    college: '',
    email: '',
    phone: '',
    intro: ''
  },

  onLoad() {
    // Load existing user information if available
    const app = getApp();
    this.setData({
      name: app.globalData.name || '',
      grade: app.globalData.grade || '',
      college: app.globalData.college || '',
      email: app.globalData.email || '',
      phone: app.globalData.phone || '',
      intro: app.globalData.intro || ''
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onGradeInput(e) {
    this.setData({ grade: e.detail.value });
  },

  onCollegeInput(e) {
    this.setData({ college: e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onIntroInput(e) {
    this.setData({ intro: e.detail.value });
  },

  submitForm() {
    const { name, grade, college, email, phone, intro } = this.data;
    const app = getApp();
    app.globalData.name = name;
    app.globalData.grade = grade;
    app.globalData.college = college;
    app.globalData.email = email;
    app.globalData.phone = phone;
    app.globalData.intro = intro;

    wx.showToast({
      title: '信息已更新！',
      icon: 'success',
      duration: 2000
    });

    // Navigate back or to another page if needed
    wx.navigateBack();
  }
});