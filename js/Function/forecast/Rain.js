//ecmf 降水
define(['Controller/closeAll', 'Function/drawgeojson', 'Function/numberFC/FloatSelector', 'Function/monitor/area_point'],
 function(closeAll, draw, floatSelector, draw_pointInfo) { 
    
    var key;
    var geoJsonLayer;     //图层
    var button;     //按钮
    var layer;     //  站点图层

    function init(){
        button = $('#fc_rn');

        button.click(function(){
            closeAll.closeLayer();
            // $('#floatMapDiv .floatMapDivEle').html('降水量');
            $('#floatMapDiv7 .one_date').addClass('currentOrange').siblings().removeClass('currentOrange');
            $('#floatMapDiv7').show();
            // $('.slibarDiv').show();
            getData();
        });
        // sliderBar.addCallback(function(){
        //     if(button.parent().hasClass('current')) getData();
        // });
        floatSelector.on('floatMapDiv7', 'click', function(event){
            closeAll.closeLayer();
            $('#floatMapDiv7').show();
            getData();
        }); 
        // XHW.C.MapMove.addZoomCallback(function(){
        //     if(layer)getData();   //  改变底图层级，刷新图层          
        // });
        key = 'fc_rn';
    }

    function getData(){ 
        var year = $('#floatMapDiv7 span.currentOrange').attr('data-Year');
        var month = $('#floatMapDiv7 span.currentOrange').attr('data-month');
        var day = $('#floatMapDiv7 span.currentOrange').attr('data-value');
        var time = year + month + day + XHW.time.hour + '0000';
        // var time = XHW.silderTime.year + '' + XHW.silderTime.month + '' + XHW.silderTime.day + '' + XHW.silderTime.hour +'0000';
        var param = {
            elem: 'RAIN24',
            time: time
        }
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/forecast/getArea', param, function(json){       
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                drawGeoJsonInfo(key, data);
            }
        },function(){
            remove();
        });

        //  显示 站点实况信息           暂无降水数据
        // var vtiAr = [0,24,48,72,96,120,144];
        // var vti_indxe = $('#floatMapDiv6 span.currentOrange').index();
        // var area_param = {
        //     station: XHW.C.http.zunYi_station,
        //     ele: ele,
        //     vti: vtiAr[vti_indxe]
        // };
        // XHW.C.http.get(XHW.C.http.baseUrl, '/currentForcast', area_param, function(json){
        //     if(json.status_code != 0){
        //         console.log('数据错误');
        //         return;
        //     }              
        //     let data = json.data;
        //     if (data) {
        //         draw_area_station(data,ele);
        //     }
        // });
    }

    function drawGeoJsonInfo(key, resultgeojson) {
        if (!resultgeojson)
            return;
        var resfeatures = draw.buildFeatures(key, resultgeojson);
        if (!resfeatures){
            return;
        }
        let source = new ol.source.Vector({
            features: resfeatures,
        });
        if (!geoJsonLayer) {
            geoJsonLayer = new ol.layer.Vector({
                title: '预报区域预警',
                source: source,
            });            
            XHW.map.addLayer(geoJsonLayer);
            geoJsonLayer.id = key;
        } else {
            geoJsonLayer.setSource(source);
        }
    }

    //  气象站图层
    function draw_area_station(data,ele) {
        if(!data)return;
        var source = draw_pointInfo.drawMark(data,'℃',ele);
        if(!source)return;
        if(!layer){
            layer = new ol.layer.Vector({
                source: source,
            });
            layer.setZIndex(15);
            XHW.map.addLayer(layer);
        }else{
            layer.setSource(source);
        }
    }
    //========================================================================绘制拼接图片部分
    // function drawecmfRN(data){
    //     var slat = data.elat;
    //     var slng = data.slng;
    //     var elat = data.slat;
    //     var elng = data.elng;
    //     var xD = Math.abs(elng - slng) / data.col;
    //     var yD = Math.abs(elat - slat) / data.row;
    //     tLayers = [];

    //     for(var i = 0; i < data.files.length; i++){
    //         //！！！图片排列方式为从地图左上角至右下角
    //         var x = data.files[i].split('_')[1].split('.')[0];
    //         var y = data.files[i].split('_')[0];

    //         //贴图方式为左下角至右上角
    //         var start = ol.proj.fromLonLat([slng + x * xD, slat - (parseInt(y) + 1) * yD]);
    //         var end = ol.proj.fromLonLat([slng + (parseInt(x) + 1) * xD, slat - y * yD]);
    //         var extent = [start[0], start[1], end[0], end[1]];
    //         // console.log((slng + x * xD) + '  ' + (slat - (parseInt(y) + 1) * yD) + '  ' + (slng + (parseInt(x) + 1) * xD) + ' ' + (slat - y * yD));
           
    //         tLayers.push(new ol.layer.Image({
    //             source: new ol.source.ImageStatic({
    //                 url: XHW.C.http.ecmfImgUrl + data.url + data.files[i] + '.mkt',
    //                 imageExtent: extent
    //             })
    //         }));

    //         tLayers[i].setZIndex(1);
    //         tLayers[i].setOpacity(0.7);
    //         XHW.map.addLayer(tLayers[i]);
    //         tLayers[i].id = key;
    //     }

    //     //------------------判断当前是否有旧图层，有则替换
    //     if(layer && layer.length > 0){
    //         remove();
    //     }
    //     layer = tLayers;
    // }
    //===========================================================绘制结束

    // function remove(){
    //     if(layer) {
    //         for(var i in layer) {
    //             XHW.map.removeLayer(layer[i]);
    //         }
    //         layer = null;
    //     } 
    // }
    function remove(){
        if (geoJsonLayer) {
            XHW.map.removeLayer(geoJsonLayer);
            geoJsonLayer = null;
        }
        if(layer){
            XHW.map.removeLayer(layer);
            layer = null;  
        }
    }
    
    init();

    return {
        close: remove
    }
});