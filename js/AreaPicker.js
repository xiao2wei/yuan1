/**
 * Created by Arimis Wang on 2014/12/2.
 * @depandency JQuery
 * @abstract 暂时只支持三级区划. HTML代码结构如下：
 * <select id="province"></select><select id="city"></select><select id="county"></select>
 * <script type="text/javascript">
 *     AreaTool.init({
 *         provinceUrl: "",
 *         cityUrl: "",
 *         countyUrl: "" 
 *     });
 * </script>
 */

window.AreaTool = {
    finishInit: false,
    eventTriggerLevel: 1,
    baseConfig: {
        province: 2,
        city: 52,
        county: 425,

        renderLevel: 3,  //渲染等级： 1 省 2市/县 3乡/地区
        renderStyle: 1,  //渲染模式： 1 直接自动渲染到renderLevel， 2 一级一级往下渲染，每次只渲染一级，当发生选择时再渲染下一级

        provinceSelector: '#province',
        citySelector: '#city',
        countySelector: '#county',
        townSelector: '#town',
        villageSelector: '#village',

        provinceUrl: "ajax.php?m=api&c=region&a=listProvinces", //获取省份的api接口
        cityUrl: "ajax.php?m=api&c=region&a=listCities", //获取城市（县级单位）的API接口
        countyUrl: "ajax.php?m=api&c=region&a=listCounties", //获取乡级单位的api接口
        townUrl: "",
        villageUrl: ""
    },
    cache: null,
    /**
     * 初始化插件
     */
    init: function (config) {
        var _this = this;
        if (config && typeof config == 'object') {
            for (var index in config) {
                var item = config[index];
                _this.baseConfig[index] = item;
            }
        }

        this.cache = new Cache(this.baseConfig.provinceSelector + this.baseConfig.citySelector + this.baseConfig.countySelector + this.baseConfig.townSelector + this.baseConfig.villageSelector);
        this.finishInit = false;
        this.getProvinceList(true, this.baseConfig.province);
    }
    ,

    /**
     * 渲染
     */
    render: function (selector, level, data, defaultVal) {
        var _this = this;
        var optionHtml = "";
        var firstItem = 1;
        var hideLowerLevel = false;
        level = parseInt(level);

        if (data.length == 0) {
            hideLowerLevel = true;
            $(selector).hide();
        }
        else {
            $.each(data, function (index, item) {
                if (index == 0) {
                    firstItem = item.id;
                }
                optionHtml += "<option value='" + item.id + "' data-code='" + item.code + "' " + (defaultVal == item.id ? "selected" : "") + ">" + item.name + "</option>";
            });
            $(selector).html(optionHtml);
            $(selector).attr('data-area-level', level);
            $(selector).show();
            //绑定事件
            $(selector).unbind();
            $(selector).bind("change", function () {
                var currentLevel = parseInt($(this).attr('data-area-level'));
                if (isNaN(currentLevel)) {
                    return false;
                }
                var parentId = $(this).find("option:selected").attr('value');
                if (!parentId) {
                    parentId = firstItem;
                }
                if (_this.baseConfig.renderLevel > currentLevel) {
                    switch (currentLevel) {
                        case 1:
                            _this.eventTriggerLevel = 1;
                            _this.getCityList(parentId, true, _this.baseConfig.city);
                            break;
                        case 2:
                            _this.eventTriggerLevel = 2;
                            _this.getCountyList(parentId, true, _this.baseConfig.county);
                            break;
                        case 3:
                            _this.eventTriggerLevel = 3;
                            _this.getTownList(parentId, true, _this.baseConfig.town);
                            break;
                        case 4:
                            _this.eventTriggerLevel = 4;
                            _this.getVillageList(parentId, true, _this.baseConfig.village);
                            break;
                        default:
                            break;
                    }

                }
            });
        }

        //自动渲染下级
        if (!hideLowerLevel && this.baseConfig.renderLevel > level && (this.baseConfig.renderStyle == 1 || !this.finishInit || (this.finishInit && this.baseConfig.renderStyle == 2 && this.eventTriggerLevel == level))) {

            //渲染下级
            switch (level) {
                case 1:
                    if (!_this.finishInit) {
                        if (isNaN(defaultVal)) {
                            defaultVal = this.baseConfig.province;
                        }
                        else if (isNaN(defaultVal)) {
                            defaultVal = firstItem;
                        }
                    }
                    else {
                        defaultVal = firstItem;
                    }
                    _this.getCityList(defaultVal, true, _this.baseConfig.city);
                    break;
                case 2:
                    if (!_this.finishInit) {
                        if (isNaN(defaultVal)) {
                            defaultVal = this.baseConfig.city;
                        }
                        else if (isNaN(defaultVal)) {
                            defaultVal = firstItem;
                        }
                    }
                    else {
                        defaultVal = firstItem;
                    }
                    _this.getCountyList(defaultVal, true, _this.baseConfig.county);
                    break;
                case 3:
                    if (!_this.finishInit) {
                        if (isNaN(defaultVal)) {
                            defaultVal = this.baseConfig.county;
                        }
                        else if (isNaN(defaultVal)) {
                            defaultVal = firstItem;
                        }
                    }
                    else {
                        defaultVal = firstItem;
                    }

                    _this.getTownList(defaultVal, true, _this.baseConfig.town);
                    break;
                case 4:
                    if (!_this.finishInit) {
                        if (isNaN(defaultVal)) {
                            defaultVal = this.baseConfig.town;
                        }
                        else if (isNaN(defaultVal)) {
                            defaultVal = firstItem;
                        }
                    }
                    else {
                        defaultVal = firstItem;
                    }
                    _this.getVillageList(defaultVal, true, _this.baseConfig.village);
                    break;
                default:
                    break;
            }
        }
        else {
            _this.finishInit = true;
        }

        if (hideLowerLevel || (this.baseConfig.renderStyle == 2 && this.eventTriggerLevel < level)) {
            switch (level) {
                case 1:
                    $(this.baseConfig.citySelector).hide();
                case 2:
                    $(this.baseConfig.countySelector).hide();
                case 3:
                    $(this.baseConfig.townSelector).hide();
                case 4:
                    $(this.baseConfig.villageSelector).hide();
            }
        }
    }
    ,

    /**
     * 获取省级列表
     */
    getProvinceList: function (forRender, defaultVal) {
        var data = this.cache.get("provinces-list");
        var _this = this;
        if (data) {
            if (forRender) {
                this.render(this.baseConfig.provinceSelector, 1, data, defaultVal);
            }
            return data;
        }
        else {
            $.getJSON(_this.baseConfig.provinceUrl, {}, function (res) {
                if (res.result) {
                    var cities = res.data;
                    _this.cache.save("provinces-list", cities);
                    if (forRender) {
                        _this.render(_this.baseConfig.provinceSelector, 1, cities, defaultVal);
                    }
                }
                else {
                    tip.showTip('err', res.message, 3000);
                }
            });
        }
    }
    ,

    /**
     * 获取城市列表
     */
    getCityList: function (provinceId, forRender, defaultVal) {
        if (!provinceId || isNaN(provinceId)) {
            return false;
        }
        var _this = this;
        var cities = this.cache.get("cities-" + provinceId + '-list');
        if (cities) {
            if (forRender) {
                this.render(this.baseConfig.citySelector, 2, cities, defaultVal);
            }
            return cities;
        }
        else {
            $.getJSON(_this.baseConfig.cityUrl, {provinceId: provinceId}, function (res) {
                if (res.result) {
                    var cities = res.data;
                    _this.cache.save("cities-" + provinceId + '-list', cities);
                    if (forRender) {
                        _this.render(_this.baseConfig.citySelector, 2, cities, defaultVal);
                    }
                }
                else {
                    tip.showTip('err', res.message, 3000);
                }
            });
        }
    }
    ,

    /**
     * 获取县级列表
     */
    getCountyList: function (cityId, forRender, defaultVal) {
        if (!cityId || isNaN(cityId)) {
            return false;
        }
        var cities = this.cache.get("counties-" + cityId + '-list');
        var _this = this;
        if (cities) {
            if (forRender) {
                this.render(this.baseConfig.countySelector, 3, cities, defaultVal);
            }
            return cities;
        }
        else {
            $.getJSON(_this.baseConfig.countyUrl, {cityId: cityId}, function (res) {
                if (res.result) {
                    var cities = res.data;
                    _this.cache.save("counties-" + cityId + '-list', cities);
                    if (forRender) {
                        _this.render(_this.baseConfig.countySelector, 3, cities, defaultVal);
                    }
                }
                else {
                    tip.showTip('err', res.message, 3000);
                }
            });
        }
    }
    ,

    /**
     * 获取乡级列表
     */
    getTownList: function (countryId, forRender, defaultVal) {
        if (!countryId || isNaN(countryId)) {
            return false;
        }
        var cities = this.cache.get("towns-" + countryId + '-list');
        if (cities) {
            if (forRender) {
                this.render(this.baseConfig.townSelector, 4, cities, defaultVal);
            }
            return cities;
        }
        else {
            var _this = this;
            $.getJSON(_this.baseConfig.townUrl, {countryId: countryId}, function (res) {
                if (res.result) {
                    var cities = res.data;
                    _this.cache.save("towns-" + countryId + '-list', cities);
                    if (forRender) {
                        _this.render(_this.baseConfig.townSelector, 4, cities, defaultVal);
                    }
                }
                else {
                    tip.showTip('err', res.message, 3000);
                }
            });
        }
    }
    ,

    /**
     * 获取村级列表
     */
    getVillageList: function (townId, forRender, defaultVal) {
        if (!townId || isNaN(townId)) {
            return false;
        }
        var cities = this.cache.get("villages-" + townId + '-list');
        if (cities) {
            if (forRender) {
                this.render(this.baseConfig.villageSelector, 5, cities, defaultVal);
            }
            return cities;
        }
        else {
            var _this = this;
            $.getJSON(_this.baseConfig.villageUrl, {townId: townId}, function (res) {
                if (res.result) {
                    var cities = res.data;
                    _this.cache.save("villages-" + townId + '-list', cities);
                    if (forRender) {
                        _this.render(_this.baseConfig.villageSelector, 5, cities, defaultVal);
                    }
                }
                else {
                    tip.showTip('err', res.message, 3000);
                }
            });
        }
    }
}
;


function Cache(prefix) {
    if (prefix) {
        this.prefix = prefix;
    }
}

Cache.prototype.prefix = "__cache__";
Cache.prototype.currentKey = "";
Cache.prototype.currentVal = "";
Cache.prototype.save = function (key, val) {
    $('body').data(this.prefix + key, val);
};
Cache.prototype.has = function (key) {
    var data = $('body').data(this.prefix + key);
    if (data) {
        this.currentKey = key;
        this.currentVal = data;
        return true;
    }
    else {
        return false;
    }
};

Cache.prototype.get = function (key) {
    if (this.has(key)) {
        return this.currentVal;
    }
}

define(function (require, exports, module) {
    module.exports = AreaTool;
});