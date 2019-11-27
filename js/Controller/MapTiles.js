/**
 * 地图瓦片类
 */
define([], function() {
    //--------------------------谷歌瓦片部分
    // h 文字标注图层
    // m 线划图
    // p 地形图
    // r 线划图
    // s 影像无标注
    // t 地形图 全黑
    // y 影像含标注
    var googleLDTiles = ''; //线划图地图瓦片
    var googleTMTiles = ''; //地形图地图瓦片
    var googleIMTiles = ''; //影像图地图瓦片
    var googleTgTiles = ''; //地图标注瓦片
    googleLDTiles = new ol.layer.Tile({
        source: new ol.source.XYZ({           
            crossOrigin:'anonymous', 
            url:'http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G' 
        }),
        projection: 'EPSG:3857'
    });
    googleTMTiles = new ol.layer.Tile({
        source: new ol.source.XYZ({      
            crossOrigin:'anonymous',      
            url:'http://mt2.google.cn/vt/lyrs=p&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G' 
        }),
        projection: 'EPSG:3857'
    });
    googleIMTiles = new ol.layer.Tile({
        source: new ol.source.XYZ({        
            crossOrigin:'anonymous',    
            url:'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G' 
        }),
        projection: 'EPSG:3857'
    });
    googleTgTiles = new ol.layer.Tile({
        source: new ol.source.XYZ({     
            crossOrigin:'anonymous',      
            url:'http://mt2.google.cn/vt/lyrs=h&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G' 
        }),
        projection: 'EPSG:3857'
    });
    googleTgTiles.setZIndex(14);
    
    //---------------------------百度瓦片部分
    var projection = ol.proj.get("EPSG:3857");
    var tilegrid  = new ol.tilegrid.TileGrid({
        origin: [0,0],
        resolutions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            .map(function(x) { return Math.pow(2, 18-x) })
    });

    var baiduSource = new ol.source.TileImage({
        projection: projection,
        tileGrid: tilegrid,
        tileUrlFunction: function(tileCoord, pixelRatio, proj){
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];
            return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
            // return "http://online1.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20170301&scaler=1&p=1";
        }
    });

    var baidumap = new ol.layer.Tile({
        source: baiduSource
    });
	
    //---------------------------高德瓦片部分
    var gaodeMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:'http://webrd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'      //高德地图在线
        }),
        projection: 'EPSG:3857'
    });
 
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#319FD3',
            width: 1
        })
    });

    // var raster = new ol.layer.Tile({
    //     source: new ol.source.TileJSON({
    //         url: 'https://api.tiles.mapbox.com/v3/mapbox.world-dark.json?secure'
    //     })
    // });

	// 高德地图下的图层
    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: 'https://openlayers.org/en/v4.6.5/examples/data/topojson/world-110m.json',
            format: new ol.format.TopoJSON({
            // don't want to render the full world polygon (stored as 'land' layer),
            // which repeats all countries
            layers: ['countries']
            }),
            overlaps: false
        }),
        // style: style
    });

    //-------------------未知瓦片
    // layers.push(new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://ahocevar.com/geoserver/wms',
    //         params: {
    //             'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
    //             'TILED': true
    //         }
    //     })
    // }));

    var vectorLayer = new DrawVectorLayer('./resources/geojson/world.geojson');
    //--------------------------瓦片操作
    var tile;
    function switchMap(type){
        var myTile;
        googleTgTiles.setVisible(false);
        switch(type){
            case '线划图':
                myTile = googleLDTiles;
                break;
            case '地形图':
                myTile = googleTMTiles;
                break;
            case '影像图':
                myTile = googleIMTiles;
                googleTgTiles.setVisible(true);
                break;
            case '矢量图':
		        myTile = vectorLayer;
                break;
        }
        if(tile) {
            XHW.map.removeLayer(tile);
        }
        // XHW.map.addLayer(myTile);

        XHW.map.getLayers().insertAt(0, myTile) //在第0层 插入图层
        tile = myTile;

         //画遵义各县边界线
        let zunyiVector=new ol.layer.Vector({
            title:"贵州",
            source:new ol.source.Vector({
                projection: 'EPSG:4326',
                url: './resources/geojson/zunyi-line.geojson',
                format:new ol.format.GeoJSON()
            }),
            style:new ol.style.Style({
                stroke: new ol.style.Stroke({ //边界样式
                    color: 'red',
                    width: 2
                })
            })
        });
        XHW.map.getLayers().insertAt(1, zunyiVector);
        // XHW.map.addLayer(googleTgTiles);
    // 测试瓦片
    // var tileGrid = ol.tilegrid.createForProjection('EPSG:4326', undefined, 512, undefined);
    //   var tiled = new ol.layer.Tile({
    //     visible: true,
    //     opacity: 0.5,
    //     source: new ol.source.TileWMS({
    //       url: 'http://192.6.1.109:5355/geoserver/fy4ageoserver/wms',
    //       params: {'FORMAT': "image/png", 
    //                'VERSION': '1.1.1',
    //                tiled: true,
    //             "LAYERS": 'fy4ageoserver:H2A_SM2B20171022Rendering',
    //             "exceptions": 'application/vnd.ogc.se_inimage',
    //          tilesOrigin: -180 + "," + -90,
    //       },
    //       projection:'EPSG:4326',
    //         tileGrid: tileGrid
    //     })
    //   });
    //   XHW.map.addLayer(tiled);
    }
    switchMap('地形图');
    $('#map').css('background', '#AADAff');

    // 地图切换
    $('#config_map span').click(function(event) {
        $(this).addClass('current').siblings().removeClass('current');
    });
    
    return {
        switchMap: switchMap
    }
});