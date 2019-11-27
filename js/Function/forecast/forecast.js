define(['Controller/publicClass'], function(getDate) {
    var forecast = {};
    function init(){
        //气温等值线
        require(['Function/forecast/Temperature'], function (tt) {
            forecast.tt = tt;
        })

        require(['Function/forecast/maxTem'], function (maxt) {
            forecast.maxt = maxt;
        })

        require(['Function/forecast/minTem'], function (mint) {
            forecast.mint = mint;
        })

        //降水等值面
        require(['Function/forecast/Rain'], function (rain) {
            forecast.rn = rain;
        })

        //预报单点
        require(['Function/forecast/single_fc'], function (single_fc) {
            forecast.single_fc = single_fc;
        })

        // 首页显示的日出日落
        var param = {
            station: XHW.C.http.zunYi_station1,
            // day: '17'
            day: XHW.time.day
        };
        XHW.C.http.get(XHW.C.http.baseUrl, '/forcastDay', param, function(json){
            var data = json.data;
            var keyAr = [];
            for(var key in data){
                keyAr.push(key);
            }
            //  对时间key值进行排序
            keyAr.sort((a,b) => {
                return a > b ? 1 : -1;
            });

            var sunSet = data[keyAr[0]]['SUNSET'];
            var sunUp = data[keyAr[0]]['SUNUP'];
            var cur_time = XHW.time.year + '-' + XHW.time.month + '-' + XHW.time.day;
            $('#headerDiv .a').html('日出 ' + sunUp);
            $('#headerDiv .b').html('日落 ' + sunSet);
            $('#headerDiv .c').html(cur_time);
        });
    }

       /**
     * 关闭某一功能
     * @param {*} type 功能类型（null时指全部）
     */
    function close(type){
        if(type) {
            if(forecast[type])
            forecast[type].close ? forecast[type].close() : null;
        } else {
            for(var key in forecast) {
                forecast[key].close ? forecast[key].close() : null;
            }
        }
    }

    var oneYear = getDate.getDay(0).tYear;
    var oneMonth = getDate.getDay(0).tMonth;
    var oneDate = getDate.getDay(0).tDate ;

    var twoYear = getDate.getDay(1).tYear;
    var twoMonth = getDate.getDay(1).tMonth;
    var twoDate = getDate.getDay(1).tDate ;

    var thrYear = getDate.getDay(2).tYear;
    var thrMonth = getDate.getDay(2).tMonth; 
    var thrDate = getDate.getDay(2).tDate ;

    var fourYear = getDate.getDay(3).tYear;
    var fourMonth = getDate.getDay(3).tMonth;
    var fourDate = getDate.getDay(3).tDate ;

    var fivYear = getDate.getDay(4).tYear;
    var fivMonth = getDate.getDay(4).tMonth;
    var fivDate = getDate.getDay(4).tDate ;

    var sixYear = getDate.getDay(5).tYear;
    var sixMonth = getDate.getDay(5).tMonth;
    var sixDate = getDate.getDay(5).tDate ;

    var sevYear = getDate.getDay(6).tYear;
    var sevMonth = getDate.getDay(6).tMonth;
    var sevDate = getDate.getDay(6).tDate ;

    $('#floatMapDiv6 .one_date, #floatMapDiv7 .one_date').html(oneDate +'日');
    $('#floatMapDiv6 .two_date, #floatMapDiv7 .two_date').html(twoDate +'日');
    $('#floatMapDiv6 .thr_date, #floatMapDiv7 .thr_date').html(thrDate +'日');
    $('#floatMapDiv6 .four_date, #floatMapDiv7 .four_date').html(fourDate +'日');
    $('#floatMapDiv6 .five_date, #floatMapDiv7 .five_date').html(fivDate +'日');
    $('#floatMapDiv6 .six_date, #floatMapDiv7 .six_date').html(sixDate +'日');
    $('#floatMapDiv6 .sev_date, #floatMapDiv7 .sev_date').html(sevDate +'日');

    $('#floatMapDiv6 .one_date, #floatMapDiv7 .one_date').attr('data-value',oneDate);
    $('#floatMapDiv6 .two_date, #floatMapDiv7 .two_date').attr('data-value',twoDate);
    $('#floatMapDiv6 .thr_date, #floatMapDiv7 .thr_date').attr('data-value',thrDate);
    $('#floatMapDiv6 .four_date, #floatMapDiv7 .four_date').attr('data-value',fourDate);
    $('#floatMapDiv6 .five_date, #floatMapDiv7 .five_date').attr('data-value',fivDate);
    $('#floatMapDiv6 .six_date, #floatMapDiv7 .six_date').attr('data-value',sixDate);
    $('#floatMapDiv6 .sev_date, #floatMapDiv7 .sev_date').attr('data-value',sevDate);

    $('#floatMapDiv6 .one_date, #floatMapDiv7 .one_date').attr('data-Year',oneYear);
    $('#floatMapDiv6 .two_date, #floatMapDiv7 .two_date').attr('data-Year',twoYear);
    $('#floatMapDiv6 .thr_date, #floatMapDiv7 .thr_date').attr('data-Year',thrYear);
    $('#floatMapDiv6 .four_date, #floatMapDiv7 .four_date').attr('data-Year',fourYear);
    $('#floatMapDiv6 .five_date, #floatMapDiv7 .five_date').attr('data-Year',fivYear);
    $('#floatMapDiv6 .six_date, #floatMapDiv7 .six_date').attr('data-Year',sixYear);
    $('#floatMapDiv6 .sev_date, #floatMapDiv7 .sev_date').attr('data-Year',sevYear);

    $('#floatMapDiv6 .one_date, #floatMapDiv7 .one_date').attr('data-month',oneMonth);
    $('#floatMapDiv6 .two_date, #floatMapDiv7 .two_date').attr('data-month',twoMonth);
    $('#floatMapDiv6 .thr_date, #floatMapDiv7 .thr_date').attr('data-month',thrMonth);
    $('#floatMapDiv6 .four_date, #floatMapDiv7 .four_date').attr('data-month',fourMonth);
    $('#floatMapDiv6 .five_date, #floatMapDiv7 .five_date').attr('data-month',fivMonth);
    $('#floatMapDiv6 .six_date, #floatMapDiv7 .six_date').attr('data-month',sixMonth);
    $('#floatMapDiv6 .sev_date, #floatMapDiv7 .sev_date').attr('data-month',sevMonth);
    
    return {
        init:init,
        close: close,
    }
});