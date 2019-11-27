require.config({
    baseUrl : "js/"
});

var XHW = { //xinhong Web服务总对象
    C: {},  //控制对象集合
    F: {},  //功能对象集合
    config: {},
    time:{}
};

function loadConfig() {
    console.info("加载完成");
    ol.control.FullScreen.requestFullScreen(document.body);
}

require([],function(){

    XHW.config.mapType = '影像图';
    XHW.config.fullscreen = true;

	//时间轴初始化
	sliderBar.init(function(time) {
       var nTime = new Date(time);
	   XHW.silderTime = {
           year : nTime.getFullYear(),
		   month : nTime.getMonth() + 1,
		   day: nTime.getDate(),
		   hour: nTime.getHours(),
       };
       if(XHW.silderTime.month < 10) XHW.silderTime.month = '0' + XHW.silderTime.month;
       if(XHW.silderTime.day < 10) XHW.silderTime.day = '0' + XHW.silderTime.day;
       if(XHW.silderTime.hour < 10) XHW.silderTime.hour = '0' + XHW.silderTime.hour;
    });

    let fullScreen = new ol.control.FullScreen({'source': document.body});
    XHW.map = new ol.Map({
        target: 'map',
        controls: [fullScreen],
        view: new ol.View({
            // center: ol.proj.transform([116.26, 39.9], 'EPSG:4326', 'EPSG:3857'),
            center: ol.proj.transform([106.83, 28.23], 'EPSG:4326', 'EPSG:3857'),
            zoom: 9,
            minZoom: 8,
        })
    });
    fullScreen.on('change', function(){
        XHW.config.fullscreen = ol.control.FullScreen.isFullScreen();
        console.info("全屏显示：" + XHW.config.fullscreen);
    });

    loadControllers(); 

    function loadControllers() {
        require(['Controller/MapTiles',
            'Controller/Http',
            'Controller/MouseMoveAtFeature',
            'Controller/MapClick',
            'Controller/MapMove',
            'Controller/LayerControl',
            'Controller/layout',
            'Controller/button_menu',
            'Controller/publicClass'], function(tile, http, m, click, move, l, layout, menu, pub){

            //-----------------地图瓦片功能
            XHW.C.tile = tile;
            //------------网络请求
            XHW.C.http = http;
            //--------加载鼠标指向目标的监听
            XHW.C.mouse = m;
            //--------地图点击事件
            XHW.C.mapclick = click;
            //--------加载地图拖动/缩放的监听
            XHW.C.MapMove = move;
            //------------图层控制
            XHW.C.layerC = l;
            //-------------布局交互
            XHW.C.layout = layout;
            //-------------菜单栏按钮
            XHW.C.menu = menu;

            //--------------公共类
            XHW.C.public = pub;

            requireXHWF();
        });
    }

    //=============================功能部分========================================
    function requireXHWF(){
        require(['Function/monitor/monitor'], function(monitor){
            XHW.F.monitor = monitor;
            XHW.F.monitor.init();
        });
        require(['Function/forecast/forecast'], function(forecast){
            XHW.F.forecast = forecast;
            XHW.F.forecast.init();
        });
        require(['Function/warn/warn'], function(warn){
            XHW.F.warn = warn;
            XHW.F.warn.init();
        });
        require(['Function/statistical/statistical'], function(statistical){
            XHW.F.statistical = statistical;
            XHW.F.statistical.init();
        });
    }
});