$.fn.validatebox.extend = $.extend($.fn.validatebox.defaults.rules, {
	websiteAddr:{
		validator: function (value) {
			var reg = /^(\w+:\/\/)?\w+(\.\w+)+.*$/;
			//console.log( value+"***"+reg.test(value));
			return reg.test(value);
		},
		message: '请输入有效的网址'
	},
	Number : {
		validator: function (value) {
			var reg = /^(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/;
			return reg.exec(value);
		},
		message: '请输入有效的实数'
	},
	integer : {
		validator: function (value) {
			var reg = /^[0-9]+$/;
			return reg.exec(value);
		},
		message: '请输入有效整数'
	},
	intOrFloat : {// 验证整数或小数
        validator : function(value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message : '请输入数字，并确保格式正确'
    },
	date : {
		validator: function (value) {
			var reg = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/;
			return reg.exec(value);
		},
		message: '请输入有效日期，格式为：yyyy-MM-dd'
	},
	dateTime : {
		validator: function (value) {
			var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/;
			return reg.exec(value);
		},
		message: '请输入有效日期，格式为：yyyy-MM-dd hh:mm:ss'
	},
	phone : {
		validator: function (value) {
			var reg = /^(^(\d{3,4}-)?\d{7,8})$|([13|14|15|18][0-9]{9})$/;
			return reg.exec(value);
		},
		message: '请输入有效电话号码'
	},
	minValue : {
		validator: function (value,param) {
			var reg = /^[0-9]+$/;//验证整数
			var flag = false;
			if(reg.exec(value)) {
				if(value >= param) {
					flag = true;
				}
			}
			return flag;
		},
		message: '请输入大于等于{0}的整数'
	},
	intBetween : {
		validator: function (value,param) {
			var reg = /^[0-9]+$/;//验证整数
			var flag = false;
			if(reg.exec(value)) {
				if(value >= param[0] && value <= param[1]) {
					flag = true;
				}
			}
			return flag;
		},
		message: '请输入{0}-{1}之间的整数'
	},
    email:{
        validator : function(value){
        	var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        	return reg.exec(value); 
        },
    	message : '请输入有效的电子邮件账号(例：abc@126.com)'    
    },
    keyWordContent : {
		validator:function(value,param){
	    	return (/^[^\\\/:@#\*\?\"<>\|]*$/.test(value));
	    },
    	message:"资产关键字不能包含\\\/:@#\*\?\"<>\|"
    },
    keyWordContent1 : {
		validator:function(value,param){
	    	return (/^[^\\\/:@#\*\?\"<>\|]*$/.test(value));
	    },
    	message:"不能包含\\\/:@#\*\?\"<>\|"
    }, 
    owner : {
		validator:function(value,param){
			return /^[\u0391-\uFFE5\w]+$/.test(value);
	    },
    	message:"资产所有者只能输入汉字、字母、数字及下划线'"
    },
    ip : {// 验证IP地址
        validator : function(value) {
            return /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value);
        },
        message : 'IP地址格式不正确'
	},
	portNum : {
			validator:function(value,param){
			return (/^[+]?[0-9]+\d*$/i.test(value))&&(value>=0&&value<=65535);
		},
		message:"端口号必须是0~65535之间的整数"
    },
    table: {
        validator: function (value, param) {
            return /^[^\u0391-\uFFE5^\,]+$/.test(value)&&(/^[^\*,@#\?\"<>\|]*$/.test(value));
        },
        message: '不能输入汉字与非法字符'
    },
	fileName : {
		validator:function(value,param){
	    	return (/^[^\\\/:,@#\*\?\"<>\|]*$/.test(value));
	    },
    	message:"文件名称不能包含\\\/:,@#\*\?\"<>\|"
    },
    locationInfo : {
    	validator:function(value,param){
    		return (/^[^\*,@#\?\"<>\|]*$/.test(value));
		},
		message:"存储位置不能包含\*,@#\?\"<>\|"
    },
    remark : {
		validator:function(value,param){
	    	return (/^[^<>]*$/.test(value));
	    },
    	message:"备注不能包含<>"
    },
    opinion : {
		validator:function(value,param){
	    	return (/^[^<>~@#$%^&*|:]*$/.test(value));
	    },
    	message:"审核意见不能包含<>~@#$%^&*|:"
    },
    idcard : {// 验证身份证 
        validator : function(value) { 
        	/*
			该方法由网友提供;
			对身份证进行严格验证;
			*/
		
			var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子;
			var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值，10代表X;
		
			if (value.length == 15) {   
				return isValidityBrithBy15IdCard(value);   
			}else if (value.length == 18){   
				var a_idCard = value.split("");// 得到身份证数组   
				if (isValidityBrithBy18IdCard(value)&&isTrueValidateCodeBy18IdCard(a_idCard)) {   
					return true;   
				}   
				return false;
			}
			return false;
			
			function isTrueValidateCodeBy18IdCard(a_idCard) {   
				var sum = 0; // 声明加权求和变量   
				if (a_idCard[17].toLowerCase() == 'x') {   
					a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
				}   
				for ( var i = 0; i < 17; i++) {   
					sum += Wi[i] * a_idCard[i];// 加权求和   
				}   
				valCodePosition = sum % 11;// 得到验证码所位置   
				if (a_idCard[17] == ValideCode[valCodePosition]) {   
					return true;   
				}
				return false;   
			}
			
			function isValidityBrithBy18IdCard(idCard18){   
				var year = idCard18.substring(6,10);   
				var month = idCard18.substring(10,12);   
				var day = idCard18.substring(12,14);   
				var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
				// 这里用getFullYear()获取年份，避免千年虫问题   
				if(temp_date.getFullYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){   
					return false;   
				}
				return true;   
			}
			
			function isValidityBrithBy15IdCard(idCard15){   
				var year =  idCard15.substring(6,8);   
				var month = idCard15.substring(8,10);   
				var day = idCard15.substring(10,12);
				var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
				// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
				if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){   
					return false;   
				}
				return true;
			}
        }, 
        message : '身份证号码格式不正确'
    },
      minLength: {
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length:{validator:function(value,param){ 
        var len=$.trim(value).length; 
            return len>=param[0]&&len<=param[1]; 
        }, 
            message:"输入内容长度必须介于{0}和{1}之间."
        }, 
    mobile : {// 验证手机号码 
        validator : function(value) { 
            return /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/i.test(value); 
        }, 
        message : '手机号码格式不正确' 
    }, 
    currency : {// 验证货币 
        validator : function(value) { 
            return /^\d+(\.\d+)?$/i.test(value); 
        }, 
        message : '货币格式不正确' 
    }, 
    chinese : {// 验证中文 
        validator : function(value) { 
            return /^[\Α-\￥]+$/i.test(value); 
        }, 
        message : '请输入中文' 
    }, 
    english : {// 验证英语 
        validator : function(value) { 
            return /^[A-Za-z]+$/i.test(value); 
        }, 
        message : '请输入英文' 
    }, 
    unnormal : {// 验证是否包含空格和非法字符 
        validator : function(value) { 
            return /.+/i.test(value); 
        }, 
        message : '输入值不能为空和包含其他非法字符' 
    }, 
    username : {// 验证用户名 
        validator : function(value) { 
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value); 
        }, 
        message : '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）' 
    }, 
    faxno : {// 验证传真 
        validator : function(value) { 
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value); 
        }, 
        message : '传真号码不正确' 
    }, 
    zip : {// 验证邮政编码 
        validator : function(value) { 
            return /^[1-9]\d{5}$/i.test(value); 
        }, 
        message : '邮政编码格式不正确' 
    }, 
    name : {// 验证姓名，可以是中文或英文 
            validator : function(value) { 
                return /^[\Α-\￥]+$/i.test(value)|/^\w+[\w\s]+\w+$/i.test(value); 
            }, 
            message : '请输入姓名' 
    },
    orgCode :{//组织机构代码
    	validator : function(value) { 
            return /^[A-Z0-9]{8}\-[A-Z0-9]$/i.test(value); 
        }, 
        message : '组织机构代码有误，正确格式为XXXXXXXX—X，仅限大写字母与数字' 
    },
    taxRegistrationNo :{//组织机构代码
    	validator : function(value) { 
            return /^[0-9]+$/i.test(value); 
        }, 
        message : '税务登记证号只能是数字' 
    },
    bizLicenseNo :{//
    	validator : function(value) { 
            return /^[0-9]+$/i.test(value); 
        }, 
        message : '营业执照号码只能是数字' 
    },
    
    mainlandTravelPermit:{//来来往大陆通行证
    	validator : function(value) { 
            return /^([0-9]|[a-zA-Z]){1,20}$/i.test(value); 
        }, 
        message : '只能是20位内数字或字母' 
    },
    passport:{//护照
    	validator : function(value) { 
            return /^[0-9]{1,30}$/i.test(value); 
        }, 
        message : '只能是30位内数字' 
    },
    numOrLetter:{//
    	validator : function(value) { 
            return /^([0-9]|[a-zA-Z])+$/i.test(value); 
        }, 
        message : '数字或字母' 
    },
    integerSix: {
		validator: function (value) {
			return /^[0-9]{6}$/.test(value);
		},
		message: '请输入6位整数'
	},
	biggerThanZero : {
		validator: function (value) {
			var reg = /^[0-9]+$/;//验证整数
			var flag = false;
			if(reg.test(value)) {
				if(value > 0) {
					flag = true;
				}
			}
			return flag;
		},
		message: '请输入正整数'
	},
	telephone:{
		validator:function(value){
			return /^([0-9]{3,4}\-)?[0-9]{7,8}(\-[0-9]{1,4})?$/.test(value);
		},
		message: '请输入正确的电话号码，区号、直拨号和分机号间用"-"分隔'
	},
	tel:{
		validator: function (value) {
			return /^[0-9]{8}$/.test(value);
		},
		message: '座机必须是8位数字'
	},
	telAreaCode:{//区号
		validator: function (value) {
			return /^[0-9]{3,4}$/.test(value);
		},
		message: '区号必须是3到4位的数字'
	},
	orgcodePrefix:{
		validator: function (value) {
			return /^[0-9A-Z]{8}$/.test(value);
		},
		message: '8位数字或大写字母'
	},
	orgcodeSuffix:{
		validator: function (value) {
			return /^[0-9A-Z]$/.test(value);
		},
		message: '数字或大写字母'
	},
	shroffAccountNumber:{
		validator: function (value) {
			return /^[0-9]{6,25}$/.test(value);
		},
		message: '公司对公账户由6-25个数字组成'
	},
    brandEnName :{//品牌英文名（仅用于品牌库的添加和编辑页面）
    	validator : function(value) { 
    		var isExist = false;
    		$.ajax({
    			url:basepath+"/brand/isBrandEnNameExist.form",
    			type:"POST",
				dataType:"json",
				async:false,
				data:{
					'brandId':$("#id").val(),
					'brandEnName':value
				},
				success:function(respData){ 
					if(null !=respData && "yes"==respData.result){
						isExist = true;
					}
				}
    		});
    		
    		
            return !isExist; 
        }, 
        message : '名称已存在'
    },
    brandCnName :{//品牌中文名（仅用于品牌库的添加和编辑页面）
    	validator : function(value) { 
    		
    		var isExist = false;
    		$.ajax({
    			url:basepath+"/brand/isBrandCnNameExist.form",
    			type:"POST",
				dataType:"json",
				async:false,
				data:{
					'brandId':$("#id").val(),
					'brandCnName':value
				},
				success:function(respData){ 
					if(null !=respData && "yes"==respData.result){
						isExist = true;
					}
				}
    		});
    		
            return !isExist; 
        }, 
        message : '名称已存在'
    },
    companyName :{//组织机构代码
    	validator : function(value) { 
    		var isExist = false;
    		$.ajax({
    			url:basepath+"/regApply/isCompanyExist.form",
    			type:"POST",
				dataType:"json",
				async:false,
				data:{
					'companyName':value,
					'applyId':$("#id").val()
				},
				success:function(respData){ 
					if(null !=respData && "yes"==respData.result){
						isExist = true;
					}
				}
    		});
    		
    		
            return !isExist; 
        }, 
        message : '公司名已存在'
    },
    shopName:{//店铺名称
    	validator : function(value) { 
    		
    		if( -1 != value.indexOf("网") || -1 != value.indexOf("商城") || -1 != value.indexOf("飞牛") || -1 != value.indexOf("馆") || -1 != value.indexOf("旗舰店") || -1 != value.indexOf("专卖店")|| -1 != value.indexOf("专营店") ){
    			return false;
    		}
    		
            return true; 
        }, 
        message : '店铺名称请使用公司名或品牌名，15个字以内，不能出现”“网”、“商城”、“馆”、“飞牛”，也不要输入“旗舰店”、“专卖店”、“专营店”'
    },
    minSkuNum:{//组织机构代码
    	validator : function(value) { 
    		
    		
            return /^[0-9]+$/i.test(value) && parseInt(value) >=30; 
        }, 
        message : '飞牛SKU数必须为整数且不能小于30' 
    },
    legalPersonName:{//法人姓名
    	validator : function(value) { 
    		if($.trim(value).length<2){
    			return false;
    		}
    		
            return /^[a-zA-z\u4e00-\u9fa5\.\s]*$/.test($.trim(value)); 
        }, 
        message : '法人姓名不正确' 
    },selectValueRequired: {
    	//下拉列表非空验证
    	validator: function(value,param){
    		// console.info($(param[0]).find("option:contains('"+value+"')").val()); 
    		return value != '0';  
    		},  
    		message: '必填项'
    		},
    selectValueZero: {
    	//下拉列表非空验证
    	validator: function(value,param){
    		// console.info($(param[0]).find("option:contains('"+value+"')").val()); 
    		return value != '0';  
    		},  
    		message: '必填项'
    		}
});
