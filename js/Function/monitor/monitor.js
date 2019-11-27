define([], function() {
    var live = {};
    function init(){       
        require(['Function/monitor/profile_live'], function(profile){
            live.profile = profile;
        })

        require(['Function/monitor/station'], function(station){
            live.station = station;
        })

        //气温等值线
        require(['Function/monitor/Temperature'], function (tt) {
            live.tt = tt;
        })

        //湿度等值面
        require(['Function/monitor/Humidity'], function (rh) {
            live.rh = rh;
        })

        //降水等值面
        require(['Function/monitor/Rain'], function (rain) {
            live.rn = rain;
        })

        //高空风功能加载
        require(['Function/monitor/Wind'], function(wind){
            live.wind = wind;
        })

         //土壤温度
         require(['Function/monitor/soilT'], function(st){
            live.st = st;
        })

         // 土壤湿度
         require(['Function/monitor/soilRh'], function(srh){
            live.srh = srh;
        })

         // 适宜度评价
         require(['Function/monitor/suitable'], function(sui){
            live.sui = sui;
        })
    }

       /**
     * 关闭某一功能
     * @param {*} type 功能类型（null时指全部）
     */
    function close(type){
        if(type) {
            if(live[type])
            live[type].close ? live[type].close() : null;
        } else {
            for(var key in live) {
                live[key].close ? live[key].close() : null;
            }
        }
    }
    
    return {
        init:init,
        close: close
    }
});