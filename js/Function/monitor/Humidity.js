//live 湿度
define(['Controller/closeAll', 'Function/numberFC/FloatSelector', 'Function/drawgeojson', 'Function/monitor/area_point'],
 function(closeAll, floatSelector, draw, draw_pointInfo) { 
    
    var key;
    var geoJsonLayer;     //图层  
    var layer;     //  气象站图层
    var layer_yanzhan;  //  烟站图层
    var button;     //按钮


    function init(){
        button = $('#live_rh');

        button.click(function(){
            closeAll.closeLayer();
            $('#floatMapDiv2').show();
            getData();
        });

        floatSelector.on('floatMapDiv2', 'click', function(event){
            closeAll.closeLayer();
            $('#floatMapDiv2').show();
            getData();
        });

        XHW.C.MapMove.addZoomCallback(function(){
            if(layer)getData();   //  改变底图层级，刷新图层          
        });
        key = 'live_rh';
    }

    function getData(){    //TODO, 之后更改写法（传递时间，elem固定
        var elem = floatSelector.getValue('floatMapDiv2');
        var time = XHW.time.year + XHW.time.month + XHW.time.day + XHW.time.hour + '0000';
        var param = {
            elem: elem,
            time: time
        }
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', param, function(json){
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            var pubtime = json.time.substring(8,10);
            $('#floatMapDiv2 .floatMapDivTime').html(pubtime+'时');
            let data = json.data;
            if (data) {
                drawGeoJsonInfo(key, data);
            }
        },function(){
            remove();
        });

        //  显示 站点实况信息 
        var ele = elem == 'RH' ? 'RH' :
                    elem == 'AVGRH24' ? 'RHAVG' :
                        elem == 'MAXRH24' ? 'MAXRH' : '';
        var area_param = {
            station: XHW.C.http.zunYi_station,
            ele: ele
        };
        XHW.C.http.get(XHW.C.http.baseUrl, '/currentReal', area_param, function(json){
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                draw_area_station(data,ele);
            }
        });

        //   烟站 实况信息

        var ele_yanzhan =  elem == 'RH' ? 'CRH' :
        elem == 'AVGRH24' ? 'CRHAVG' :
            elem == 'MAXRH24' ? 'MAXCRH' : '';
        var area_param_yan = {
            ele: ele_yanzhan
        };
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getSensorCurrentActually', area_param_yan, function(json){
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                draw_area_yan(data,ele_yanzhan);
            }
        });
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
        var source = draw_pointInfo.drawMark(data,'%',ele);
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

    //  烟站图层
    function draw_area_yan(data,ele) {
        if(!data)return;
        var source = draw_pointInfo.drawMark_yanzhan(data,'%',ele);
        if(!source)return;
        if(!layer_yanzhan){
            layer_yanzhan = new ol.layer.Vector({
                source: source,
            });
            layer_yanzhan.setZIndex(15);
            XHW.map.addLayer(layer_yanzhan);
        }else{
            layer_yanzhan.setSource(source);
        }
    }
    //========================================================================绘制线条部分
    // function drawLine(data){
    //     //step1---------------等值线所在数组
    //     var feature = [];
    //     let textColor = '#fff';
    //     var DefaultColor = null;
    //     if($('#config_map p .current').next().html() == '影像图') {
    //         DefaultColor = "#10A80A";
    //     } else {
    //         DefaultColor = "#10A80A";
    //     }
    //     //step2---------------循环遍历每一条线的数据
    //     for(var i = 0; i < data.lines.length; i++) {
    //         var lineData = data.lines[i];
    //         //step3----------------创建数组记录单条等值线的点
    //         // var lnglats = [];
    //         // for(var j = 0; j < lineData.pointNum; j++) {
    //         //     lnglats.push(ol.proj.fromLonLat([parseFloat(lineData.lng[j]), parseFloat(lineData.lat[j])]));
    //         // }
    //         var lnglats = smoothIsoline(lineData);
    //         if (!lnglats || lnglats.length <= 0)
    //             continue;
    //         var color = DefaultColor ? DefaultColor : "#" + ((1 << 24) + (lineData.lineColor.r << 16)     //颜色转为16进制
    //             + (lineData.lineColor.g << 8) + lineData.lineColor.b).toString(16).slice(1);
    //         //step4-----------------创建地图线对象
    //         var line = new ol.Feature({
    //             geometry: new ol.geom.LineString(lnglats)
    //         });
    //         //step5------------------地图对象加入数组
    //         line.setStyle(buildIsolineStyle(lineData.val + '', lineData.lineWidth, color, textColor, color));
    //         feature.push(line);
    //     }
    //     //step7------------------将所有等值线加入同一个图层
    //     let source = new ol.source.Vector({
    //         features: feature
    //     });

    //     if (!layer) {
    //         layer = new ol.layer.Vector({
            
    //         });
    //         layer.setZIndex(5);
    //         layer.id = key;
    //     }
    //     layer.setSource(source);
        
    //     if ($.inArray(layer, XHW.map.getLayers().getArray()) == -1)
    //     XHW.map.addLayer(layer);
    // }
    //===========================================================绘制结束

    // function remove(){
    //     if(layer) {
    //         XHW.map.removeLayer(layer);
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
        if(layer_yanzhan){
            XHW.map.removeLayer(layer_yanzhan);
            layer_yanzhan = null;  
        }
    }
    init();

    return {
        close: remove
    }
});