//live 降水
define(['Controller/closeAll', 'Function/numberFC/FloatSelector', 'Function/drawgeojson', 'Function/monitor/area_point'],
 function(closeAll, floatSelector, draw, draw_pointInfo) { 
    var key;
    var button;     //按钮.
    var geoJsonLayer; //图层
    var layer_yanzhan;  //  烟站图层

    function init(){
        button = $('#srh');       
        button.click(function(){
            closeAll.closeLayer();
            $('#floatMapDiv .floatMapDivEle').html('土壤相对湿度');
            $('#floatMapDiv').show();
            getData();
        });
        key = 'soil_rh';
    }

    function getData(){ 
        var time = XHW.time.year + XHW.time.month + XHW.time.day + XHW.time.hour + '0000';
        var param = {
            elem: 'SRH',
            time: time
        }
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', param, function(json){
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

        //   烟站 实况信息
        var area_param_yan = {
            ele: 'SRH'
        };
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getSensorCurrentActually', area_param_yan, function(json){
            if(json.status_code != 0){
                console.log('数据错误');
                return;
            }              
            let data = json.data;
            if (data) {
                draw_area_yan(data,ele);
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
    //========================================================================绘制拼接图片部分
    // function drawGfsRN(data){
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
    //                 url: XHW.C.http.imgUrl + data.url + data.files[i] + '.mkt',
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