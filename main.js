let bright = 245
let gray = `rgb(${bright}, ${bright}, ${bright})`
let url = location.href
let selections = []

//LMS
if (url == "https://acanthus.cis.kanazawa-u.ac.jp/base/lms-course/list"){
    $(document).ready(function(){
        $(".module-operation-container" + ".module-operation-container--type_nomal" + ".lms-list-search-area").children("div").hide()
        $("#js-header").hide()
        $("#lms-course-list-check-expand-btn").hide()
        $('.js-btn_on').hide()
        $("body").prepend("<button id='menu'>menu</button>")
    
        $(".home-menu-container").eq(-1).after($(".home-menu-container").eq(0))
    
        //空白を狭くする
        $("div").css("padding-top", "5px")
        $("div").css("padding-bottom", "5px")
    
        let element = $(".module-toggle-panel__title-area > a")
        for (let i=0; i<element.length; i++){
    
            //レイアウト調整
            if($(".module-toggle-panel__title-area > a").eq(i).text().indexOf("授業") == -1){
                openAndClosePanel(element.eq(i))
            }else{
                $(".module-toggle-panel__title-area").eq(i).prepend('\
                <button class="hide" type="button">hide</button>\
                <button class="show" type="button">show</button>\
                <button class="check_all" type="button">check all</button>\
                <button class="uncheck_all" type="button">uncheck all</button>')
            }
        }
    
        //チェックボックス
        $("table *").css("width", "")
        $(".module-toggle-panel__body-inner table tr").prepend('<td><input type="checkbox" class="HideRow"></td>');
        $(".module-toggle-panel__body-inner table th").parent().find("input").parent().replaceWith('<th><input type="checkbox" class="HideRow" disabled></th>')
    
        //chromeitems
        getcheck().then(items => {
            selections = items
            if (selections == undefined){
                for (let i=0; i<$(".module-toggle-panel__body-inner table tr").length; i++){
                    selections.push(false)
                }
            }
    
            for(let i=0; i<selections.length; i++){
                $(".module-toggle-panel__body-inner table tr .HideRow").each(function (i, elem) {
                    
                    if (selections[i]) {
                        elem.checked = true
                        $(elem).parent().parent().hide();
                    };
                });
            }
            $(".module-toggle-panel__body-inner table tr .HideRow").parent().parent().filter(":visible").filter(":odd").css("background-color",gray)
    
        })
    
        //action
        $('.hide').on('click', function() {
            $(".module-toggle-panel__body-inner table tr .HideRow").each(function (i, elem) {
                if (elem.checked) {
                    $(elem).parent().parent().hide();
                };
            });
    
            $(".module-toggle-panel__body-inner table tr .HideRow").parent().parent().filter(":visible").filter(":odd").css("background-color",gray)
            $(".module-toggle-panel__body-inner table tr .HideRow").parent().parent().filter(":visible").filter(":even").css("background-color","white")
    
        })
    
        $('.show').on('click', function() {
            $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem) {
                $(elem).parent().parent().show()
            });
            $(".module-toggle-panel__body-inner table tr .HideRow").parent().parent().filter(":visible").filter(":odd").css("background-color",gray)
            $(".module-toggle-panel__body-inner table tr .HideRow").parent().parent().filter(":visible").filter(":even").css("background-color","white")
        })
    
        $('.check_all').on('click', function() {
            $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem) {
                elem.checked = true
                $(elem).parent().show()
            });
            $(".module-toggle-panel__body-inner table th").parent().find("input").prop('checked', false)
            check_delete()
            chrome.storage.sync.set(
                {
                    "selections": selections,
                }
            );
        })
    
        $('.uncheck_all').on('click', function() {
            $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem) {
                elem.checked = false
                $(elem).parent().show()
            });
            check_delete()
            chrome.storage.sync.set(
                {
                    "selections": selections,
                }
            );
        })
    
        $('.HideRow').on('click', function(){
            check_delete()
            chrome.storage.sync.set(
                {
                    "selections": selections,
                }
            );
            getcheck()   
        })
        
        $("#menu").on("click", function(){
            if($(".module-operation-container" + ".module-operation-container--type_nomal" + ".lms-list-search-area").children("div").is(":visible")){
                $(".module-operation-container" + ".module-operation-container--type_nomal" + ".lms-list-search-area").children("div").slideUp(100)
                $("#js-header").slideUp(100)  
                $("#lms-course-list-check-expand-btn").slideUp(100)
                $('.js-btn_on').slideUp(100)
            }else{
                $(".module-operation-container" + ".module-operation-container--type_nomal" + ".lms-list-search-area").children("div").slideDown(100)
                $("#js-header").slideDown(100)    
                $("#lms-course-list-check-expand-btn").slideDown(100)
                $('.js-btn_on').slideDown(100)
            }
            
        })
    })
    //eduweb
}else if (url == "https://eduweb.sta.kanazawa-u.ac.jp/portal/StudentApp/Blank.aspx#regist_results"){
    __doPostBack('ctl00$bhHeader$ctl30$lnk', '')
}else if (url == "https://eduweb.sta.kanazawa-u.ac.jp/portal/StudentApp/Regist/RegistList.aspx"){
    $(document).ready(function(){
        const $select = $("#ctl00_phContents_ucRegistSearchList_ddlTerm")
        getquater().then(items => {
            quater = items
            if ($select.val() !== quater) {
                $select.val(quater)
                setTimeout(
                    '__doPostBack(\'ctl00$phContents$ucRegistSearchList$ddlTerm\',\'\')',
                    0)
            }
            const offsetTop = $("#ctl00_phContents_rrMain_ttTable_lblYearTerm").offset()
                .top;
            $("html, body").animate({
                scrollTop: offsetTop
            }, 20);
        })

        $select.on('change', function() {
            chrome.storage.sync.set({
                "quater": $select.val(),
            });
        })
    })
}

function getcheck(){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["selections"], (items) => {
            console.log(items)
            if (chrome.runtime.lastError){
                return reject([])
            }
            return resolve(items.selections)
        })
    })
}

function getquater() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(["quater"], (items) => {
			if (chrome.runtime.lastError) {
				return reject("11")
			}
            if (items.quater == undefined){
                resolve("11")
            }else{
                resolve(items.quater)
            }
		})
	})
}

function check_delete(){
    $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem){
        if(elem.checked){
            selections[i] = true
        }else{
            selections[i] = false
        }
    })
}

function openAndClosePanel(btn) {

    // パネルエリアのdivタグ要素を取得
    var $panel = $(btn).closest(".module-toggle-panel");

    if($panel.hasClass("is-open")) {
        // パネルがオープン中の場合はクローズする
        $panel.find(".module-toggle-panel__body-inner").hide();
        $panel.removeClass("is-open");
    } else {
        // パネルがクローズ中の場合はオープンする
        $panel.find(".module-toggle-panel__body-inner").show();
        $panel.addClass("is-open");
    }
}

function __doPostBack(eventTarget, eventArgument) {
	let theForm = document.forms['aspnetForm'];
	if (!theForm) {
		theForm = document.aspnetForm;
	}
	if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
		theForm.__EVENTTARGET.value = eventTarget;
		theForm.__EVENTARGUMENT.value = eventArgument;
		theForm.submit();
	}
}