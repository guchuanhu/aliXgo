const app = getApp();
import pick from '../../template/pickerBox/picker-box.js';
import cat from '../../template/locationBox/location-box.js';
const proObj = {
  data: {
    maintenanceData: app.data.maintenanceData,//接收前几个页面传过来的维修信息
    mainten: {
      detail: [
        {
          name: "上门维修",
          id: "S",
          word: "急速响应，准时上门",
          num: 60,
          text: "获取验证码",
        },
        {
          name: "预约到店",
          id: "D",
          word: "通道免排队",
          num: 60,
          text: "获取验证码",
        },
        {
          name: "邮寄维修",
          id: "J",
          word: "全程包邮",
          num: 60,
          text: "获取验证码",
        },
      ],
      choice: 0
    },
    customer: {
      S: {
        name: null,
        tel: null,
        code: null,//验证码
        address: null,
        time: null,
        other: null,//备注
        cat: null//地址信息
      },
      D: {
        name: null,
        tel: null,
        code: null,//验证码
      },
      J: {
        name: null,
        tel: null,
        code: null,//验证码

        address: null,
        imei: null,
        other: null,//备注
        cat: null,//发件地址地址信息
      },
      cat: [],//存储不同的cat
    }
  },
  validSubmit(){
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if(!this.data.customer[whichChoice].name){
      my.showToast({
        type: 'none',
        content: '请填写联系人',
        duration: 1600,
      });
      return false;
    }
    if(!myreg.test(this.data.customer[whichChoice].tel)){
      my.showToast({
        type: 'none',
        content: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }
    if(!this.data.customer[whichChoice].code){
      my.showToast({
        type: 'none',
        content: '请填写验证码',
        duration: 1600,
      });
      return false;
    }

    if (whichChoice === "S") {
      if(!(this.data.customer.cat[0]&&this.data.customer.cat[0].item.id[0])){
        my.showToast({
          type: 'none',
          content: '请选择区域',
          duration: 1600,
        });
        return false;
      }
      if(!(this.data.currentPicker&&this.data.currentPicker[0].id)){
        my.showToast({
          type: 'none',
          content: '请选择上门时间',
          duration: 1600,
        });
        return false;
      }
      if(!this.data.customer[whichChoice].address){
        my.showToast({
          type: 'none',
          content: '请填写详细地址',
          duration: 1600,
        });
        return false;
      }
    }

    if (whichChoice === "J") {
      if(!(this.data.customer.cat[1]&&this.data.customer.cat[1].item.id[0])){
        my.showToast({
          type: 'none',
          content: '请选择区域',
          duration: 1600,
        });
        return false;
      }
      if(!this.data.customer[whichChoice].address){
        my.showToast({
          type: 'none',
          content: '请填写详细地址',
          duration: 1600,
        });
        return false;
      }
    }

    my.httpRequest({
      url: app.data.url + '/?c=AliMini_Sms&a=Check',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.customer[whichChoice].tel,
        code: this.data.customer[whichChoice].code,
      },app.data.userInfo),
      dataType: 'json',
      success: function (res) {
        if(res.data.data.code-0 !== 1){
          my.showToast({
            type: 'none',
            content: '验证码错误',
            duration: 1600,
          });
          return false;
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
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let that = this;
    let obj = {
      serverId: app.data.maintenanceData.server.id,
      manuId: app.data.maintenanceData.selectModel.id,
      spuId: app.data.maintenanceData.phoneModel.id,
      skuId: app.data.maintenanceData.phoneColor,
      priceIds: app.data.maintenanceData.phoneFault.priceId.join(','),

      orderType: whichChoice,

      name: this.data.customer[whichChoice].name,
      mobileTel: this.data.customer[whichChoice].tel,
      code: this.data.customer[whichChoice].code,
    };
    if (whichChoice === "S") {
      obj.pId = this.data.customer.cat[0].item.id[0];
      obj.cId = this.data.customer.cat[0].item.id[1];
      obj.aId = this.data.customer.cat[0].item.id[2];

      obj.address = this.data.customer[whichChoice].address;
      obj.time = this.data.currentPicker[0].id;
      obj.remark = this.data.customer[whichChoice].other;
    } else if (whichChoice === "J") {
      obj.pId = this.data.customer.cat[1].item.id[0];
      obj.cId = this.data.customer.cat[1].item.id[1];
      obj.aId = this.data.customer.cat[1].item.id[2];

      obj.imei = this.data.customer[whichChoice].imei;
      obj.address = this.data.customer[whichChoice].address;
      obj.remark = this.data.customer[whichChoice].other;
    }
    my.httpRequest({//提交订单
        url: app.data.url + '/?c=AliMini_Order',
        method: 'POST',
        data: Object.assign(obj,app.data.userInfo),
        dataType: 'json',
        success: function (res) {
          if(res.data.status-0 === 200){
            app.data.main = {
              name: that.data.mainten.detail[that.data.mainten.choice].name,
              sn: res.data.data.sn,
              total: app.data.maintenanceData.phoneFault.total,
              totalF: parseInt(app.data.maintenanceData.phoneFault.total/100),//价格整数
              totalL: (app.data.maintenanceData.phoneFault.total/100+'').split('.')[1]||'00',//价格小数
              whichChoice: whichChoice
            };
            app.data.back = true;
            my.navigateBack({
              delta: 5
            });
            app.fn();
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
  getCode(e) {//请求验证码
    let whichChoice = this.data.mainten.detail[this.data.mainten.choice].id;
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
    if(!myreg.test(this.data.customer[whichChoice].tel)){
      my.showToast({
        type: 'none',
        content: '请填写正确的手机号',
        duration: 1600,
      });
      return false;
    }

    if(this.data.mainten.detail[this.data.mainten.choice].text!=='获取验证码'){
        return false;
      }
      
      let indeForChoice = this.data.mainten.choice;

    let co = setInterval(()=>{
      if(this.data.mainten.detail[indeForChoice].num > 1 ){
          this.setData({
            ["mainten.detail["+indeForChoice+"].num"]: this.data.mainten.detail[indeForChoice].num - 1
          });
          this.setData({
            ["mainten.detail["+indeForChoice+"].text"]: "请"+this.data.mainten.detail[indeForChoice].num+"秒后重新获取"
          });
      }else{
        this.setData({
          ["mainten.detail["+indeForChoice+"].num"]: 60
        });
        this.setData({
          ["mainten.detail["+indeForChoice+"].text"]: "获取验证码"
        });
        clearInterval(co);
      }
    }, 1000);

    my.httpRequest({
      url: app.data.url + '/?c=AliMini_Sms',
      method: 'POST',
      data: Object.assign({
        mobileTel: this.data.customer[whichChoice].tel
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
    this.init(6, this);//pick初始化
    this.catInit();//cat初始化

    this.setData({//更换门店返回时，刷新门店信息
      'maintenanceData.server': app.data.maintenanceData.server
    });
    
    if(!app.data.maintenanceData.server){//当没有数据的时候自己获取数据，选择维修中心没有数据的时候会没有数据
      this.getServer();
    }
  },
  showFault() {//暂时多条维修信息
    if (this.data.phoneFault) {
      this.setData({
        phoneFault: false
      });
    } else {
      this.setData({
        phoneFault: true
      });
    }
  },
  goStoreSearch() {
    my.navigateTo({
      url: '../store-search/search'
    });
  },
  changeMainten(e) {
    this.setData({
      'mainten.choice': e.currentTarget.dataset.index
    });

  },
  bindData(e) {
    let name = e.currentTarget.dataset.set;
    this.setData({
      [name]: e.detail.value
    });
  },
  getServer(){
      let that = this;

    my.getLocation({//经纬度信息
        success: (res) =>{
          that.getLoca(res);
        },
        fail:() =>{
            that.getLoca({accuracy: 15, latitude: 39.983839, longitude: 116.31433});
            console.log({ title: '定位失败' });
        },
    });
  },
  getLoca(location){
      let that = this;
      let obj = {
              longitude: location.longitude,
              dimension: location.latitude,
          };
      my.httpRequest({
          url: app.data.url + '/?c=AliMini_Server&a=GetServer',
          method: 'POST',
          data: Object.assign(obj,app.data.userInfo),
          dataType: 'json',
          success: function(res) {
              if(res.data.status==200){
                  that.setData({
                      'maintenanceData.server': res.data.data,
                      'maintenanceData.server.id': res.data.data.serverId
                    });
                    app.data.maintenanceData.server = res.data.data;
                    app.data.maintenanceData.server.id = res.data.data.serverId;
                    app.data.location = res.data.data;
              }
          },
          fail: function(res) {

          },
          complete: function(res) {
              my.hideLoading();
              //my.alert({content: 'complete'});
          }
      });
  },
};

Page(Object.assign(proObj, pick, cat));