#接口说明
气候接口

##基本信息
'''
###历史日数据
192.6.1.20:7018/climate/selectHistoryDayData?station=54511              &month=1&day=1
###历史月数据
192.6.1.20:7018/climate/selectHistoryMonthData?station=54511
###历史旬数据
192.6.1.20:7018/climate/selectHistoryDekadData?station=54511
###历史候数据
192.6.1.20:7018/climate/selectHistoryPentadData?station=54511
###历史生育期数据
192.6.1.20:7018/climate/selectHistoryGrowData?station=54511&stage=0

###本季月数据
192.6.1.20:7018/climate/selectCurrentMonthData?station=54511&year=2018
###本季旬数据
192.6.1.20:7018/climate/selectCurrentDekadData?station=54511&year=2018
###本季生育期数据
192.6.1.20:7018/climate/selectCurrentGrowData?station=54511&year=2018&stage=1

#### 部分参数说明
stage:0:育苗期1:移栽伸根期2:旺长期3:成熟采烤期4:大田期5:全生育期
'''
##部分要素规定
...
    /**
     * 时间统计单位
     */
    //月
    private int MONTH;
    //旬
    private int DEKAD;
    //候
    private int PENTAD;
    //开始年
    private int SYEAR;
    //结束年
    private int EYEAR;
    /**
     * 温度相关tt
     */
    //平均气温
    private float AVG_AT;
    //平均最高气温 ℃
    private float AVGMAX_AT;
    //极端最高气温 ℃
    private float EXTMAX_AT;
    //平均最低气温 ℃
    private float AVGMIN_AT;
    //极端最低气温 ℃
    private float EXTMIN_AT;
    //＞10℃有效积温
    private float EFFACC_AT_GT10;
    //日最高气温≥30℃日数
    private int GE30_DAYS;
    //日最高气温≥35℃日数
    private int GE35_DAYS;

    /**
     * 降水pre
     */
    //平均全天20-20时降水量mm(基于历年sum字段统计)
    private float AVG_PRE20_20;
    //全天最大降水量mm
    private float AVGMAX_PRE20_20;
    //降水日数
    private int PRE20_20_DAYS;
    //小雨日数
    private int LIGHT_PRE_DAYS;
    //中雨日数
    private int MODER_PRE_DAYS;
    //大雨日数
    private int HEAVY_PRE_DAYS;
    //暴雨日数
    private int STORM_PRE_DAYS;
    //累积全天20-20时降水量mm
    private float SUM_PRE20_20;
    /**
     * 风wind
     */
    //平均风速
    private float AVG_WS;
    //平均风速≥10m/s日数
    private int GE10_DAYS;
    //大风（瞬时风速≥17m/s）日数
    private int GALE_DAYS;
    //极端最大平均风速
    private float MAX_WS;
    //极端最大平均风速的风向 16方位
    private int MAX_WS_WD;
    //极端最大平均风速出现年份
    private int MAX_WS_YEAR;
    //极端最大瞬时风速
    private float EXTMAX_WS;
    //极端最大瞬时风速的风向 16方位
    private int EXTMAX_WS_WD;
    //极端最大瞬时风速出现年份
    private int EXTMAX_WS_YEAR;

    /**
     * 日照sun
     */
    //平均日照时数 小时
    private float AVG_SSD;
    //平均日照百分率 %
    private int PER_SSD;
    //累积日照时数 小时
    private float SUM_SSD;

    /**
     * 气压prs
     */
    //平均本站气压hPa
    private float AVG_LP;
    //极端最高本站气压hPa
    private float EXTMAX_LP;
    //极端最高本站气压出现最近年份
    private int EXTMAX_LP_YEAR;
    //极端最低本站气压hPa
    private float EXTMIN_LP;
    //极端最低本站气压出现最近年份
    private int EXTMIN_LP_YEAR;    

    /**
     * 生育期
     */
    //平均气温
    private float AVG_AT;
    //最高平均气温 ℃
    private float MAX_AVG_AT;
    //最低平均气温 ℃
    private float MIN_AVG_AT;
    //平均≥10℃活动积温
    private float AVG_ACTACC_GE10;
    //日平均气温≥20℃的日数
    private int AVG_GE20_DAYS;
    //日最高气温≥35℃的日数
    private int AVG_GE35_DAYS;
    //降水量
    private float AVG_PRE;
    //降水日数
    private int AVG_PRE_DAYS;
    //平均相对湿度
    private float AVG_RH;
    //日照时数
    private float AVG_SSD;
    //大田期日数(13℃初日与20℃终日间)
    private float AVG_FIELD_DAYS;

    /**
     * 历年生育期
     */
    //平均最高气温 ℃
    private float AVGMAX_AT;
    //平均最低气温 ℃
    private float AVGMIN_AT;
    //≥10℃活动积温
    private float ACTACC_GE10;
    //日平均气温≥20℃的日数
    private int GE20_DAYS;
    //日最高气温≥35℃的日数
    private int GE35_DAYS;
    //降水量
    private float SUM_PRE;
    //降水日数
    private int PRE_DAYS;
    //日照时数
    private float SUM_SSD;
    //大田期日数(13℃初日与20℃终日间)
    private int FIELD_DAYS;

##结果显示

###