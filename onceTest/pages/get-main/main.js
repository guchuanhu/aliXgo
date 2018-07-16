const app = getApp();

const proObj = {
  data: {
    text: "获取验证码",
    num: 60
  },
  validSubmit(){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if(!this.data.tel){
      my.showToast({
        type: 'none',
        content: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(!this.data.code){
      my.showToast({
        type: 'none',
        content: '请填写验证码',
        duration: 1600,
      });
      return false;
    }
    my.httpRequest({
      url: app.data.url + '/?c=AliMini_Sms&a=Check',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.tel,
        code: this.data.code,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.code-0 !== 1){
          my.showToast({
            type: 'none',
            content: '验证码错误',
            duration: 1600,
          });
        }else{
          that.submit();
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
  submit() {
    let that = this;
    let obj = {
      name: this.data.name,
      mobileTel: this.data.tel,
      code: this.data.code,
    };
    app.data.getMain = obj;

    my.navigateTo({
      url: '../main-detail/detail?success=1'
    });

  },
  getCode(e) {//请求验证码
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
    if(!myreg.test(this.data.tel)){
      my.showToast({
        type: 'none',
        content: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }

    if(this.data.text!=='获取验证码'){
        return false;
    }

    let co = setInterval(()=>{
      if(this.data.num > 1 ){
          this.setData({
            num: this.data.num - 1
          });
          this.setData({
            text: "请"+this.data.num+"秒后重新获取"
          });
      }else{
        this.setData({
          num: 60
        });
        this.setData({
          text: "获取验证码"
        });
        clearInterval(co);
      }
    }, 1000);

    my.httpRequest({
      url: app.data.url + '/?c=AliMini_Sms',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.tel
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.status == '10010'){
          my.showToast({
            type: 'none',
            content: res.data.message,
            duration: 1600,
          });
          return false;
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
  onShow() {
    
  },
  goStoreSearch() {
    // if(e.currentTarget.dataset.id===null){
    //     return false;
    // }
    my.navigateTo({
      url: '../store-search/search'
    });
  },
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
};

Page(proObj);