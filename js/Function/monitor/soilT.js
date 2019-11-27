//live 温度
define(['Controller/closeAll', 'Function/numberFC/FloatSelector', 'Function/drawgeojson', 'Function/monitor/area_point'],
 function(closeAll, floatSelector, draw, draw_pointInfo) {
    var key;
    var button;     //按钮.
    var geoJsonLayer; //图层
    var layer_yanzhan;  //  烟站图层

    function init(){
        button = $('#st');        
        button.click(function(){
            closeAll.closeLayer();
            $('#floatMapDiv .floatMapDivEle').html('土壤温度');
            $('#floatMapDiv').show();
            getData();
        });
        key = 'soil_tt';
    }

    function getData(){ 
        var time = XHW.time.year + XHW.time.month + XHW.time.day + XHW.time.hour + '0000';
        var param = {
            elem: 'ST',
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

        //   烟站 实况信息  暂无数据
        // var area_param_yan = {
        //     ele: 'ST'
        // };
        // XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getSensorCurrentActually', area_param_yan, function(json){
        //     if(json.status_code != 0){
        //         console.log('数据错误');
        //         return;
        //     }              
        //     let data = json.data;
        //     if (data) {
        //         draw_area_yan(data,ele);
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

    function remove(){
        if (geoJsonLayer) {
            XHW.map.removeLayer(geoJsonLayer);
            geoJsonLayer = null;
        }
        // if(layer_yanzhan){
        //     XHW.map.removeLayer(layer_yanzhan);
        //     layer_yanzhan = null;  
        // }
    }

    init();

    return {
        close: remove
    }
});