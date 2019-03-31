export default {
    openKeys: ["product"],
    menuList: [{
        key: "product",
        name: "产品管理",
        icon: "menu-unfold",
        item: [{
            key: "product-list",
            name: "产品列表"
        }, {
            key: "product-edit",
            name: "编辑产品"
        }, {
            key: "product-SKU",
            name: "产品SKU"
        }]
    // }, {
    //     key: "purchase",
    //     name: "采购管理",
    //     icon: "shop",
    //     item: [{
    //         key: "purchase-count",
    //         name: "销售统计"
    //     }]
    // }, {
    //     key: "AD",
    //     name: "广告管理",
    //     icon: "global",
    //     item: [{
    //         key: "AD-list",
    //         name: "订单列表"
    //     }, {
    //         key: "AD-reject",
    //         name: "拒签率"
    //     }]
    // }, 
    }, {
        key: "order",
        name: "订单管理",
        icon: "line-chart",
        item: [{
            key: "DF-list",
            name: "订单列表"
        // }, {
        //     key: "DF-count",
        //     name: "每日统计"
        // }, {
        //     key: "DF-state",
        //     name: "物流状态统计"
        }]
    // }, {
    //     key: "TF",
    //     name: "TF订单管理",
    //     icon: "stock",
    //     item: [{
    //         key: "TF-list",
    //         name: "订单列表"
    //     }, {
    //         key: "TF-count",
    //         name: "每日统计"
    //     }, {
    //         key: "TF-state",
    //         name: "物流状态统计"
    //     }]
    // }, {
    //     key: "pay",
    //     name: "结款管理",
    //     icon: "dollar",
    //     item: [{
    //         key: "pay-profit",
    //         name: "利润统计"
    //     }]
    // }, {
    //     key: "out",
    //     name: "出库管理",
    //     icon: "car",
    //     item: [{
    //         key: "out-order",
    //         name: "缺货订单"
    //     }]
    }, {
        key: "warehouse",
        name: "库存管理",
        icon: "inbox",
        item: [{
            key: "warehouse-department",
            name: "库存管理"
        }]
    // }, {
    //     key: "edit",
    //     name: "设置",
    //     icon: "setting",
    //     item: [{
    //         key: "edit-info",
    //         name: "个人信息"
    //     }]
    // }
    }]
}