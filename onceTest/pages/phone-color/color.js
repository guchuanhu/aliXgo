const app = getApp();

Page({
  data: {},
  onReady(){
        var that = this;
        var userInfo = my.getStorageSync({
                        key: 'userInfo'
                    });
        my.httpRequest({
            url: app.data.url + '/?c=AliMini_Mobile&a=Sku',
            method: 'POST',
            data: Object.assign({
                spuId: app.data.maintenanceData.phoneModel.id,
                serverId: app.data.maintenanceData.server.id
            },app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                if(res.data.data.length%2===1){
                    res.data.data.push({id:null,name:' '});
                }
                that.setData({
                    phone: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                my.hideLoading();
                //my.alert({content: 'complete'});
            }
        });
    },

    phone(e){
        if(e.currentTarget.dataset.id===null){
            return false;
        }
        app.data.maintenanceData.phoneColor = e.currentTarget.dataset.id;
        my.navigateTo({
            url: '../select-fault/fault'
        });
    }
});