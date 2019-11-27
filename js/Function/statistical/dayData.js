define(['Function/forecast/single_fc', 'Controller/closeAll'], function(station, closeAll) {
    var type;

    function init(){
        type = 'day_point';

        //------------鼠标指向marker的监听      
        XHW.C.mouse.addCallback(type, function(value){
            return station.getPopupHtml(value);
        });
        XHW.C.mapclick.addCallback(type, function(value){
            $('#dayDataCon').show();
            $('#dayDataCon .top .title').html(value.name);
            getData(value.station_code);          
        })       
        $('#daydata, #nav1_statis').click(function(){    
            closeAll.closeLayer();         
            
            //  加载 生育期页面
            $('#dayDataDiv').load('dayData.html',function(){
                dragPanelMove("#dayDataCon .top","#dayDataCon");
                dayDataCon();
            });
            $('#daydata').parent().parent().parent().addClass('current').siblings().removeClass('current');
            $('#daydata').parent().parent().siblings('div').show();
            $('#daydata').parent().parent().show();
            $('#daydata').parent().addClass('currenterJiBtn').siblings().removeClass('currenterJiBtn');
            station.getData(type);  // 画站点         
        })
    }
    
    init();

    function getData(value){
        var param = {
            // station: '54511',
            station: value,
        }
        //月数据
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/climate/selectHistoryDayData', param, function(json){ 
            var time = XHW.time.year + '-' + XHW.time.month + '-' + XHW.time.day + ' 00:00:00';
            var json = json.data[time];
        
            $('#dayDataCon .con li .val1').html(json['AVG_SSD']+'h');
            $('#dayDataCon .con li .val2').html(json['PER_SSD']+'%');
            $('#dayDataCon .con li .val3').html(json['AVG_AT']+'℃');
            $('#dayDataCon .con li .val4').html(json['EXTMAX_AT']+'℃');
            $('#dayDataCon .con li .val5').html(json['EXTMIN_AT']+'℃');
            $('#dayDataCon .con li .val6').html(json['GE35_DAYS']+'天');
            $('#dayDataCon .con li .val7').html(json['AVG_PRE20_20']+'mm');
            $('#dayDataCon .con li .val8').html(json['AVGMAX_PRE20_20']+'mm');
            $('#dayDataCon .con li .val9').html(json['PRE20_20_DAYS']+'天');
            $('#dayDataCon .con li .val10').html(json['AVG_WS']+'°');
            $('#dayDataCon .con li .val11').html(json['GE10_DAYS']+'天');
            $('#dayDataCon .con li .val12').html(json['EXTMAX_WS']+'级');
            $('#dayDataCon .con li .val13').html(json['EXTMAX_WS_WD']+'°');
            $('#dayDataCon .con li .val14').html(json['EXTMAX_WS_YEAR']+'年');
            $('#dayDataCon .con li .val15').html(json['AVG_LP']+'hPa');
        },function(){
            $('#dayDataCon .con li .val').html('--');
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
});