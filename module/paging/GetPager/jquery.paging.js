/**
*自定义jquery分页插件 函数名称GetPager
*输入参数 
*GetPager(int nTotal, int nCurrentPage, int nPageSize, string sClickMethod)
*total: 总页数
*currentPage 当前页
*pagesize: 每页显示条数
*clickMethod :执行函数
*pagetype:分页样式 （1:10页为一排 上下页；
2：） 作为以后拓展
*/

$.fn.extend({
	GetPager: function(option) {
		if (option.currentPage <= 0) option.currentPage = 1;
		if (option.pagesize <= 0) option.pagesize = 20;
		if (option.clickMethod == "") option.clickMethod = "SelPage";
		var sb = "";
		if (option.currentPage > 1) {
			sb += "<a href='javascript:' class=\"page_able\" onclick=\"" + option.clickMethod + "(" + (option.currentPage - 1) + ");\">«上一页</a>";
		} else {
			sb += "<span class=\"page_off\">«</span>";
		}

		var vPages = 0;
		if (option.total % option.pagesize > 0) {vPages = (option.total / option.pagesize) + 1;}
		else {vPages = option.total / option.pagesize;console.log(vPages)}
		if (option.currentPage > vPages) option.currentPage = vPages;
		if (option.currentPage < 1) option.currentPage = 1;

		if (option.currentPage > 5) {
			sb += LoopStr(1, 2, option.currentPage, option.clickMethod);
			sb += "<span class=\"page_on\">...</span>";
			if (vPages > option.currentPage + 3) {
				sb += LoopStr(option.currentPage - 2, option.currentPage + 2, option.currentPage, option.clickMethod);
				sb += "<span class=\"page_on\">...</span>";
				sb += LoopStr(vPages - 1, vPages, option.currentPage, option.clickMethod);
			} else {
				sb += LoopStr(option.currentPage - 2, vPages, option.currentPage, option.clickMethod);
			}
		} else {
			if (vPages < option.currentPage + 5) sb += LoopStr(1, vPages, option.currentPage, option.clickMethod);
			else {
				sb += LoopStr(1, option.currentPage + 2, option.currentPage, option.clickMethod);
				sb += "<span class=\"page_on\">...</span>";
				sb += LoopStr(vPages - 1, vPages, option.currentPage, option.clickMethod);
			}
		}
		if (option.currentPage < vPages) {
			sb += "<a href='javascript:' class=\"page_able\" onclick=\"" + option.clickMethod + "(" + (option.currentPage + 1) + ");\">下一页»</a>";
		} else sb += "<span class=\"page_off\">»</span>";

		$("#" + option.divHtml).html(sb);
	}

});

function LoopStr(vMin, vMax, vCurrentPage, vClickMethod) {
	var sb = "";
	for (i = vMin; i <= vMax; i++) {
		if (i == vCurrentPage) sb += "<strong class=\"page_on\">" + i + "</strong>";
		else {
			sb += "<a href='javascript:' class=\"page_able\" onclick=\"" + vClickMethod + "(" + i + ");\">" + i + "</a>";
		}
	}

	return sb;
}