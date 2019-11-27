//风 功能
define(['Controller/DataFormat', 'Controller/closeAll', 'Function/monitor/Temperature'], function(format, closeAll, tt) {
    
    var key;
    var data;   //方向数据（要根据图层缩放重新绘制，需要记录数据）
    var dataS;  //速度数据
    var data_sta; // 气象站点数据
    var layer_wind;    //流线对象
    var layer_sta;
    var layer_tob;

    function init(){
        XHW.C.MapMove.addZoomCallback(function(){
            if(layer_wind){drawSeaWind();}
            if(layer_sta){drawMark(data_sta,'wea_sta')};
        });

        //  初始界面显示 风场流线图、气温区域图、天气现象图标
        getData();
        key = 'wind';

        $('#profile_live').click(function(){
            closeAll.closeLayer();
            getData();
        })
    }

    function getData(){    //TODO, 之后更改写法（传递时间，elem固定
        data = null;
        dataS = null;
        data_sta = null;

        var time = XHW.time.year + XHW.time.month + XHW.time.day + XHW.time.hour + '0000';
        var param = {
            elem: 'WD',
            time: time
        };

        //  风场
        XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', param, function(json){
            time = format.jsonDate(time);
            data = json.data;

            var paramWs = {
                elem: 'WS',
                time: time
            };
            XHW.C.http.get(XHW.C.http.tobaccoUrl, '/actually/getArea', paramWs, function(json){
                dataS = json.data.vals;
                drawSeaWind();
            });
        });

        //  站点天气图标
        $.ajax({
            url: XHW.C.http.baseUrl + '/currentReal?ele=PHEN&station=' + XHW.C.http.zunYi_station,
            dataType: 'json',
            async: false,
            success: function (res) {
                if(res.status_code != 0){
                    console.log('数据错误');
                    return;
                }              
                data_sta = res.data;
                drawMark(res.data,'wea_sta')
            }
        });
        $.ajax({
            url: XHW.C.http.tobaccoUrl + '/actually/getSensorCurrentActually?ele=PHEN',
            dataType: 'json',
            async: false,
            success: function (res) {
                if(res.status_code != 0){
                    console.log('数据错误');
                    return;
                }              
                drawMarks(res.data,'wea_tob')
            }
        })

        //  区域气温
        $('#floatMapDiv1').show();
        tt.getData();
    }

    //  绘制天气图标
    function drawMark(json,type){
        var markers = [];
        var zoom = XHW.map.getView().getZoom(); //  9-11
        for(var key in json){
            if(zoom < 11 && key.length != 9)continue;
            if(!json[key]['LON'] || !json[key]['LAT'] || !json[key]['PHEN'])continue;
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(json[key]['LON']), parseFloat(json[key]['LAT'])]))
            })
            marker.type = type;
            marker.value = {
                code: key,
                name: json[key]['NAME'],
                lng: json[key]['LON'],
                lat: json[key]['LAT'],
                station_code: json[key]['STATION_METEO']
            };
            var imgSrc = json[key]['PHEN'];
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/halfhour_icon/cww'+imgSrc+'.png',
                    scale: 0.2,
                })),                                        
            }));

            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        if (!layer_sta) {
            layer_sta = new ol.layer.Vector({

            });
            layer_sta.setZIndex(18);
            layer_sta.id = type;
        }
        layer_sta.setSource(source);
        
        if ($.inArray(layer_sta, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layer_sta);
    }
    function drawMarks(json,type){
        var markers = [];
        for(var key in json){
            if(!json[key]['LON'] || !json[key]['LAT'] || !json[key]['PHEN'])continue;
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(json[key]['LON']), parseFloat(json[key]['LAT'])]))
            })
            marker.type = type;
            marker.value = {
                code: key,
                name: json[key]['NAME'],
                lng: json[key]['LON'],
                lat: json[key]['LAT'],
                station_code: json[key]['STATION_METEO']
            };
            var imgSrc = json[key]['PHEN'];
            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    crossOrigin: 'anonymous',
                    src: './img/halfhour_icon/cww'+imgSrc+'.png',
                    scale: 0.2,
                })),                                        
            }));

            markers.push(marker);
        }
        let source = new ol.source.Vector({
            features: markers
        });

        if (!layer_tob) {
            layer_tob = new ol.layer.Vector({

            });
            layer_tob.setZIndex(18);
            layer_tob.id = type;
        }
        layer_tob.setSource(source);
        
        if ($.inArray(layer_tob, XHW.map.getLayers().getArray()) == -1)
        XHW.map.addLayer(layer_tob);
    }

    /**
     * 绘制海浪方向 箭头形式
     * @param {} data 
     */
    function drawSeaWind(){
        //step*---------------查看两组数据是否齐全
        if(!data || !dataS) {
            return;
        }
        windStream();
    }

    //===========================================================风流线部分
    function windStream(){
        var Wdata = [];
        Wdata[0] = TDtoOD(dataS);
        Wdata[1] = TDtoOD(dataS);
        windHead = data;
        Wdata[2] = TDtoOD(data.vals);
        getUV(Wdata);
    }

    /**
     * 二维数组转一维（并且调换顺序）
     */
    function TDtoOD(array){
        var arr = [];
        var length = array[0].length;
        for(var j = length - 1; j >= 0; j--) {
            for(var i = 0; i < array.length; i++) {
                arr.push(array[i][j]);
            }
        }
        return arr;
    }

    /**
     * 
     */
    function showWindStream(Wdata){
        //step1 创建数据对象，设置各组数据配置
        var data = [{
            header: getWindHeader(windHead.slng, windHead.elat, windHead.delta,
                windHead.delta, windHead.colNum, windHead.rowNum, 0, 0), //0,0表示气温
            data:[]
        },{
            header: getWindHeader(windHead.slng, windHead.elat, windHead.delta,
                windHead.delta, windHead.colNum, windHead.rowNum, 2, 2),  //2,2表示u分量
            data:[]
        },{
            header: getWindHeader(windHead.slng, windHead.elat, windHead.delta,
                windHead.delta, windHead.colNum, windHead.rowNum, 2, 3),  //2,3表示v分量
            data:[]
        }];

        //step2 填充数据
        for(var i = 0; i < Wdata[1].length; i++) {
            data[0].data[i] = Wdata[0][i];
            data[1].data[i] = Wdata[1][i];
            data[2].data[i] = Wdata[2][i];
        }

        //step3 创建风流线对象
        var layer = new WindLayer(data, {
            projection: 'EPSG:3857',
            ratio: 1
        })
        layer.id = key;
        layer.setZIndex(15)
        layer.appendTo(XHW.map);
        if(layer_wind){
            layer_wind.clearWind();
        }
        layer_wind = layer;
    }

    /**
     * 获取各组数据相关配置
     * @param {*} lo1   起始经度
     * @param {*} la1   起始纬度
     * @param {*} dx    经度差值
     * @param {*} dy    纬度差值
     * @param {*} nx    经度差值次数
     * @param {*} ny    纬度差值次数
     * @param {*} parameC   参数类别
     * @param {*} parameN   参数标记 
     */
    function getWindHeader(lo1, la1, dx, dy, nx, ny, parameC, parameN){
        return {
            lo1: lo1,    
            la1: la1,     
            dx: dx,      
            dy: dy,      
            nx: nx,      
            ny: ny,      
            refTime: '',             
            forecastTime: 0,
            parameterCategory: parameC,   
            parameterNumber: parameN,     
        };
    }

    /**
     * 数据全部获取后，将风向、风速数组转为uv数组
     */
    function getUV(Wdata) {
        for(var i = 0; i < Wdata[1].length; i++) {
            var ws = Wdata[1][i];
            var wd = Wdata[2][i];
            var val = SDToUV(ws, wd);
            Wdata[1][i] = val[0];  //u
            Wdata[2][i] = val[1];  //v
        }
        showWindStream(Wdata)
    }

    /**
     * 将方向、速度转为uv分量
     * @param {*} ws 
     * @param {*} wd 
     */
    function SDToUV(ws, wd){
        // if(Math.abs(ws-9999)<1e-6||Math.abs(wd-9999)<1e-6)return [0,0];
        var seta = 0;
        if (isDoubleEqual(wd, 0)) return [0, 0];
        if ((wd < 180 && wd > 0) || isDoubleEqual(wd, 360.))
            seta = wd + 180.;
        else if ((wd < 360 && wd >= 180))
            seta = wd - 180.;
        var u = ws * Math.sin(seta * Math.PI / 180.);
        var v = ws * Math.cos(seta * Math.PI / 180.);
        return [u, v];
    }

    function isDoubleEqual(a, b){
         return Math.abs(a-b)<1e-12?true:false;
    }

    //========================================================================风流线结束

    function remove(){
        if(layer_wind) {
            layer_wind.clearWind();
            layer_wind = null;
        }
        if(layer_sta) {
            XHW.map.removeLayer(layer_sta);
            layer_sta = null;
        }
        if(layer_tob) {
            XHW.map.removeLayer(layer_tob);
            layer_tob = null;
        }
    }

    init();

    return {
        close: remove,
    }
});