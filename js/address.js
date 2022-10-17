/**
 * Created by Administrator on 2015/5/9.
 */

define(function (require, exports) {

    // var $ = require('/Public/js/home/jquery-1.10.2.js');
    var dialog = require("dialog");
    require("base");
    var areaPicker = require("AreaPicker");
    require("region");


    /**
     * 初始化
     */
    exports.init = function () {
        this.saveAddress(".save-address-btn");
        this.showAddressEditor(".edit-address-btn");
        this.setDefault(".set-default-btn");
        this.removeAddress(".remove-address-btn");
        this.pickAddress();
        this.hideEditor();
        this.changeProvince();
        this.changeCity();
    },
    /**
     *
     */

    exports.hideEditor = function() {
        $(document).delegate(".hide-editor-btn", 'click', function(e) {
            $('.address-detail').hide();
            location.href = '#';
        });
    },
    /**
     * 保存地址
     */
    exports.saveAddress = function (btn) {
        var _this = this;
        $(document).delegate(btn, "click", function(e) {
            if(e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
            var addressId = $('#address_id').val();
            var consignee = $('#consignee').val();
            var province = $('#addr_province').val();
            var provinceName = $('#addr_province option:selected').text();
            var city = $('#addr_city').val();
            var cityName = $('#addr_city option:selected').text();
            var county = $('#addr_county').val();
            var countyName = $('#addr_county option:selected').text();
            var address = $('#address_detail').val();
            var mobile = $('#mobile').val();
            var back_tel = $("#back_tel").val();
            var bestTime = $("[name=best_rec_time]:checked").val();
            var isDefault = $('[name=is_default]:checked').val();

            var data = {
                address_id: addressId,
                consignee: consignee,
                province: province,
                provinceName: provinceName,
                city: city,
                cityName: cityName,
                district: county,
                districtName: countyName,
                address: address,
                mobile: mobile,
                back_tel: back_tel,
                best_time: bestTime,
                is_def: isDefault
            };
            var btnObj = this;
            $(this).attr("disabled", true);
            $.post("ajax.php?m=user&c=user_api&a=saveAddress", data, function(res) {
                if(res.result == 1) {
                    showTip("地址保存成功",'success');
                    setTimeout(function() {
                        window.location.reload();
                        location.href = '#';
                    }, 1000);

                    /*var address = res.data;
                    console.log(address)
                    var pa = $('#address_box_'+address.address_id);
                    pa.find('.consignee').text(address.consignee);
                    for(var i in address){
                    }*/
                } else {
                    var msg = res.msg ? res.msg : '没有要更新的信息';
                    showTip(msg, 'error');
                }
                $(btnObj).attr("disabled", false);
            }, 'json');
        });
    },

    /**
     * 设置默认地址
     */
    exports.setDefault = function (btn) {
        $(document).delegate(".set-default-address-btn", "click", function(e) {
            if(e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            var addressId = $(this).attr('data-address-id');
            if(!addressId) {
                return false;
            }
            $.post("ajax.php?m=user&c=user_api&a=setDefaultAddress", {address_id: addressId}, function(res) {
                if(res.result == 1) {
                    var defaultAddrBox = $('.default-address-label').parent();
                    defaultAddrBox.append('<a href="javascript:;" data-address-id="' + defaultAddrBox.attr('data-address-id') + '" class="set-default-address-btn">设为默认</a>');
                    $('.default-address-label').remove();
                    $('#address_box_' + addressId + ' .set-default-address-btn').remove();
                    $('#address_box_' + addressId).prepend("<i class='default-address-label'>默认地址</i>");

                    //订单确认页地址设默认后，该地址即变为选中状态
                    $(".address-box").removeClass("current");
                    $('#address_box_' + addressId).addClass("current");
                    window.location.reload()

                }
                else {
                    showTip(res.msg,'error');
                }
            }, 'json');
            e.stopImmediatePropagation();
        });
    },

    /**
     * 删除地址
     */
    exports.removeAddress = function (btn) {
        $(document).delegate(".remove-address-btn", "click", function(e) {
            if(e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            if(!confirm("您确定要删除此地址吗?")) {
                return false;
            }

            var addressId = $(this).attr('data-address-id');
            if(!addressId) {
                return false;
            }
            $.post("ajax.php?m=user&c=user_api&a=removeAddress", {address_id: addressId}, function(res) {
                if(res.result == 1) {
                    $('#address_box_' + addressId).remove();
                }
                else {
                    showTip(res.msg,'error');
                }
            }, 'json');
            e.stopImmediatePropagation();
        });
    },

    /**
     * 显示地址编辑器
     */
    exports.showAddressEditor = function(btn) {
        $(document).delegate(".show-address-editor-btn", "click", function(e) {
            var data = $(this).attr('data-address-data');
            if(data) {
                data = JSON.parse(Base64.decode(data));
                $('#address_id').val(data.address_id);
                $('#consignee').val(data.consignee);
                /*$('#province').val(data.province);
                $('#city').val(data.city);
                $('#district').val(data.district);*/
                $('#address_detail').val(data.address);
                $('#mobile').val(data.mobile);
                $('#back_tel').val(data.back_tel);
                $('[name=is_default][value=' + data.is_def + ']').prop("checked", true);
                $('[name=best_rec_time][value=' + data.best_time + ']').prop("checked", true);
                /*areaPicker.init({
                    renderLevel:3,
                    provinceSelector:"#addr_province",
                    citySelector:"#addr_city",
                    countySelector:"#addr_county",
                    province: parseInt(data.province),
                    city: parseInt(data.city),
                    county: parseInt(data.district),
                    provinceUrl: "ajax.php?m=api&c=region&a=listProvinces", //获取省份的api接口
                    cityUrl: "ajax.php?m=api&c=region&a=listCities", //获取城市（县级单位）的API接口
                    countyUrl: "ajax.php?m=api&c=region&a=listCounties" //获取乡级单位的api接口
                });*/

            }
            else {
                $('#address_id').val("");
                $('#consignee').val("");
                $('#address_detail').val("");
                $('#mobile').val("");
                $('#back_tel').val("");
                $('[name=best_rec_time][value=1]').prop("checked", true);
                $('[name=is_default][value=0]').prop("checked", true);

                /*通过用户ip返回用户所在省、市*/
                //$.get('ajax.php?m=User&c=UserApi&a=getUserLocation',function(res){
                    //var province = res.data.province;
                    //var city = res.data.city;
                    //alert(city);
                    /*areaPicker.init({
                        renderLevel:3,
                        provinceSelector:"#addr_province",
                        citySelector:"#addr_city",
                        countySelector:"#addr_county",
                        province: 2,
                        city: 52,
                        county: 425,
                        provinceUrl: "ajax.php?m=api&c=region&a=listProvinces", //获取省份的api接口
                        cityUrl: "ajax.php?m=api&c=region&a=listCities", //获取城市（县级单位）的API接口
                        countyUrl: "ajax.php?m=api&c=region&a=listCounties" //获取乡级单位的api接口
                    });*/

                //},'json')

            }
            showRegion(data);
            $('.address-detail').show();
            location.href = '#address_edit'; // 转向锚
            e.stopImmediatePropagation();
        });
    },
    exports.pickAddress = function(e) {
        $(document).delegate(".address-box", "click", function(e) {
            if(e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            var addressId = $(this).attr('data-address-id');
            $(".address-box").removeClass("current");
            $(this).addClass("current");
            $('body').data("selected_address_id", addressId);
            $('.address-detail').hide();
        });
    },
    exports.changeProvince = function(){
        $(document).delegate("#addr_province", "change", function() {
            var selected_province = $("#addr_province option:selected").val();//当前选定的省份id
            var city_str = '';

            $.each(region_data.cities,function(k1,v1){
                $.each(v1,function(k2,v2){
                    if(parseInt(k2) == parseInt(selected_province)){
                        $.each(v2,function(k3,v3){
                            city_str += '<option value="'+v3.region_id+'"';
                            city_str += '>';
                            city_str += v3.region_name;
                            city_str += '</option>';
                        })
                    }
                })
            })
            $("#addr_city").html(city_str);

            var selected_city = $("#addr_city option:selected").val();
            var county_str = '';
            $.each(region_data.counties,function(k1,v1){
                $.each(v1,function(k2,v2){
                    if(parseInt(k2) == parseInt(selected_city)){
                        $.each(v2,function(k3,v3){
                            county_str += '<option value="'+v3.region_id+'"';
                            county_str += '>';
                            county_str += v3.region_name;
                            county_str += '</option>';
                        })
                    }
                })
            })
            $("#addr_county").html(county_str);

        });
    },
    exports.changeCity = function(){
        $(document).delegate("#addr_city", "change", function() {
            var selected_city = $("#addr_city option:selected").val();//当前选定的省份id
            var county_str = '';

            $.each(region_data.counties,function(k1,v1){
                $.each(v1,function(k2,v2){
                    if(parseInt(k2) == parseInt(selected_city)){
                        $.each(v2,function(k3,v3){
                            county_str += '<option value="'+v3.region_id+'"';
                            county_str += '>';
                            county_str += v3.region_name;
                            county_str += '</option>';
                        })
                    }
                })
            })
            $("#addr_county").html(county_str);
        });
    }

    /**
     * 附加新地址到地址列表
     * @param addressId
     * @param data
     */
    function appendContainer(addressId, data) {
        var defaultHtml = "";
        if(data.is_def && data.is_def == 1) {
            defaultHtml = '<i class="default-address-label">默认地址</i>';
        }
        var bestTimeHtml = "";
        if(!data.best_time) {
            data.best_time = 1;
        }
        switch (data.best_time) {
            case 1: {
                bestTimeHtml = "周一至周五";
                break;
            }
            case 1: {
                bestTimeHtml = "周一至周日";
                break;
            }
            case 1: {
                bestTimeHtml = "周六至周日";
                break;
            }
            default : {
                bestTimeHtml = "周一至周五";
                break;
            }
        }

        var setDefaultHtml = "";
        if(!data.is_def || data.is_default != 1) {
            setDefaultHtml = '<a href="javascript:;" data-address-id="' + data.address_id + '" class="set-default-address-btn">设为默认</a>';
        }
        var addressBoxHtml = '<div class="address-box" id="address_box_' + addressId + '" data-address-id="' + data.address_id + '" data-address-data="' + Base64.encode(JSON.stringify(data)) + '">' + defaultHtml +
            '<span class="consignee">' + data.consignee + '</span>' +
            '<span class="district">' + data.province_name + " " + data.city_name + "" + data.district_name + '</span>' +
            '<span class="mobile">' + data.mobile + '</span>' +
            '<span class="best-rec-time">' + bestTimeHtml +'</span>' +
            '<a href="javascript:;" data-address-id="' + data.address_id + '" data-address-data="' + Base64.encode(JSON.stringify(address)) + '" class="show-address-editor-btn">修改</a>' +
            '<a href="javascript:;" data-address-id="' + data.address_id + '" class="remove-address-btn">删除</a>' +
            setDefaultHtml +
            '</div>';
        if(data.is_def) {
            $('.address-list').prepend(addressBoxHtml);
        }
        else {
            $('.address-list').append(addressBoxHtml);
        }
    }

    /**
     * 更新地址列表中的数据
     * @param data
     * @returns {boolean}
     */
    function renderContainer(data) {
        if(data && data.address_id) {
            var box = $("#address_box_" + data.address_id);
            box.find(".mobile").text(data.mobile);
            box.find(".consignee").text(data.consignee);
            box.find(".district").text(data.provinceName + " " + data.cityName + " " + data.districtName);
            box.find(".mobile").text(data.mobile);
            box.find(".mobile").text(data.mobile);
            var defLabel = box.find('.default-address-label');
            var setDefBtn = box.find(".default-address-label");
            if(data.is_def) {
                if(!defLabel || defLabel.length == 0) {
                    box.prepend('<i class="default-address-label">默认地址</i>');
                }
                if(setDefBtn && setDefBtn.length > 0) {
                    setDefBtn.remove();
                }
            }
            else {
                if(!setDefBtn || setDefBtn.length == 0) {
                    var setDefaultHtml = '<a href="javascript:;" data-address-id="' + data.address_id + '" class="set-default-address-btn">设为默认</a>';
                    box.append(setDefaultHtml);
                }
                if(defLabel && defLabel.length > 0) {
                    defLabel.remove();
                }
            }
        }
        else {
            return false;
        }
    }

    /**
     * 弹窗提示
     * @param msg
     * @param timeout
     * @param callback
     */
    function showTip(msg,skin, timeout, callback) {
        if (!skin) {
            skin = "general";
        }
        var d = dialog({
            button: [
                {
                    value: '确定'
                }
            ],
            title: " ",
            content: msg,
            skin:skin  /*skin的样式有success 、error 、warning 、general   */
        });
        d.show();
        if(!timeout) {
            timeout = 2000;
        }
        setTimeout(function () {
            d.close().remove();
        }, timeout);
    }

    /**
     * 显示地址编辑器
     * @param data
     */
    function showAddressEditor(data) {
        var d = dialog({
            title: title,
            content: content,
            okValue: '确定',
            ok: function () {
                this.title('提交中…');
                return false;
            },
            cancelValue: '取消',
            cancel: function () {}
        });
        d.show();
    }

    //地区级联下拉框数据初始化
    function showRegion(address){
        /*var address = $('.show-address-editor-btn').attr('data-address-data');
        if(address) {
            address = JSON.parse(Base64.decode(address));
        }*/
        var pro_str = '';
        var city_str = '';
        var county_str = '';

        $.each(region_data.provinces,function(k1,v1){
            $.each(v1,function(k2,v2){
                pro_str += '<option value="'+v2.region_id+'"';
                if(address){
                    if(parseInt(address.province) == parseInt(v2.region_id)){
                        pro_str += ' selected'
                    }
                }
                pro_str += '>';
                pro_str += v2.region_name;
                pro_str += '</option>';
            })
        })
        $("#addr_province").html(pro_str);


        var selected_province = $("#addr_province option:selected").val();
        $.each(region_data.cities,function(k1,v1){
            $.each(v1,function(k2,v2){
                if(parseInt(k2) == parseInt(selected_province)){
                    $.each(v2,function(k3,v3){
                        city_str += '<option value="'+v3.region_id+'"';
                        if(address){
                            if(parseInt(address.city) == parseInt(v3.region_id)){
                                city_str += ' selected'
                            }
                        }
                        city_str += '>';
                        city_str += v3.region_name;
                        city_str += '</option>';
                    })
                }
            })
        })
        $("#addr_city").html(city_str);


        var selected_city = $("#addr_city option:selected").val();
        $.each(region_data.counties,function(k1,v1){
            $.each(v1,function(k2,v2){

                if(parseInt(k2) == parseInt(selected_city)){
                    $.each(v2,function(k3,v3){
                        county_str += '<option value="'+v3.region_id+'"';
                        if(address){
                            if(parseInt(address.district) == parseInt(v3.region_id)){
                                county_str += ' selected'
                            }
                        }
                        county_str += '>';
                        county_str += v3.region_name;
                        county_str += '</option>';
                    })
                }
            })
        })
        $("#addr_county").html(county_str);
    }
});
