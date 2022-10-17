  //初始化区间滑动
function diamondSlider() {
        $("#weightSlider").noUiSlider({
            snap: true,
            range: {
              'min': 0.3,
              '10%': 0.4,
              '20%': 0.5,
              '30%': 0.6,
              '40%': 0.7,
              '50%': 0.8,
              '60%': 0.9,
              '70%': 1.0,
              '80%': 1.5,
              '90%': 2.0,
              'max': 2.5
            },
            format: wNumb({
                decimals: 1
            }),
            start: [0.3, 2.5]
        }, true);
        $("#weightSlider").on({
            set: function(){
                if ($(this).val()[1] == '2.5') {
                    $('#weight_upper').text('2.5 ct以上');
                    $('#weight_upper_b').hide();
                }else{
                    $('#weight_upper_b').show();
                }
            }
        });
        $("#weightSlider").Link('lower').to($('#weight_lower'));
        $("#weightSlider").Link('upper').to($('#weight_upper'));
        if ($('#weightSlider').val()[1] == '2.5') {
            $('#weight_upper').text('2.5 ct以上');
            $('#weight_upper_b').hide();
        };
        $("#priceSlider").noUiSlider({
            snap: true,
            range: {
              'min': 1000,
              '10%': 5000,
              '20%': 10000,
              '30%': 15000,
              '40%': 20000,
              '50%': 25000,
              '60%': 30000,
              '70%': 50000,
              '80%': 100000,
              '90%': 150000,
              'max': 200000
            },
            format: wNumb({
                thousand: ','
            }),
            start: [1000, 200000]
        }, true);
        $("#priceSlider").on({
            set: function(){
                if ($('#priceSlider').val()[1] == '200,000') {
                    $('#price_upper').text('200,000 RMB以上');
                    $('#price_upper_b').hide();
                }else{
                    $('#price_upper_b').show();
                }
            }
        });
        $("#priceSlider").Link('lower').to($('#price_lower'));
        $("#priceSlider").Link('upper').to($('#price_upper'));
        if ($('#priceSlider').val()[1] == '200,000') {
            $('#price_upper').text('200,000 RMB以上');
            $('#price_upper_b').hide();
        }
    }