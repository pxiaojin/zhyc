define([], function() {
   var http = {
        zunYi_station:'1012602',       // 所有遵义市县乡站号前缀
        zunYi_station1:'101260201',   //遵义市城区
        baseUrl:'http://192.6.1.20:7018/meteo',
        tobaccoUrl:'http://192.6.1.20:7018',
        
        ecmfUrl:'http://ocean.xinhong.net:8000/xhweatherfcsys',
        weatherUrl: 'https://weather.xinhong.net/xhweatherfcsys',
        imgUrl: 'https://weather.xinhong.net',
        ecmfImgUrl:'http://ocean.xinhong.net:8000',
        get: function (host, url, param, callback, errorback) {
            var myParam = '?';
            for (var key in param) {
                myParam += key + '=' + param[key] + '&';
            }
            $.ajax({
                url: host + url + myParam,
                dataType: 'json',
                success: function (json) {
                    if (json.status_code != 0) {
                        errorback ? errorback(json) : null;
                        return;
                    }
                    callback ? callback(json) : null;
                },
                error: function (error) {
                    errorback ? errorback(error) : null;
                }
            })
        },

        Http: function(url, param, callback, errorback){
            $.ajax({
                // url: appendInfoToURL(url + param),
                url: http.baseUrl + url + param,
                type: "GET",//请求方式
                dataType:'json',
                success:function(json){
                    if (json.status_code != 0) {
                        errorback ? errorback(json) : null;
                        return;
                    }
                    callback ? callback(json.data, json.time) : null;
                },
                error: function (error) {
                    errorback ? errorback(error) : null;
                }
            })
        },
   }  

   return http;
});