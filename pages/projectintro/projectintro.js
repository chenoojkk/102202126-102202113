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

  applyToJoin() {
    console.log('applyToJoin function called'); // 检查函数是否被调用
  
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    const project = this.data.project;
  
    if (!project._id) {
      wx.showToast({
        icon: "none",
        title: '项目ID不存在',
      });
      return;
    }
  
    const db = wx.cloud.database();
  
    // 查找 userB 的信息
    db.collection('chat_user').where({
      account_id: project.user
    }).get({
      success(res) {
        console.log('chat_user query success', res); // 调试信息
        if (res.data.length > 0) {
          const userB = res.data[0];
          const newMessage = {
            id: userInfo._id,
            text: `${userInfo.account_id} 申请加入项目 ${project.projectName}`,
            time: utils.formatTime(new Date())
          };
  
          // 第一次查询
          db.collection('chat_record').where({
            userA_id: userInfo._id,
            userB_id: userB._id,
          }).get({
            success(res) {
              if (res.data.length > 0) {
                // 文档已存在，更新记录
                const recordId = res.data[0]._id;
                const record = res.data[0].record;
                record.push(newMessage);
  
                db.collection('chat_record').doc(recordId).update({
                  data: {
                    record: record
                  },
                  success(res) {
                    console.log('chat_record update success', res); // 调试信息
                    wx.showToast({
                      title: '申请已发送！',
                      icon: 'success',
                      duration: 2000
                    });
                  },
                  fail(err) {
                    console.error('chat_record update fail', err); // 调试信息
                    wx.showToast({
                      title: '申请发送失败',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              } else {
                // 第二次查询
                db.collection('chat_record').where({
                  userA_id: userB._id,
                  userB_id: userInfo._id,
                }).get({
                  success(res) {
                    if (res.data.length > 0) {
                      // 文档已存在，更新记录
                      const recordId = res.data[0]._id;
                      const record = res.data[0].record;
                      record.push(newMessage);
  
                      db.collection('chat_record').doc(recordId).update({
                        data: {
                          record: record
                        },
                        success(res) {
                          console.log('chat_record update success', res); // 调试信息
                          wx.showToast({
                            title: '申请已发送！',
                            icon: 'success',
                            duration: 2000
                          });
                        },
                        fail(err) {
                          console.error('chat_record update fail', err); // 调试信息
                          wx.showToast({
                            title: '申请发送失败',
                            icon: 'none',
                            duration: 2000
                          });
                        }
                      });
                    } else {
                      // 文档不存在，创建新文档
                      const newRecord = {
                        userA_id: userInfo._id,
                        userA_account_id: userInfo.account_id,
                        userA_avatarUrl: userInfo.avatarUrl,
                        userB_id: userB._id,
                        userB_account_id: userB.account_id,
                        userB_avatarUrl: userB.avatarUrl,
                        projectId: project._id,
                        record: [newMessage],
                        friend_status: false
                      };
  
                      db.collection('chat_record').add({
                        data: newRecord,
                        success(res) {
                          console.log('chat_record add success', res); // 调试信息
                          wx.showToast({
                            title: '申请已发送！',
                            icon: 'success',
                            duration: 2000
                          });
                        },
                        fail(err) {
                          console.error('chat_record add fail', err); // 调试信息
                          wx.showToast({
                            title: '申请发送失败',
                            icon: 'none',
                            duration: 2000
                          });
                        }
                      });
                    }
                  },
                  fail(err) {
                    console.error('chat_record query fail', err); // 调试信息
                    wx.showToast({
                      title: '申请发送失败',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              }
            },
            fail(err) {
              console.error('chat_record query fail', err); // 调试信息
              wx.showToast({
                title: '申请发送失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        } else {
          wx.showToast({
            title: '项目发布人信息未找到',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(err) {
        console.error('chat_user query fail', err); // 调试信息
        wx.showToast({
          title: '获取项目发布人信息失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  contactUs() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    const project = this.data.project;
    const db = wx.cloud.database();
  
    // 查找项目发布人的信息
    db.collection('chat_user').where({
      account_id: project.user
    }).get({
      success(res) {
        if (res.data.length > 0) {
          const userB = res.data[0];
  
          // 检查是否已是好友
          db.collection('chat_record').where({
            userA_id: userInfo._id,
            userB_id: userB._id,
            friend_status: true
          }).get({
            success(res) {
              if (res.data.length > 0) {
                // 已是好友，跳转到聊天页面
                wx.navigateTo({
                  url: '/pages/chat/chat?id=' + res.data[0]._id
                });
              } else {
                // 不是好友，发送好友申请
                const newMessage = {
                  id: userInfo._id,
                  text: `${userInfo.account_id} 申请添加你为好友`,
                  time: new Date()
                };
  
                const newRecord = {
                  userA_id: userInfo._id,
                  userA_account_id: userInfo.account_id,
                  userA_avatarUrl: userInfo.avatarUrl,
                  userB_id: userB._id,
                  userB_account_id: userB.account_id,
                  userB_avatarUrl: userB.avatarUrl,
                  projectId: project._id,
                  record: [newMessage],
                  friend_status: false
                };
  
                db.collection('chat_record').add({
                  data: newRecord,
                  success(res) {
                    wx.showToast({
                      title: '好友申请已发送！',
                      icon: 'success',
                      duration: 2000
                    });
                  },
                  fail(err) {
                    wx.showToast({
                      title: '好友申请发送失败',
                      icon: 'none',
                      duration: 2000
                    });
                    console.error('好友申请发送失败：', err);
                  }
                });
              }
            },
            fail(err) {
              wx.showToast({
                title: '检查好友状态失败',
                icon: 'none',
                duration: 2000
              });
              console.error('检查好友状态失败：', err);
            }
          });
        } else {
          wx.showToast({
            title: '项目发布人信息未找到',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(err) {
        wx.showToast({
          title: '获取项目发布人信息失败',
          icon: 'none',
          duration: 2000
        });
        console.error('获取项目发布人信息失败：', err);
      }
    });
  }
});