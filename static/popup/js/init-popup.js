/**
 * Created by daiwenqi on 2015/1/6.
 */


var popHtml_1=''
    +'<div class="cm_popup creat_defeat" style="">'
    +'<div class="cm_popup_cont">'
    +'<div class="pop_hd"><span class="txt">温馨提示</span><span class="pop_close"></span></div>'
    +'<div class="pop_bd">'
    +'<div class="cont">'
    +'<span class="icon"></span>活动创建成功！'
    +'</div>'
    +'</div>'
    +'<div class="ft w60"><a href="##" class="btn_ok mr30">确认</a></div>'
    +'</div>'
    +'</div>';

var popHtml_2=''
    +'<div class="cm_popup creat_success">'
    +'<div class="cm_popup_cont">'
    +'<div class="pop_hd"><span class="txt">温馨提示</span><span class="pop_close"></span></div>'
    +'<div class="pop_bd">'
    +'<div class="cont">'
    +'<span class="icon"></span>活动创建成功！'
    +'</div>'
    +'</div>'
    +'<div class="ft w60"><a href="##" class="btn_ok mr30">确认</a></div>'
    +'</div>'
    +'</div>';

var popHtml_3=''
    +'<div class="cm_popup confirm_delete">'
    +'<div class="cm_popup_cont">'
    +'<div class="pop_hd"><span class="txt">温馨提示</span><span class="pop_close"></span></div>'
    +'<div class="pop_bd">'
    +'<div class="cont">'
    +'<span class="icon"></span>请确定是否删除选中的活动！'
    +'</div>'
    +'</div>'
    +'<div class="ft"><a href="##" class="btn_ok mr30">确认</a><a href="##" class="btn_cancle">取消</a></div>'
    +'</div>'
    +'</div>';

var popHtml_4=''
    +'<div class="cm_popup confirm_delete_s2">'
    +'<b class="cm_pop_arrow"></b>'
    +'<div class="pop_bd">'
    +'<div class="cont">抱歉，套装商品不能是特殊类目</div>'
    +'</div>'
    +'<div class="ft"><a href="##" class="btn_ok mr30">确认</a><a href="##" class="btn_cancle">取消</a></div>'
    +'</div>';

var popHtml_5=''
    +'<div class="cm_popup creat_warn" style="">'
    +'<div class="cm_popup_cont">'
    +'<div class="pop_hd"><span class="txt">温馨提示</span><span class="pop_close"></span></div>'
    +'<div class="pop_bd">'
    +'<div class="cont">'
    +'<span class="icon"></span>活动创建成功！'
    +'</div>'
    +'</div>'
    +'<div class="ft w60"><a href="##" class="btn_ok mr30">确认</a></div>'
    +'</div>'
    +'</div>';



$(".inp_1").click(function() {

    myPopup({
        "popHtml":popHtml_1,
        "elem": ".creat_defeat",
        "close": ".pop_close,.btn_ok,.btn_cancle",
        "okClass":".btn_ok",
        okFn:function(){
            alert("执行确认回调")
        },
       "okClass":".btn_ok",
        cancelFn:function(){
            alert("执行取消回调")
        },
        noMask:true

    })
})



$(".inp_2").click(function() {
    var d  = myPopup({
        "popHtml":popHtml_2,
        "elem": ".creat_success",
        "close": ".pop_close,.btn_ok,.btn_cancle",
        "ok":{sClass:".btn_ok",callback:""},
        "cancel":{sClass:"",callback:""}
    });

    setTimeout(function(){
        d.hideModel();
    },2000);
})

$(".inp_3").click(function() {
    myPopup({
        "popHtml":popHtml_3,
        "elem": ".confirm_delete",
        "close": ".pop_close,.btn_ok,.btn_cancle",
        "ok":{sClass:".btn_ok",callback:""},
        "cancel":{sClass:".btn_cancle",callback:""}
    })
})

$(".inp_4").click(function() {
    myPopup({
        "popHtml":popHtml_4,
        "elem": ".confirm_delete_s2",
        "close": ".pop_close,.btn_ok,.btn_cancle",
        "ok":{sClass:".btn_ok",callback:""},
        "cancel":{sClass:".btn_cancle",callback:""}
    })
})

$(".inp_5").click(function() {
    myPopup({
        "popHtml":popHtml_5,
        "elem": ".creat_warn",
        "close": ".pop_close,.btn_ok,.btn_cancle",
        "ok":{sClass:".btn_ok",callback:""},
        "cancel":{sClass:".btn_cancle",callback:""}
    })
})