const app = getApp();

Page({
  data: {},
  validSubmit(e){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!this.data.name){
      my.showToast({
        type: 'none',
        content: '请填写联系人',
        duration: 1600,
      });
      return false;
    }
    if(!myreg.test(this.data.tel)){
      my.showToast({
        type: 'none',
        content: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(app.data.location.latitude===undefined){
      app.data.location.latitude = app.data.location.dimension
    }
    my.httpRequest({
      url: app.data.url + '/?c=AliMini_Shortcut',
      method: 'POST',
      data: Object.assign({
        longitude: app.data.location.longitude,
        dimension: app.data.location.latitude,
        mobileTel: this.data.tel,
        userName: this.data.name,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.sn){
          app.data.main = {
            sn: res.data.data.sn,
            whichChoice: "Q"
          };

          setTimeout(function() {
            my.navigateBack({
              delta: 2
            });
          }, 0);

          setTimeout(function() {
            my.navigateTo({
                url: '../main-success/success'
            });
          }, 200);
          
        }else{
           my.showToast({
            type: 'none',
            content: '没有查到订单', 
            duration: 1600,
          });
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
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
});