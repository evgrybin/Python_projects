function startLoadingAnimation() // - функция запуска анимации
{
    $(".preload_overlay").css("display", "block");
} 
function stopLoadingAnimation() // - функция останавливающая анимацию
{
    $(".preload_overlay").hide();
}

var code = '<div style="display: none;" class="callback_window"><div class="box-modal-callback" id="cb-okno"><div class="cb-box-header">Наш оператор свяжется с Вами в ближайшее время</div><div class="callback-body"><input type="text" name="name" placeholder="Ваше имя"><input type="text" name="phone" value="+7" placeholder="Номер телефона"><div class="user_agree_container"><input type="checkbox" name="agree" id="soglasen"> Настоящим подтверждаю, что я ознакомлен и согласен с условиями политики конфиденциальности и даю согласие на обработку моих персональных данных. <br><a href="/user_policy/" target="blank">Подробнее</a></div><button type="button" class="send" onclick="send_info();">Отправить</button></div></div></div>';
$(document).ready(function() {
    $("body").append(code);
}) 
function callback_window() {
    var data = $("div.callback_window").html();
    $.fancybox.open(data);
}    
function feedbackForm() {
    var data = $("div.feedback_container").html();
    //$.fancybox.open(data);    
    $.fancybox.open({
        src: "div.feedback_container",
        type: 'inline',
        opts: {
            afterLoad : function(instance, current) {
                $("input[type=file]").on('change', function(){
                    $(this).parent(".file_selector_group").find(".file_container.trigger").html("Прикрепить фото ("+this.files.length+")");
                });                 
            }              
        } 
    })    
} 
function indexFeedbackForm() {
    var data = $("div.feedback_container").html();              
    $.fancybox.open({
        src: "div.feedback_container",
        type: 'inline',
        opts: {
            afterLoad : function(instance, current) {
                $("input[type=file]").on('change', function(){
                    $(this).parent(".file_selector_group").find(".file_container.trigger").html("Прикрепить фото ("+this.files.length+")");
                });                 
            }              
        } 
    })
}
function send_info() {

    if($("#soglasen").prop("checked") === false)
    {
        alert("Для отправки заявки необходимо Ваше согласие на обработку персональных данных!");
        return false;
    }    


    var name = $("#cb-okno").children(".callback-body").children("input[name='name']").val();
    if(name == "") {
        alert("Пожалуйста, введите имя!");
        return;
    }     
    var phone = $("#cb-okno").children(".callback-body").children("input[name='phone']").val();
    var email = $("#cb-okno").children(".callback-body").children("input[name='email']").val();
    if(phone == "") {
        alert("Пожалуйста, введите номер телефона!");
        return;
    }        

    $.post( "/post.php", { "name": name, "phone": phone  })
    .done(function( data ) {
        $(".callback-body").html("");
        $(".cb-box-header").remove();
        $(".callback-body").html("<b>Благодарим Вас за обращение!</b>");
    });   

}  
function send_callback() {
    if($("#soglasen").prop("checked") === false)
    {
        alert("Для отправки заявки необходимо Ваше согласие на обработку персональных данных!");
        return false;
    }    


    var name = $("#cb-okno").children(".callback-body").children("input[name='name']").val();
    if(name == "") {
        alert("Пожалуйста, введите имя!");
        return;
    }     
    var phone = $("#cb-okno").children(".callback-body").children("input[name='phone']").val();
    if(phone == "") {
        alert("Пожалуйста, введите номер телефона!");
        return;
    }      
    $.post( "/post.php", { "name": name, "phone": phone })
    .done(function( data ) {
        $(".callback-body").html("");
        $(".callback-body").html("Благодарим Вас за обращение!<br>Пожалуйста, ожидайте звонка.");
    });   

}  
function send_feedback() {
    if($(".feedback_window #soglasen").prop("checked") === false)
    {
        alert("Для отправки отзыва необходимо Ваше согласие на обработку персональных данных!");
        return false;
    }        


    var name = $(".feedback_window input[name=name]").val();
    var phone = $(".feedback_window input[name=phone]").val();
    var feedback = $(".feedback_window textarea[name=feedback]").val();
    var rest_id = $(".feedback_window input[name=feedback_id]").val();
    if(rest_id == undefined) {
        var rest_id = $(".feedback_window select[name=feedback_id]").val();
    }
    var temp = parseInt(rest_id, 10);

    if(temp == 0 || isNaN(temp)) {
        alert("Пожалуйста, выберите заведение!");
        return false;        
    }
    
    
    if(name == "") {
        alert("Пожалуйста, введите имя!");
        return;
    }
    if(phone == "") {
        alert("Пожалуйста, введите номер телефона!");
        return;        
    }       
    if(feedback == "") {
        alert("Пожалуйста, введите текст отзыва!");
        return;        
    }     

    var fd = new FormData;
    var file =  $(".feedback_window").find("input[type=file]");
    result = file.prop('files')[0];
    var count = 0;
    while(result != undefined) {
        fd.append('img[]', file.prop('files')[count]);
        count++;
        result = file.prop('files')[count];   
    }    
    fd.append('name', name);
    fd.append('phone', phone);
    fd.append('feedback', feedback);
    fd.append('rest_id', rest_id);
    $.fancybox.close( true );
    startLoadingAnimation();
    $.ajax({
        url: '/add_feedback.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            console.log("datais: "+data);
            if(data == "true") {
                $(".feedback_window").html("<div style='text-align: center;'>Благодарим Вас за отзыв!<br>Он будет опубликован после проверки.</div>");
            }
            else if (data == "phone") {
                alert("Пожалуйста, введите корректный номер телефона!");
            }
            else {
                alert("Ошибка! Пожалуйста, попробуйте еще раз.");
            }            
            
            stopLoadingAnimation();
            $(".feedback_window").parent(".file_upload_form").parent(".form").find("textarea[name=reply]").prop('disabled', true);
            $(".feedback_window").parent(".file_upload_form").parent(".form").find("textarea[name=reply]").val("Ваше сообщение будет опубликовано после прохождения модерации, спасибо!"); 
            $.fancybox.open($(".feedback_window").html());
        }
    });        


    
    
    /*$.post("/add_feedback.php", { "name": name, "phone": phone, "feedback": feedback, "rest_id": rest_id, })
    .done(function( data ) {
        if(data == "true") {
            $(".feedback_window").html("<div style='text-align: center;'>Благодарим Вас за отзыв!<br>Он будет опубликован после проверки.</div>");
        }
        else if (data == "phone") {
            alert("Пожалуйста, введите корректный номер телефона!");
        }
        else {
            alert("Ошибка! Пожалуйста, попробуйте еще раз.");
        }
    });*/ 
    
    
           
}
$(document).ready(function () {

    $(".menu_trigger").click(function() {
        $(".menu").toggleClass("active");
        $("#global100").toggleClass("menu_right");    
        $("#global100 .logo_line").toggleClass("active");
    });


    /*$("body").append('<script src="/plugins/jquery.maskedinput.js"></script>');
    $("input[name=phone]").mask("+7 (999) 999-9999");
    $("input[name=Телефон]").mask("+7 (999) 999-9999");*/
    $("body").append('<script src="/plugins/jquery.mask.js"></script>');    
    $('input[name=phone]').mask('+7 (000) 000-0000',{autoclear: false});
    $('input[name=Телефон]').mask('+7 (000) 000-0000',{autoclear: false});

    

});
