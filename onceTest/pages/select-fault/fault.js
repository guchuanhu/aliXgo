const app = getApp();

import fault from '../../template/faultBox/fault-box.js';
const proObj = {
    data: {},
    onReady(){
        var that = this;
        my.httpRequest({
            url: app.data.url + '/?c=AliMini_Mobile&a=Price',
            method: 'POST',
            data: Object.assign({
                skuId: app.data.maintenanceData.phoneColor,
                serverId: app.data.maintenanceData.server.id
            },app.data.userInfo),
            dataType: 'json',
            success: function(res) {
                that.setData({
                    phone: res.data.data
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {
                my.hideLoading();
            }
        });
    },

    phone(e){
        if(!(this.data.fault && this.data.fault.dollar && this.data.fault.dollar.total)){
            return false;
        }

        let arr = [];
        let priArr = [];
        this.data.phone.forEach(function(v){
            if(v.choice){
                v.detail.forEach(function(it,i,a){
                    if(it.choice){
                        arr.push(it.priceId);
                        priArr.push({
                            detailName: it.detailName,
                            noformatPrice: it.noformatPrice,
                            totalF: parseInt(it.noformatPrice/100),//价格整数
                            totalL: (it.noformatPrice/100+'').split('.')[1]||'00',//价格小数
                        });
                    }
                })
            }
        })
        
        app.data.maintenanceData.phoneFault = {
            phone: priArr,//下单页面展示使用
            priceId: arr,//下单页priceids参数
            total: this.data.fault.dollar.total,//总价
        };
        my.navigateTo({
            url: '../maintenance/maintenance'
        });
    }
};
Page(Object.assign(proObj,fault));