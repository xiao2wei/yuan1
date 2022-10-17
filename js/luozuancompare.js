var COMPARE = {
	//初始比较元素
	compareItem:{},
	//最大元素集
	compareResult:{},
	//星级数据
	star:{},
	//最终输出
	results:{},
	//特殊元素值排序集
	attr:['SI2','SI1','VS2','VS1','VVS2','VVS1','IF','K','J','I','H','Fair','G','VG','EX','Ideal','S','M','F','N','E','D'],
	//特殊元素页面显示值
	label:['SI2','SI1','VS2','VS1','VVS2','VVS1','IF','K','J','I','H','Fair','G','VG','EX','Ideal','S','M','F','N','E','D'],
	//初始化
	init: function(configData) {
        if(configData && configData instanceof Array) {
            for (var i in configData) {
                this[i] = configData[i]
            };
        }
	
	},
	startCompare:function(obj){
		var shape = [];
		var ids = {};
		var num={};
		var compareItem = {};
		$("#dia_con_list tr").each(function(){
			ids[$(this).attr('id')] = $(this).attr('data-shape');
		})
		for(var i in ids){
			if(isNaN(num[ids[i]])){
				num[ids[i]]=1;
			}else{
				num[ids[i]] +=1;
			}
		}
		
		for(var i in ids){
			for(var j in num){
				if(ids[i]==j){
					if(num[j]>=2){
						this.compareItem[i] = ($("#dia_con_list tr[id='"+i+"']").attr('data-compare')).split(',');
					}
				}
			}
		}	
		this.compareItems();
		this.displayItems();
	
	},
	//比较
	compareItems:function(){
		var compareitem = this.compareItem;
		var tempcompare = {};
		var compareresult = [];
		for(var i in compareitem){
			var length = compareitem[i].length;
			break;
		}
		for(i=0;i<length;i++){
			for(var j in compareitem){
				if(isNaN(compareitem[j][i])){
					tempcompare[j] = this.convertToNum(compareitem[j][i]);
				}else{
					tempcompare[j]=compareitem[j][i];
				}
				
			}
			//比较并返回最大值
			var res = this.__compare(tempcompare);
			this.compareResult[i] = res;
			tempcompare  = [];
		}
	},
	convertToNum: function(str){
		var base = this.attr;
		for (var i in base){
			if(str==base[i]){
				return i;
			}
		}
	},
	//@itemarr 比较元素数组 [c1,c2,c3...]
	//@return 返回最大值
	__compare:function(itemarr){
		//获取基准比较参数
		for(var i in itemarr){
			var temp = itemarr[i];
			break;
		}
		var flag = false;
		for(var i in itemarr){
			if((itemarr[i]>temp || itemarr[i]<temp)){
				flag = true;
				if(itemarr[i]>temp){
					id = i;
					temp = itemarr[i];
				}
			}
		}
		if(flag)
			return temp;
		else
			return null;
	},
	convertToOrgin: function(num){
		var label = this.label;
		for(var j in label){
			if(num==j){
				return label[j];
			}
		}
		return num;
	},
	//保存星级和结果
	displayItems:function(){
		//还原最大结果集的值
		var result = this.compareResult;
		var compare = this.compareItem;
		var results = this.results;
		var newresult = [];
		var items = [];
		var res = '';
		for(var i in result){
			res = this.convertToOrgin(result[i]);
			newresult.push(res);
		}
		//输出结果
		for(var id in compare){
			this.star[id] = 0;
			for(var item in compare[id]){
				if(newresult[item] == compare[id][item]){
					//计算星级
					this.star[id] +=1;
					//保存星级元素
					items.push(compare[id][item]);
					
				}else{
					items.push('');
				}
			}
			this.results[id] = items;
			items = [];
		}
		

	}
}
