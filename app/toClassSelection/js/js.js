		var all_ul = $('.cate').find('li');
		

		var add_div = $('.add_con');	
	

		$('.tool_seach').off().on('click',function(){
								var thisBtn = $(this);
								thisBtn.parents('.tool_con').find('.tool_ifi').show();
								// showifi(thisBtn);
								
							});

		//点击添加全部
		$('.add_all').off('.product').on('click.product',function(){
			    

				var sHtml="";
				// $('.add_con').html("");

				all_ul.each(function(i){
					var addid = $(all_ul[i]).attr("role-number");
					var addname = $(all_ul[i]).text();
					var new_em = $('<em><span role-number='+ addid+'>'+ addname +'</span><ins class="remove"></ins></em>');	
					add_div.append(new_em);
					
				});


				add_div.append(sHtml);

			
			$('.remove').on('click',function(){
				$(this).parent().remove();
			});
		});

		//点击添加单个
		$(".tool_popup .cate li").on("click",function(){
			var $this=$(this);
			var addid = $this.attr("role-number");
			var addname=$this.text();
			var new_em = $('<em><span role-number='+ addid+'>'+ addname +'</span><ins class="remove"></ins></em>');

			add_div.append(new_em);
		});



	//选择弹窗收索按钮调用方法 
		function showifi(thisbtn){
			//有数据则显示列表
			thisBtn = $(thisbtn);
			
			
			//获取文本框信息
			var text = thisBtn.prev(".searchText").val();
			
			var thisUl = $(".js_show_categoryLI");
    		thisUl.html("");
			if(text!=""){
				

				/*ajax 数据渲染*/

				/*收索渲染数据=============*/
				$.ajax({
				   	 type : "GET",
				             url : interfaceParameter.me_category_query,
				             dataType : 'json',
				             success : function(resp){
				            	 if("200"==resp.code){
				            		var str = "";
				             		var dataSelect=resp.data;
				                  	$.each( dataSelect, function(i, n){
				                  		str += "<li role-number = "+ n.categoryId +">"+n.categoryName+"</li>";
				                  	});
				                  	
				                  	thisUl.html(str);
				                  	thisBtn.parents('.tool_con').find('.tool_ifi').css('display','block');
				                  	$('li',thisUl).off().on('click',function(){
				                  		
				                  		var _this = this;
				                  		var id = $(_this).attr('role-number');
				                  		var name = $(_this).text();
				                  		moveRight(id,name);
				                  		
				                  	});
				             	}
					},
					error : function(resp){
						marketing_platform.log('ajaxSend 出错！');
						
					}
				});
			}else{
				thisBtn.parents('.tool_con').find('.tool_ifi').css('display','none');
			}
		}

		