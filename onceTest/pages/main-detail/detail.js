const app = getApp();

Page({
  data: {
    main: app.data.main,
    hide: true
  },
  onLoad(query){
    let obj;
    let that = this;
    if(query.success == 0){//下单成功页面而来
        obj = {
          sn: app.data.main.sn
        };
    }else{
        obj = {
          mobileTel: app.data.getMain.mobileTel,
          code:  app.data.getMain.code,
        };
    }
    my.httpRequest({//提交订单
        url: app.data.url + '/?c=AliMini_Query',
        method: 'POST',
        data: Object.assign(obj,app.data.userInfo),
        dataType: 'json',
        success: function (res) {
          if(res.data.status-0 === 200){
            that.setData({
              main: res.data.data
            })
          }else{
            that.setData({
              hide: false
            })
          }
        },
        fail: function (res) {
          console.error("fails");
        },
        complete: function (res) {
          console.log("ok");
        }
    });
  },
  goMainDetail(){
    my.navigateTo({
        url: '../maintenance/maintenance'
    });
  }
});