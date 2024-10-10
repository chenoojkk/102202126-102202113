const app = getApp();
const utils = require("../../utils/util");

Page({
  data: {
    inputValue: "",
    time: 0,
    chatList: [],
    recordId: '',
    userInfo: {},
    friend_account_id: '',
    friend_avatarUrl: ''
  },

  onLoad: function (options) {
    this.setData({
      recordId: options.id,
      userInfo: app.globalData.userInfo
    });
    this.getChatList();
    this.getFriendInfo();
  },

  onShow: function () {
    this.getChatList();
  },

  publishMessage() {
    if (this.data.inputValue == "") {
      wx.showToast({
        icon: "none",
        title: '不能发送空消息',
      });
      return;
    }
    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).get({
      success(res) {
        var record = res.data.record;

        var msg = {
          id: app.globalData.userInfo._id,
          text: that.data.inputValue,
          time: utils.formatTime(new Date())
        };

        record.push(msg);

        wx.cloud.database().collection('chat_record').doc(that.data.recordId).update({
          data: {
            record: record
          },
          success(res) {
            wx.showToast({
              title: '发送成功',
            });

            that.getChatList();
            that.setData({
              inputValue: ''
            });
          }
        });
      }
    });
  },

  handleInput(e) {
    clearTimeout(this.data.time);
    var that = this;
    this.data.time = setTimeout(() => {
      that.getInputValue(e.detail.value);
    }, 200);
  },

  getInputValue(value) {
    this.setData({
      inputValue: value
    });
  },

  getChatList() {
    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).watch({
      onChange: function (snapshot) {
        that.setData({
          chatList: snapshot.docs[0].record,
          scrollLast: "toView"
        });
      },
      onError: function (err) {
        console.log(err);
      }
    });
  },

  getFriendInfo() {
    var that = this;
    wx.cloud.database().collection('chat_record').doc(that.data.recordId).get({
      success(res) {
        if (that.data.userInfo._id == res.data.userA_id) {
          that.setData({
            friend_account_id: res.data.userB_account_id,
            friend_avatarUrl: res.data.userB_avatarUrl
          });
        } else {
          that.setData({
            friend_account_id: res.data.userA_account_id,
            friend_avatarUrl: res.data.userA_avatarUrl
          });
        }
        wx.setNavigationBarTitle({
          title: that.data.friend_account_id
        });
      }
    });
  }
});