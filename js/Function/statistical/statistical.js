define([], function() {
    var statistical = {};
    function init(){
        // 日数据
        require(['Function/statistical/dayData'], function (day) {
            statistical.day = day;
        })

        // 月侯旬数据
        require(['Function/statistical/meadow'], function (meadow) {
            statistical.meadow = meadow;
        })

        // 生育期数据
        require(['Function/statistical/growth'], function (growth) {
            statistical.growth = growth;
        })

        require(['Controller/closeAll'], function (closeAll) {
            //统计数据查询-烟草气候资源图
            $('#climateresourceMapA').click(function() {
                closeAll.closeLayer(); 
            });
            $('#soilMapA').click(function() {
                closeAll.closeLayer(); 
            });
        })
    }

       /**
     * 关闭某一功能
     * @param {*} type 功能类型（null时指全部）
     */
    function close(type){
        if(type) {
            if(statistical[type])
            statistical[type].close ? statistical[type].close() : null;
        } else {
            for(var key in statistical) {
                statistical[key].close ? statistical[key].close() : null;
            }
        }
    }
    
    return {
        init:init,
        close: close,
    }
});