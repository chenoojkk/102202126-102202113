// app.js
App({
  onLaunch() {
    
    wx.cloud.init({
      env:"bsgm-5gvcl7jl192b36ae"
    })
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
      console.log('get storage')
    }
  },
  globalData: {
    username: '', // Replace with actual username logic
    userProjects: [
      /*{ title: "User Project 1", desc: "Build a website", thumb: "https://tse3-mm.cn.bing.net/th/id/OIP-C.Z1femsB7r_pTZ-1AhOLOvwHaEH?w=321&h=180&c=7&r=0&o=5&pid=1.7", user: "user1" },
      { title: "User Project 2", desc: "Create a mobile app", thumb: "https://tse3-mm.cn.bing.net/th/id/OIP-C.Z1femsB7r_pTZ-1AhOLOvwHaEH?w=321&h=180&c=7&r=0&o=5&pid=1.7", user: "user2" }*/
    ]
  }
})
