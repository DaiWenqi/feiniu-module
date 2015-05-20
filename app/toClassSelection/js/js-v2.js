var json={"code":"200","data":{"cagetoryGroups":[{"gpSeq":"CG100449","gpName":"摄影摄像","gpPSeq":"CG100482"},{"gpSeq"
:"CG100564","gpName":"手机","gpPSeq":"CG100482"},{"gpSeq":"CG100406","gpName":"数码影音","gpPSeq":"CG100482"
},{"gpSeq":"CG100724","gpName":"电话机、对讲机","gpPSeq":"CG100482"},{"gpSeq":"CG100399","gpName":"手机配件","gpPSeq"
:"CG100482"},{"gpSeq":"CG100450","gpName":"摄像配件","gpPSeq":"CG100482"},{"gpSeq":"CG100820","gpName":"test群组","gpRemark":"aaa","gpPSeq":"CG100482"}]},"msg":"success"};



// console.log(json.data);

var lev1Categories = json.data.cagetoryGroups;

//-------类目弹出窗-----------------------------------------------------------------------
		//类目选择框选择事件
		$("#categoryDlg").on("change","select",function(){
			
			$("#categoryDlg .js_show_categoryLI").html("");
			//移除下级下拉框
			var curIndex = $("#categoryDlg select").index(this);
			$("#categoryDlg select:gt("+curIndex+")").remove();
			var categorySeq = this.value;
			var $curSelect = $(this);
			if("" == categorySeq){
				return;
			}
			
			//加载下一级类目下拉框
			// marketing_platform.ajaxSend({
			//    	 type : "POST",
			//    	 url : interfaceParameter.interface_url,
	  //            data:{
	  // 		       method: 'feiniu.pmpromotion.activity.getcategorydata',
	  // 			   params:JSON.stringify({
	  // 				   'type':1,
	  // 				   'nodeId': categorySeq
	  // 			   })
	  // 		     },
	  //            dataType : 'json',
	  //            successfn : function(resp){
	            	 // if("200"==resp.code){
	            	    
	            		
	             		// var lev1Categories=resp.data.cagetoryGroups;
	             		
	             		if(!lev1Categories || 0 == lev1Categories.length){
	             			return;
	             		}
	             		var str = "<select date-category='js_p_select' style='margin-left:20px;'><option value=''>请选择</option>";
	                  	$.each( lev1Categories, function(i, n){
	                  		
	                  		str += "<option value = '"+ n.gpSeq +"'>"+n.gpName+"</option>";
	                  	});
	                  	str += "</select>";
	                  	$curSelect.after(str);
	             	// }
			// 	},
			// 	errorfn : function(resp){
			// 		marketing_platform.log('ajaxSend 出错！');
			// 	}
			// // });
			
			//加载叶子类目
			if(0 == curIndex){//如果是第一级类目则不加载叶子类目
				return;
			}

		
			
	
			
		});


		//添加到右边
		$(".tool_popup").on('click',".js_show_categoryLI li",function(){
      		
      		var $li = $(this);
      		var id = $li.attr('role-number');
      		var name = $li.text();
      		
      		if(!id || "" == id){
      			return;
      		}
      		
      		
      		var isadd = true;
      		$li.closest(".tool_popup").find(".add_con em").each(function(){
      			
      			var roleNum = $(this).find("span").attr("role-number");
      			if(id == roleNum){
      				isadd = false;
      			}
      		});
      		
      		if(isadd){
      			$li.closest(".tool_popup").find(".add_con").append('<em><span role-number='+ id +'>'+ name +'</span><ins class="remove"></ins></em>');
      		}
      		
      	});
		
		



			//添加所有
		$(".tool_popup").on('click',".add_all",function(){alert();
			var  $tool_popup = $(this).closest(".tool_popup");
			
			if(1 == $tool_popup.find(".js_show_categoryLI li").length 
					&& !$tool_popup.find(".js_show_categoryLI li").attr("role-number")){
				return;
			}
			
      		$tool_popup.find(".js_show_categoryLI li").each(function(){
      			var _this = this;
          		var id = $(_this).attr('role-number');
          		var name = $(_this).text();
          		
          		//去重
          		var isChoosed = false;
          		$tool_popup.find(".add_con em").each(function(){
          			if(id == $(this).find("span").attr("role-number")){
          				isChoosed = true;
          			}
          		});
          		
          		if(!isChoosed){
          			$tool_popup.find(".add_con").append('<em><span role-number='+ id +'>'+ name +'</span><ins class="remove"></ins></em>');
          		}
          		
      		});
      		
      	});


      	//删除右边所选
		$(".tool_popup").on('click',".add_con .remove ",function(){
      		$(this).parent().remove();
      	});