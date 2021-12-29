//lms-course-list-course-name-container


let selections = []
let bright = 245
let gray = `rgb(${bright}, ${bright}, ${bright})`

//本処理
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
    if (selections.length == 0){
        for (let i=0; i<$(".module-toggle-panel__body-inner table tr").length; i++){
            selections.push("")
        }
    }

    getcheck().then(items => {
        selections = items

        if (selections == undefined){
            selections = []
            for (let i=0; i<$(".module-toggle-panel__body-inner table tr").length; i++){
                selections.push("")
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
    })

    $('.uncheck_all').on('click', function() {
        $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem) {
            elem.checked = false
            $(elem).parent().show()
        });
    })

    $('.HideRow').on('click', function(){
        $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem){
            check_delete()
        });
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

//本処理終わり

function getcheck(){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["selections"], (items) => {
            if (chrome.runtime.lastError){
                return reject(chrome.runtime.lastError)
            }
            resolve(items.selections)
        })
    })
}

function check_delete(){
    $(".module-toggle-panel__body-inner table tr .HideRow").each(function(i, elem){
        if(elem.checked){
            selections[i] = true
        }else{
            selections[i] = ''
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