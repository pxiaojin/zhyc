define(['Function/monitor/station', 'Controller/closeAll'], function(station, closeAll) {
    function init(){
        // XHW.C.mouse.addCallback('init_tobacco', function(value){
        //     return station.getPopupHtml(value);
        // });
        // XHW.C.mouse.addCallback('init_meteo', function(value){
        //     return station.getPopupHtml(value);
        // });

        //生长环境监测  适宜度评价
        //------------鼠标指向marker的监听      
        // XHW.C.mouse.addCallback('sui_sta_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        // XHW.C.mouse.addCallback('sui_tob_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback('sui_sta_point', function(value){
            $('#suitabilityCon').show();
            $('#suitabilityCon .top .title').html(value.name);
            getData(value.code,false);           
        });    
        XHW.C.mapclick.addCallback('sui_tob_point', function(value){
            $('#suitabilityCon').show();
            $('#suitabilityCon .top .title').html(value.name);
            getData(value.code,false);           
        });    
        $('#suitable').click(function(){    
            closeAll.closeLayer();         
            
            // 生长环境监测-适宜度评价弹出框
            $('#shiYiDuDiv').load('suitability.html',function(){
                dragPanelMove("#suitabilityCon .top","#suitabilityCon");
                suitabilityCon();
            });

            station.getData('sui_sta_point','sui_tob_point');  // 画站点         
        })

        //适宜度预报
        //------------鼠标指向marker的监听      
        // XHW.C.mouse.addCallback('suiFc_sta_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        // XHW.C.mouse.addCallback('suiFc_tob_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback('suiFc_sta_point', function(value){
            $('#suitabilityCon').show();
            $('#suitabilityCon .top .title').html(value.name);
            getData(value.code,true);           
        });    
        XHW.C.mapclick.addCallback('suiFc_tob_point', function(value){
            $('#suitabilityCon').show();
            $('#suitabilityCon .top .title').html(value.name);
            getData(value.code,true);           
        });    
        $('#fc_sui').click(function(){    
            closeAll.closeLayer();         
            
            // 生长环境监测-适宜度评价弹出框
            $('#shiYiDuDiv').load('suitability.html',function(){
                dragPanelMove("#suitabilityCon .top","#suitabilityCon");
                suitabilityCon();
            });

            station.getData('suiFc_sta_point','suiFc_tob_point');  // 画站点         
        })

        // 农事活动预报
        // XHW.C.mouse.addCallback('farm_sta_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        // XHW.C.mouse.addCallback('farm_tob_point', function(value){
        //     return station.getPopupHtml(value);
        // });
        XHW.C.mapclick.addCallback('farm_sta_point', function(value){
            $('#farmingActivityCon').show();
            $('#farmingActivityCon .top .title').html(value.name);
            getFarmData(value.code);           
        });    
        XHW.C.mapclick.addCallback('farm_tob_point', function(value){
            $('#farmingActivityCon').show();
            $('#farmingActivityCon .top .title').html(value.name);
            getFarmData(value.code);           
        }); 
        $('#fc_farm').click(function(){    
            closeAll.closeLayer();         
            
            // 农用天气预报-农事活动预报
            $('#farmingActivityDiv').load('farmingActivity.html',function(){
                dragPanelMove("#farmingActivityCon .top","#farmingActivityCon");
                farmingActivityCon();
            });

            station.getData('farm_sta_point','farm_tob_point');  // 画站点         
        })
    }

    init();

    function getData(code,key){
        var param = {
            stationId: '101260215',
            // stationId: code,
        };

        var urlStr = key == false ? '/actually/getComfortDataByStationId' : '/forecast/getGrowComfortData';

        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, urlStr, param, function(json){ 
            var json = json.data;       
            $('#suitabilityCon .con ul .temp_sui').html(json.temp);
            $('#suitabilityCon .con ul .temp_info').html(json.temp_info);
            $('#suitabilityCon .con ul .water_sui').html(json.water);
            $('#suitabilityCon .con ul .water_info').html(json.water_info);
            $('#suitabilityCon .con ul .light_sui').html(json.light);
            $('#suitabilityCon .con ul .light_info').html(json.light_info);
            $('#suitabilityCon .con ul .com_sui').html(json.composite);
            $('#suitabilityCon .con ul .com_info').html(json.composite_info);
        })
    }

    //  农事活动预报数据
    function getFarmData(code){
        var param = {
            stationId: '101260215',
            // stationId: code,
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/forecast/getFarmComfortData', param, function(json){ 
            var json = json.data;       
            $('#farmingActivityCon .con ul .ridg').html(json.ridging);
            $('#farmingActivityCon .con ul .ridg_info').html(json.ridging);
            $('#farmingActivityCon .con ul .transplant').html(json.transplant);
            $('#farmingActivityCon .con ul .transplant_info').html(json.transplant_info);
            $('#farmingActivityCon .con ul .apply').html(json.apply);
            $('#farmingActivityCon .con ul .apply_info').html(json.apply_info);
            $('#farmingActivityCon .con ul .spray').html(json.spray);
            $('#farmingActivityCon .con ul .spray_info').html(json.spray_info);
            $('#farmingActivityCon .con ul .pinch').html(json.pinch);
            $('#farmingActivityCon .con ul .pinch_info').html(json.pinch_info);
            $('#farmingActivityCon .con ul .pick').html(json.pick);
            $('#farmingActivityCon .con ul .pick_info').html(json.pick_info);
        })
    }

    /**
     * 删除图层
     */
    function remove(){  
        station.close();
    }

    return {
        close: remove,
    }
})