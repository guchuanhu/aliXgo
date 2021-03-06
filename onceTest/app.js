App({
    data:{
        location: null,//经纬度信息
        systemInfo: null,//支付宝接口获得的手机型号
        maintenanceData: {
            location: null,//城市信息由location-box提供
            selectModel: {},//品牌ID（manuId）  由select-model提供
            phoneModel: {},//型号(系列ID)[spuId] 由phone-model提供
            phoneColor: null,//颜色 (型号ID)【skuId】 由phone-color提供
            phoneFault: null,//故障 （priceIds）由phone-fault提供
            server: null,//服务中心ID+name （serverId）由store-search提供
        },
        //url:"http://xgoapi.hanjian.test.zol.com.cn",
        url:"http://api.xgo.cn"//接口头
    },
    userInfo: null,
    fn(){
        if(this.data.back){//maintenance页面调用，前往下单成功页面
             my.navigateTo({
                url: '../main-success/success'
            });
        }
    }




});
