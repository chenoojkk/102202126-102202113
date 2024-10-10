# 微信小程序 - 跨界合作平台

## 简介

102202113-102202126结对作业



## 使用方法

-解压miniprogram_npm.zip和node_modules.zip，使其和iamge等文件夹在同一个目录下（miniprogram_npm和node_modules两个文件夹）
![image](https://github.com/user-attachments/assets/ce3dd7ba-8750-4844-b948-6ecc0d5b76d3)


-  进入[微信小程序官网](https://mp.weixin.qq.com/cgi-bin/wx),注册,登录
- 获取你的AppID

  ![20220525231716](https://raw.githubusercontent.com/learner-lu/picbed/master/20220525231716.png)

- 替换 `project.config.json` 中的"appid" 为你的appid
- 使用[微信开发者工具](http://www.ionic.wang/weixin/devtools/download.html)打开根目录
- 复制你的云开发环境ID,替换 `app.js` 中的env环境名

  ```js
  wx.cloud.init({
        env:"bsgm-5gvcl7jl192b36ae"
      })
  ```

  ![20220530231731](https://raw.githubusercontent.com/learner-lu/picbed/master/20220530231731.png)

- 新建数据库表, `project` `chat_user` 和 `chat_record` ,数据权限改为所有的人可读写

![屏幕截图 2024-10-10 170428](https://github.com/user-attachments/assets/94695e5b-616a-4fca-8f27-40e8257b9402)


- 全部清除缓存，重新编译此项目,开始聊天吧!

## 关于

### 关于账号

运行后注册两个账号，可以有发布项目，聊天等功能

### 问题

本来是要上传二维码的图片，可是微信小程序需要发布才能申请二维码，我们在尝试申请过后被驳回

![屏幕截图 2024-10-10 171044](https://github.com/user-attachments/assets/d9962987-54d1-4e46-80ce-887e7f56aaa9)


如果检查时上述代码无法运行，请联系微信号：Chen_onno，添加微信，协商分享屏幕演示


