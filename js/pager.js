/*
# by xl; 分页控件，支持表单异步提交, 样式由pager.css?1?1?1控制
# www.xuexb.com;
# jquery;
*/
;(function (a) {
	var ajaxPage = function (d) {
		var c=a.extend({
			page			: 1,		//当前页
			pageSize		: 10,		//每页多少个
			url				: null,    // 为空 说明调用者在重写
			run				: false,	//是否开始加载
			beforeSend		: false,	//请求前调用
			complete		: false,	//请求后调用
			pageId			: null, 	//分页容器
			simplePageId	: null, 	//简易分页容器
			noData			: "<div class='zjnoData'><img src='/Public/css/home/img/search_notice.png' />\u6CA1\u6709\u627E\u5230</div>",	//没有数据时提示
			content		: null,		//处理内容的循环,如 function () { return [list]标签是:{title},内容:{content}[/list] }
			/*
			以上为对外接口;
			return obj.run();//运行
			return obj.get(i);//跳页
			*/			
			pageCount		: null,		//总页
			recordCount		: null,		//总条数
			//isLoad			: false,	//是否加载过
			mark			: true		//请求开关, true可请求, false不可
		},d||{});
		
		var self = this;
		
		if (!self.length) { //  || !c.url
			return self	
		}
		var b = {};
		
		b.r = function (obj,opt) {
			var str;
			function fun(str) {
				for(var name in opt) {
					if(typeof opt[name]=="object") {
						// 字符串截取出新字符串
						var getStr=str.substring(str.indexOf("["+name+"]")+2+name.length,str.lastIndexOf("[/"+name+"]"));
						var newStr="";
						for(var i=0;i<opt[name].length;i++) {
							var newStrP=getStr;
							for(var s in opt[name][i]) {
								newStrP=newStrP.replace(eval("/{"+s+"}/ig"),opt[name][i][s]);
							}
							newStr+=newStrP;
						}
						str=str.replace("["+name+"]"+getStr+"[/"+name+"]",newStr);
					} else {
						if(opt[name]==undefined) {
							opt[name]="";
						}
                        if ($.inArray(name, ['code','recordCount','data']) == -1) {
                            // 替换成新的数据，page=1,下一页就是page=2,注意只能替换不能新增
                            str=str.replace(eval("/"+name+"=\\d*/"), 'page='+opt[name]);
                        }
					}
				}
				return str;
			}
			str=obj;
			str=fun(str);
			return str;
		}

		b.run = function () {
			/*if(c.isLoad) {
				return self;	
			}
			c.isLoad = true;*/
			b.ajax();
			return self;
		}
		
		b.initUrl = function () {
            if (!c.url) return ''; // 为空 说明调用者在重写
			return b.r(c.url,{
				page:c.page,
				pageSize: c.pageSize
			});
		}
        // 调用者自定义url
        b.genUrl = function(base_url) {
            return b.r(base_url, {
                page:c.page,
                pageSize: c.pageSize
            });
        }
		
		b.ajax = function (){
			/*if(!c.isLoad) {
				return self;	
			}*/
			c.mark = false;
			a.ajax({
				beforeSend:c.beforeSend,
				complete:c.complete,
				url:b.initUrl(),
				//type:c.type,
				dataType:"json",
				success: function (res) {
					b.each(res);//返回值 {"code":1,"recordCount":120,"data":[]}
				}
			});
		}
		
		b.each = function (res) {
			if (res) {
				if (res.code === 1) {
					if (c.content) {
						c.recordCount = res.recordCount;
						var s = "";
						if ("function" === typeof c.content) {
							s = c.content.call(c,c);	
						} else {
							s = c.content;	
						}
						self.html(b.r(s,res));
					}
				} else {
					c.recordCount = 0;
					self.html(c.noData);	
				}
				if(c.pageId) {
					b.toPage();
					b.toPageBind();
				}
                if(c.simplePageId) {
                    b.toSimplePage();
                    b.toSimplePageBind();
                }
				c.mark = true;
			}
		}
		
		b.get = function (i) {
            if(!c.mark || c.pageCount < 1) { //!c.isLoad ||
                return b;
			} 
			switch (i) {
				case "pre":
					c.page --;
					break;	
				case "next":
					c.page ++;
					break;	
				case "first":
					c.page = 1;
					break;
				case "last":
					c.page = c.pageCount;
					break;
				default :
					if (isNaN(i)) {
						break;	
					}
					i = parseInt(i);
					if (i > c.pageCount) {
						i = c.pageCount;	
					}
					if (i == c.page ){
						return false	
					};
					
					c.page = i;
					break;
			}
			b.ajax();
			return self;
		}
		
		b.toPageBind = function () {
			var pId = c.pageId;
			pId.find("a.a_pre").click(function () {
				b.get("pre");
			});	
			pId.find("a.a_next").click(function () {
				b.get("next");
			});	
			pId.find("a.a_first").click(function () {
				b.get("first");
			});	
			pId.find("a.a_last").click(function () {
				b.get("last");
			});	
			pId.find("a.a_href").click(function () {
				b.get($(this).attr("data-i"));
			});	
			pId.find('input.a_text').keydown(function (e) {
				if (e.keyCode === 13){
				   b.get($.trim($(this).val()));
				};
			});
			pId.find("input.a_button").click(function () {
				b.get($.trim(pId.find('input.a_text').val()));
			});
		}
		
		b.toPage = function () {
			var str="";
            c.pageCount=Math.ceil(c.recordCount/ c.pageSize);
			if(c.recordCount>c.pageSize) {//如果总共页大小每页多少条则,否则不出现分页码
				var page=c.page*1,
                    pageCount=c.pageCount,
					i=1;


				if(page>1) {
					str += "<a href=\"javascript:;\" class=\"a_pre\">&lt; \u4E0A\u4E00\u9875</a>";
				} else {
					str += "<span class=\"disable\">&lt; \u4E0A\u4E00\u9875</span>";
				};

				if(pageCount<7) {
					for(i;i<=pageCount;i++) {
						if(page===i) {
							str += "<span class=\"on\">"+i+"</span>";
						} else {
							str += "<a href=\"javascript:;\" class=\"a_href\" data-i=\""+ i +"\">"+i+"</a>";
						}
					}
				} else {
					var start,end;
					if(page===1) {
						str += "<span class=\"on\">1</span>";
					} else {
						str += "<a href=\"javascript:;\" class=\"a_first\">1</a>";
					};
					if(page>5) {
						str += "<span class=\"dot\">...</span>";
					};
					if(page<6) {
						start=1;
					} else {
						start=page-3;
					};

					if(page>(pageCount-5)) {
						end=pageCount;
					} else {
						end=page+4;
					};
					for(var i2=start;i2<end;i2++) {
						if(i2!==1&&i2!==pageCount) {//避免重复输出1和最后一页
							if(i2===page) {
								str += "<span class=\"on\">"+i2+"</span>";
							} else {
								str += "<a href=\"javascript:;\" class=\"a_href\" data-i=\""+ i2 +"\">"+i2+"</a>";
							}
						}
					};
					if(page<(pageCount-5)) {
						str += "<span class=\"dot\">...</span>";
					};
					if(page===pageCount) {
						str += "<span class=\"on\">"+pageCount+"</span>";
					} else {
						str += "<a href=\"javascript:;\" class=\"a_last\">"+pageCount+"</a>";
					};
				};

				if(page>=pageCount) {
					str += "<span class=\"disable\">\u4E0B\u4E00\u9875 &gt;</span>";
				} else {
					str += "<a href=\"javascript:;\" class=\"a_next\">\u4E0B\u4E00\u9875 &gt;</a>";
				};
				str += '<span class="href"><label for="pageText">\u5230\u7B2C</label>' +
                '<input autocomplete="off" type="text" class="a_text" value="'+ page +'">' +
                '<label for="pageText">\u9875</label><input type="button" value="\u8F6C\u5230" class="a_button"></span>';
			};
			
			c.pageId.html(str);
			return b;	
		}

        // 简易分页
        b.toSimplePage = function () {
            var str="";
            c.pageCount=Math.ceil(c.recordCount/ c.pageSize);
            if(c.recordCount>c.pageSize) { //如果总共页大小每页多少条则,否则不出现分页码
                var page=c.page*1,
                    pageCount=c.pageCount,
                    i=1;

                str += '<label class="pull-left" style="margin: 0 10px;">' + page + '/' + pageCount + '</label >';
                if(page>1) {
                    str += '<a href="javascript:;" class="a_pre pull-left">\u4E0A\u4E00\u9875</a>';
                } else {
                    str += '<span class="disable pull-left">\u4E0A\u4E00\u9875</span>';
                };

                if(page>=pageCount) {
                    str += '<span class="disable">\u4E0B\u4E00\u9875</span>';
                } else {
                    str += '<a href="javascript:;" class="a_next">\u4E0B\u4E00\u9875</a>';
                };
            };

            c.simplePageId.html(str);
            return b;
        }
        b.toSimplePageBind = function () {
            var pId = c.simplePageId;
            pId.find("a.a_pre").click(function () {
                b.get("pre");
            });
            pId.find("a.a_next").click(function () {
                b.get("next");
            });
        }

		//对外暴露接口
		self.genUrl = b.genUrl;
		self.run = b.run;
		self.get = b.get;
		if (c.run) {
			self.run();
            c.pageCount=Math.ceil(c.recordCount/ c.pageSize);
		} else {
            if(c.pageId) {
                b.toPage();
                b.toPageBind();
            }
            if(c.simplePageId) {
                b.toSimplePage();
                b.toSimplePageBind();
            }
        }
		return self;
	}
	a.fn.extend({ajaxPage:ajaxPage});
})(jQuery);
