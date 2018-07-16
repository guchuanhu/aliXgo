const app = getApp();
Page({
  data: {},
  onShow(){
    this.setData({
      main: app.data.main
    });
    // if(!app.data.main.total){
    //   my.showToast({
    //     type: 'none',
    //     content: '客服会在10分钟之内联系您',
    //     duration: 3000,
    //   });
    // }
  },
  goMainDetail(){
    my.navigateTo({
        url: '../main-detail/detail?success=0'
    });
  }
});