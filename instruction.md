#接口说明
气象接口

##基本信息
'''
###根据站点查询站信息：
192.6.1.20:7018/meteo/ 
###过去24h实况
192.6.1.20:7018/meteo/real?station=101201008
###小时预报
192.6.1.20:7018/meteo/forcastHour?station=101260209&day=06
###日预报
192.6.1.20:7018/meteo/forcastDay?station=101260209&day=09
'''

##部分要素规定
...

##结果显示
'''
###根据站点查询站信息：
192.6.1.20:7018/meteo/station?station=101251401
结果：
{
    "status_code": 0,
    "delay": 1,
    "data": {
        "101251401": {
            "AREA": "湖南省永州市",
            "LON": 111.613445,
            "HEIGHT": 0,
            "LAT": 26.420394,
            "NAME": "城区"
        },
        "101251401011": {
            "AREA": "湖南省永州市零陵区石岩头镇",
            "LON": 111.298938,
            "HEIGHT": 0,
            "LAT": 26.013403,
            "NAME": "石岩头镇"
        }...
    }
}

###过去24h实况
192.6.1.20:7018/meteo/real?station=101201008
{
    "status_code": 0,
    "delay": 33,
    "data": {
        "2019-10-10 05:00:00.0": {
            "RAIN6": 0,
            "MAXRH": 93,
            "MINT": 16,
            "MAXWIND": "2",
            "WD": "135",
            "MAXT": 24,
            "RAIN24": 0,
            "RH": 91,
            "RAIN12": 0,
            "TAVG": 19,
            "WS": "1",
            "RAIN3": 0,
            "RAIN1": 0
        },
        "2019-10-09 10:00:00.0": {
            "RAIN6": 0,
            "MAXRH": 93,
            "MINT": 16,
            "MAXWIND": "3",
            "WD": "90",
            "MAXT": 18,
            "RAIN24": 0.3,
            "RH": 74,
            "RAIN12": 0,
            "TAVG": 17,
            "WS": "2",
            "RAIN3": 0,
            "RAIN1": 0
        }...
    }
}

###小时预报
192.6.1.20:7018/meteo/forcastHour?station=101260209&day=06
{
    "status_code": 0,
    "delay": 45,
    "data": {
        "2019-10-10 20:00:00.0": {
            "PHEN": "03",
            "TAVG": 18,
            "WS": "<3级",
            "WD": "180"
        },
        "2019-10-11 17:00:00.0": {
            "PHEN": "03",
            "TAVG": 20,
            "WS": "<3级",
            "WD": "225"
        }...
    }
}

###日预报
192.6.1.20:7018/meteo/forcastDay?station=101260209&day=09
{
    "status_code": 0,
    "delay": 10,
    "data": {
        "2019-10-17 00:00:00": {
            "PHEN": "雨",
            "PHEN_AFTER": "03",
            "WD_AFTER": "135",
            "PHEN_BEFORE": "03",
            "TMAX": 15,
            "TMIN": 11,
            "WS": "<3级",
            "WD_BEFORE": "315"
        },
        "2019-10-22 00:00:00": {
            "PHEN": "雨",
            "PHEN_AFTER": "03",
            "WD_AFTER": "360",
            "PHEN_BEFORE": "03",
            "TMAX": 15,
            "TMIN": 12,
            "WS": "<3级",
            "WD_BEFORE": "45"
        }...
    }
}
'''

###

###