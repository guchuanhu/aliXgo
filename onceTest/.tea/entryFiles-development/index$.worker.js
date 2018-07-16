require('./config$');

function success() {
require('../..//app');
require('../../pages/home/home');
require('../../pages/maintenance/maintenance');
require('../../pages/main-success/success');
require('../../pages/get-main/main');
require('../../pages/main-detail/detail');
require('../../pages/quick-single/single');
require('../../pages/select-fault/fault');
require('../../pages/phone-color/color');
require('../../pages/phone-model/phone');
require('../../pages/select-model/model');
require('../../pages/store-search/search');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
