const app = getApp();

let home = Page({
    data: {
        serverLocationFirst: {
            mark: true,
            data: null
        },
        flashHome: false
    },
    onShow() {// 小程序初始化
        if(app.data.searchFlash){
            this.setData({//没能成功定位
                store: app.data.location
            });
            if(app.data.location.length===0){
                this.onLoad();//重新刷新页面
            }
            app.data.searchFlash = false;
        }
        
    },
    onLoad(){
        my.getSystemInfo({//获取手机型号
            success: (res) => {
                this.setData({
                    systemInfo: res
                })
            }
        });

        my.getLocation({//经纬度信息
            success: (res) =>{
                app.data.location = res;
            },
            fail:() =>{
                app.data.location = {accuracy: 15, latitude: 39.983839, longitude: 116.31433};
                console.log({ title: '定位失败' });
            },
        });
        

        my.getAuthCode({
            scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base auth_zhima
            success: (res) => {
                if (res.authCode) {
                    
                    my.httpRequest({
                        url: app.data.url+'/?c=AliMini_Auth', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                        data: {
                            authcode: res.authCode
                        },
                        method: 'POST',
                        dataType: 'json',
                        success: (res) => {

                            var xgoJson = res.data;
                            if (xgoJson.status == 200) {
                                app.data.userInfo = {//两种存入方式
                                    userId: xgoJson.data.userId,
                                    password: xgoJson.data.password,
                                };
                                this.getLoca();
                            }
                        },
                        fail: (res) => {
                            // 根据自己的业务场景来进行错误处理
                            console.log(res)
                        }, 
                    });
                }
            },
            fail:(e) =>{
                console.log(e);
            },
        });
    },
    getLoca(){
        let that = this;
        let obj = {
                longitude: app.data.location.longitude,
                dimension: app.data.location.latitude,
            };
        my.httpRequest({
            url: app.data.url + '/?c=AliMini_Server&a=GetServer',
            method: 'POST',
            data: Object.assign(obj,app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                if(res.data.status==200){
                    that.setData({
                        store: res.data.data
                    });
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: res.data.data.pId,
                        cId: res.data.data.cId,
                        aId: res.data.data.aId,
                        name: res.data.data.name,
                    };

                    app.data.location.name =  res.data.data.name;
                    app.data.location.address =  res.data.data.address;
                    app.data.location.telPhone =  res.data.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: res.data.data.serverId,
                        name: res.data.data.name,
                        repairType: res.data.data.repairType,
                    };
                    if(that.data.serverLocationFirst.mark){//第一次获取位置和维修中心信息
                        that.data.serverLocationFirst.data = res.data.data;
                        that.data.serverLocationFirst.mark = false;
                    }
                }else{
                    that.setData({
                        store: that.data.serverLocationFirst.data
                    });
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: that.data.serverLocationFirst.data.pId,
                        cId: that.data.serverLocationFirst.data.cId,
                        aId: that.data.serverLocationFirst.data.aId,
                        name: that.data.serverLocationFirst.data.name,
                    };

                    app.data.location.name =  that.data.serverLocationFirst.data.name;
                    app.data.location.address =  that.data.serverLocationFirst.data.address;
                    app.data.location.telPhone =  that.data.serverLocationFirst.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: that.data.serverLocationFirst.data.serverId,
                        name: that.data.serverLocationFirst.data.name,
                        repairType: that.data.serverLocationFirst.data.repairType,
                    };
                }
            },
            fail: function(res) {
                    that.setData({
                        store: that.data.serverLocationFirst.data
                    });
                    
                    app.data.maintenanceData.location = {//下单需要的地理位置信息
                        pId: that.data.serverLocationFirst.data.pId,
                        cId: that.data.serverLocationFirst.data.cId,
                        aId: that.data.serverLocationFirst.data.aId,
                        name: that.data.serverLocationFirst.data.name,
                    };

                    app.data.location.name =  that.data.serverLocationFirst.data.name;
                    app.data.location.address =  that.data.serverLocationFirst.data.address;
                    app.data.location.telPhone =  that.data.serverLocationFirst.data.telPhone;

                    app.data.maintenanceData.server = {//下单需要的维修中心信息
                        id: that.data.serverLocationFirst.data.serverId,
                        name: that.data.serverLocationFirst.data.name,
                        repairType: that.data.serverLocationFirst.data.repairType,
                    };
            },
            complete: function(res) {
                my.hideLoading();
                //my.alert({content: 'complete'});
            }
        });
    },
    selfGone(){
        app.data.userInfo = {
            password: app.data.userInfo.password,
            userId: app.data.userInfo.userId,
        }
        my.navigateTo({
            url: '../select-model/model'
        })
    },
    selfLocation(){
        my.navigateTo({
            url: '../store-search/search'
        })
    },
    selfSingle(){
        my.navigateTo({
            url: '../quick-single/single'
        })
    },
    goGetMain() {
        my.navigateTo({
            url: '../get-main/main'
        });
    }

});