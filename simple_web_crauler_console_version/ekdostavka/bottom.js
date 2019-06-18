function makeIndexRClicable() {
    $(".rest_index .container > .block").click(function() {
        var href = $(this).children(".alt").children("a").attr("href");
        document.location.href=href;
    })
}

function removeDeliveryadress(id) {
    $.ajax("https://ekdostavka.ru/lk/removeDeliveryadress/"+id).done(function(data) {
        $(".main_page .whiteblock .personal_column .adress").each(function() {
            if( $(this).attr("attr-delivid") == id ) {
                $(this).remove();
            }
        })
    })
}
////// меняем количество в корзине /////
function setCountTrigger() {
    $(".basket_container .data .container.item .block > .count > div").click(function() {
        var id = $(this).parent(".count").children("input[name=count]").attr('attr-id');
        var count = parseInt($(this).parent(".count").children("input[name=count]").val(), 10);
        if( $(this).hasClass("plus") === true) {

            $.get("https://ekdostavka.ru/lk/count_plus/"+id+"/").done(function(data) {
                var result = parseInt(data, 10);
                $("#basketCount").html(result);
                makeBasket(); 
            });
        } 
        else {
            if(count == 0) {
                return;
            }
            $.get("https://ekdostavka.ru/lk/count_minus/"+id+"/").done(function(data) {
                var result = parseInt(data, 10);
                $("#basketCount").html(result);                
                makeBasket();
            }); 
        }
    })
}
////// меняем количество в корзине /////

////// удаляем товар из корзины /////
function setDelTrigger() {
    $(".basket_container .data .container.item .remove > .del").click(function() {
        var id = $(this).attr("attr-id");
        $.ajax("//ekdostavka.ru/lk/remove/"+id+"/").done(function(data) {
            var result = parseInt(data, 10);
            $("#basketCount").html(result);            
            makeBasket();
        })
    })
}
////// удаляем товар из корзины /////
function show_basket() {
    $(".overhead").fadeToggle(300, function() {
        $(".basket_container").css("display", "block");
    });
}
function clearBasket() {
    $.ajax("/lk/remove/all/").done(function() {
        $("#basketCount").html(0);
        hideBasket();
        makeBasket();
    })
}

function hideBasket() {
    $(".overhead").fadeToggle(300, function() {
        $(".basket_container").css("display", "none");
    });
}
function checkPromocode() {
  var promocode = $(".basket_container .data .container.bottom input[name=promocode]").val();
  $.ajax("/promocode.php?code="+promocode).done(function(data) {
      if(data == 1) {
        $(".basket_container .data .container.bottom input[name=promocode]").removeClass("fail");
        $(".basket_container .data .container.bottom input[name=promocode]").addClass("success");
        makeBasket();              
      } else {
          $(".basket_container .data .container.bottom input[name=promocode]").removeClass("success");
          $(".basket_container .data .container.bottom input[name=promocode]").addClass("fail");
      }
      $(promocode_attempts).each(function(key, val) {
          clearTimeout(key);
          delete promocode_attempts[key];
      });      
  })
}
function makeBasket() {
    $.ajax("/get_basket.php").done(function(data) {
        if(data['result'] === true) {
            $(".basket_container").html(data['body']);
            
            if($("#realPricePromocode").html() != undefined) {
                $("#pageOrderPrice").html($("#realPricePromocode").html());
            } else {
                $("#pageOrderPrice").html(data['summ']);
            }
            setCountTrigger();
            setDelTrigger();
            setPromocodeDelay();            
        }
    })
}
makeBasket();
var promocode_attempts = new Array();
function setPromocodeDelay() {
  $(".basket_container input[name=promocode]").keypress(function() {
      $(promocode_attempts).each(function(key, val) {
          clearTimeout(key);
          delete promocode_attempts[key];
      });
      
      var temp = setTimeout(checkPromocode, 300);
      promocode_attempts[temp] = temp;
  }); 
  $(".basket_container input[name=promocode]").change(function() {
      $(promocode_attempts).each(function(key, val) {
          clearTimeout(key);
          delete promocode_attempts[key];
      });
      
      var temp = setTimeout(checkPromocode, 300);
      promocode_attempts[temp] = temp;
  });       
  $(".basket_container input[name=promocode]").mouseleave(function() {
      $(promocode_attempts).each(function(key, val) {
          clearTimeout(key);
          delete promocode_attempts[key];
      });
      
      var temp = setTimeout(checkPromocode, 300);
      promocode_attempts[temp] = temp;
  });    
}
//////сохраняем заказ
function orderSave() {
    if( $("input[name=orderPolicyAgree]").prop("checked") != undefined ) {
        
        if( $("input[name=orderPolicyAgree]").prop("checked") !== true ) {
            alert('Для регистрации необходимо Ваше согласие на обработку персональных данных!');
            return;
        }        
        
    }
    
    
    
    var orderData = {};
    var error = false;
    ///////////проходим по всем полям с классом required - вдруг что то не заполнено
    $(".required").each(function() {
        if( $(this).val() == "") {
            alert("Поле "+$(this).attr("attr-name")+" не заполнено!");
            error = true;
            return false;
        } else {
            orderData[$(this).attr("name")] = $(this).val();
        }
    });
    
    if(orderData['phone'] == "+7") {
        alert("Пожалуйста, укажите корректный номер телефона!");
        return;
    }
    
    if(orderData['phone'].length != 17) {
        alert("Пожалуйста, укажите номер в корректном виде (+7 (000) 000-0000)!");
        return;
    }
    
    orderData['entrace'] = $("input[name=entrance]").val();
    orderData['floor'] = $("input[name=floor]").val();
    orderData['flat'] = $("input[name=flat]").val();
    
    if(error === true) {
        return;
    }
    
    
    
    
    orderData['comment'] = $("textarea[name=comment]").val();
    
    //////////оплата
    orderData['payment'] = $("input[name=payment]:checked").val();
    if(orderData['payment'] == undefined) {
        alert("Пожалуйста, выберите форму оплаты!");
        return false;
    }
    //////////доставка
    orderData['delivery'] = $("input[name=shipment]:checked").val();
    if(orderData['delivery'] == undefined) {
        alert("Пожалуйста, выберите метод доставки!");
        return false;
    }   
    time_type = $("input[name=delivery_time_trigger]:checked").val();
    if(time_type == 1) {
        orderData['delivery_time'] = $("input[name=delivery_time]").val();
    }
    
    
    
    var additional = {};
    $(".additional:checked").each(function() {
        additional[$(this).val()] = $(this).val();
    });
    orderData['additional'] = additional;
    orderData['spendBally'] = $("input[name=ballySpend]").val();
    $.post("/lk/orderSave/", {"data": orderData}).done(function(data) {
        if(data['redirect'] != undefined) {
            document.location.href=data['redirect'];
        } else {
            if(data == "false") {
                alert("Возникла ошибка! Пожалуйста, попробуйте еще раз.");
            } else {
                $(".basket_data_column").slideUp(700);
                $("h1").slideUp(700, function() {
                    $("h1").html("Спасибо за Ваш заказ!");
                    $("h1").slideDown(700);
                });
                $(".basket_column").slideUp(700, function() {
                    $(".main_page .whiteblock").append("<div class='order_complete_text'>Мы получили Ваш заказ (#"+parseInt(data, 10)+") и скоро позвоним для уточнения деталей.</div>");    
                    $(".order_complete_text").slideDown("700");
                    $("#basketCount").html(0);
                    yaCounter23613004.reachGoal('orderComplete');
                });
            }            
        }
        console.log(data);
    })

}
$(".overhead").click(function() {
    hideBasket();
})
$(document).ready(function(){ 
  $(".index_slider .owl-carousel").owlCarousel({
      items: 1,
      autoplay: true,
  });
  var stock_owl = $(".stock_container .owl-carousel");
  stock_owl.owlCarousel({
    responsive:{
        0:{
            items:1,
        },
        700:{
            items:3,
        }
    }    
  });
  $(".stock_container .arrow.next").click(function(){
      stock_owl.trigger('next.owl.carousel');
  });
  $(".stock_container .arrow.prev").click(function(){
      stock_owl.trigger('prev.owl.carousel');
  });   
  var review_owl = $(".review_carousel .owl-carousel");
  review_owl.owlCarousel({
      margin: 15,
        responsive:{
            0:{
                items:1,
            },
            700:{
                items:3,
            }
        }        
  });
  $(".review_carousel .arrow.next").click(function(){
      review_owl.trigger('next.owl.carousel');
  });
  $(".review_carousel .arrow.prev").click(function(){
      review_owl.trigger('prev.owl.carousel');
  });  
  
  
  
  
  ///////////////// триггер для блока "рестораны сети"
  function restListTrigger() {
      $(".rest_index .trigger .block").click(function() {
          $(".rest_index .trigger .block").removeClass("active");
          $(this).addClass("active");
          var type = $(this).attr("attr-type");
          //$(".rest_index .container > .block").css("display", "none");
          $(".rest_index .container > .block").remove();
          
          $(".hidden_rests > .block").each(function() {
              if(type == "all") {
                $(".rest_index .container").append($(this).clone());
                //$(this).css("display", "block");
              } else {
                  var temp_kitchen = $(this).attr("attr-kitchen");
                  if(temp_kitchen.indexOf(type) != -1) {
                      //$(this).css("display", "block");
                      $(".rest_index .container").append($(this).clone());
                  }
              }
          });   
          makeIndexRClicable();
      })      
  }  
  var kitchen_array = new Array();
  $(".rest_index .container > .block").each(function() {
      var temp = $(this).attr("attr-kitchen");
      var temp_arr = temp.split(",");
      $(temp_arr).each(function(index, value) {
          if(value != '') {
              kitchen_array.push(value);
          }
      });
  })   
  $(".rest_index").append("<div style='display: none;' class='hidden_rests'></div>");
  $(".hidden_rests").html($(".rest_index .container").html());
  $(".rest_index .container").html("");
  makeIndexRClicable();
  
  
  
  kitchen_array.sort();
  $(".rest_index .container > .block").click(function() {
      document.location.href=$(this).children(".alt").children("a").attr("href");
  });
  
  kitchen_array = $.unique(kitchen_array);
      $(".rest_index .trigger").append('<div class="block" attr-type="all"><span>Все</span></div>');
  
  $(kitchen_array).each(function(index, value) {
      $(".rest_index .trigger").append('<div class="block" attr-type="'+value+'"><span>'+value+'</span></div>');
  })
  restListTrigger();
  $(".rest_index .trigger .block").eq(0).click();
  ///////////////// триггер для блока "рестораны сети"
  
  ///// обработка смены размера у блюда
  $(".size_trigger").change(function() {
      var price = $(this).attr("attr-price");
      $(this).parents("div").parents(".selector").parents(".block").children(".bottom").children(".price").children("span").html(price);
  });
  
  /////////добавляем в корзину
  function remove_class(link, s_class) {
      $(link).removeClass(s_class);
  }
  $(".in_basket").click(function() {
      var block = $(this).parents(".bottom").parents(".block");
      var lunch_error = false;
      
      if($(block).children(".selector").html() != undefined) {
          var item_id = '';
          $(block).children(".selector").children("div").each(function() {
              if($(this).children(".size_trigger").prop("checked") === true) {
                item_id = parseInt($(this).children(".size_trigger").val(), 10);
              }
          })          
      }
      else if($(block).children(".b_luch_selector").html() != undefined) {
          var attr_data = {};
          var error = '';
          var item_id = parseInt($(block).children("input[name=item_id]").val(), 0);
          $(block).children(".b_luch_selector").children(".string").children("select").each(function() {
              if($(this).val() == null) {
                  $(this).addClass("error");
                  lunch_error = true;
                  error = true;
              } else {
                  attr_data[$(this).attr("name")] = $(this).val();
              }
          })
      }
      else {
          var item_id = parseInt($(block).children("input[name=item_id]").val(), 0);
      }
      

      
      if(error === true) {
          $("select.error").click(function() {
              $(this).removeClass("error");
          })      
          console.log(lunch_error);
          if(lunch_error === true) {
              $.fancybox.open("<div><h2>Ошибка</h2><div>Пожалуйста, укажите состав бизнес-ланча!</div></div>");
          }                    
          return;
      }
      if(item_id == 0) {
          return;
      }
      $.post(
          "/lk/zakaz/",
          {
              "do": "addtobasket", 
              "item": item_id, 
              "count": 1,
              "lunch_attr": attr_data,
          }
      ).done(function(data) {
          if(data == "wrong_rest") {
            alert("Заказ из нескольких ресторанов сразу сделать нельзя!");
            return;
          }
          var result = parseInt(data, 10);
          $("#basketCount").html(result);
          $(block).addClass("in_basket");
          window.setTimeout(remove_class, 500, $(block), "in_basket");
          makeBasket();
          yaCounter23613004.reachGoal('basketAdd');

      });        
  }) 
  $(".main_page .whiteblock .basket_column .adress_trigger").click(function() {
      var street = $(this).attr("attr-street");
      var house = $(this).attr("attr-house");
      var entrance = $(this).attr("attr-entrance");
      var floor = $(this).attr("attr-floor");
      var flat = $(this).attr("attr-flat");
      $(".main_page .whiteblock > .basket_column input[name=street]").val(street);
      $(".main_page .whiteblock > .basket_column input[name=house]").val(house);
      $(".main_page .whiteblock > .basket_column input[name=entrance]").val(entrance);
      $(".main_page .whiteblock > .basket_column input[name=floor]").val(floor);
      $(".main_page .whiteblock > .basket_column input[name=flat]").val(flat);
      
  })
  $(".main_page .history_column .zakaz > .row").click(function() {
      $(this).next(".hidden.data").slideToggle();
  })
  $(".menu_inner .title_container a").each(function() {
      var href = $(this).attr("href");
      href = href.split("?");
      if(window.location.href.indexOf(href[1]) >= 0) {
          $(this).addClass("active");
      }   
  });
  
  $(".menu_trigger").click(function(){
      $("html").toggleClass("menu_right");
  });
  
  $(".review_carousel .owl-carousel .block .view_more").click(function() {
      $(this).parent(".text").parent(".block").css("max-height", "none");
      $(this).remove();
  })
  
  $(".not_selected").click(function() {
      $(this).removeClass("not_selected");
  })  
  $(".delivery_trigger input[type=radio]").change(function() {
        var delivery_type = $(".delivery_trigger input[type=radio]:checked").val();
        if(delivery_type == 1) {
            $(".delivery_to_point").slideDown(250, function() {
                $(".pickup").slideUp(250);    
                $("input[name=street]").addClass("required");
                $("input[name=house]").addClass("required");            
            });
        } else {
            //$(".pickup").slideDown();        
            $(".delivery_to_point").slideUp(250, function() {
                $(".pickup").slideDown(250);    
                $("input[name=street]").removeClass("required");
                $("input[name=house]").removeClass("required");
            });
        }
    })  
});
$(document).ready(function() {
    $("input[name=payment]").change(function() {
        if($(this).val() == 3) {
            $("#processOrder").html("перейти к оплате");
        } else {
            $("#processOrder").html("оформить заказ");
        }
    });
    $(".item_cards > .block .image").hover(function() {
        $(this).parent(".block").addClass('hover');
    }, function() {
        $(this).parent(".block").removeClass('hover');
    }) 
})



function makeRastopyrka() {
    var win_height = $(window).height();
    $(window).resize(function() {
        win_height = $(window).height();
    }) 
    if($("#rastopyrka").html() == undefined) {
        return;
    }
       
    var rastopyrka = $("#rastopyrka").offset().top;
    var pos = $("#left_column_anchor").offset().top;
    console.log(pos);
    /*if(pos > 0 && rastopyrka > 0) {
        $(window).scroll(function() {
            var need_rastopyrka = ($(window).scrollTop() + win_height) - (pos);
            if(need_rastopyrka > 0) {
                $("#size_for_calc").addClass("fixed");
                //$("#rastopyrka").css("height", need_rastopyrka);
            } else {
                $("#size_for_calc").removeClass("fixed");
            }
        });        
    } else {
        $("#size_for_calc").removeClass("fixed");
    }*/
}
$(window).load(function() {
    makeRastopyrka();
})

//////функционал в акциях
$(document).ready(function() {
    $(".stock.container .block a").click(function(e) {
        e.preventDefault();
        return false;
        /*e.stopPropagation();
        $.ajax($(this).attr('href')+"?ajax=true").done(function(data) {
            console.log(data);
            if(data['type'] == "forward") {
                document.location.href=data['adress'];
            }
            if(data['type'] == "modal") {
                $.fancybox.open(data['data']);
            }
        })*/
    })
    $(".stock.container .block .alt").click(function() {
        var link = $(this).parent(".block").find("a");
        $.ajax($(link).attr('href')+"?ajax=true").done(function(data) {
            if(data['type'] == "forward") {
                document.location.href=data['adress'];
            }
            if(data['type'] == "modal") {
                $.fancybox.open(data['data']);
            }
        })
    })
    $(".stock.container .block img.trigger").click(function() {
        $(".stock.container .block .alt").removeClass("active");
        $(this).parent(".block").find(".alt").addClass("active");
    })

    
})
//upload ajax files group
function makeFileSelect(link) {
    $(link).parent(".file_selector_group").find("input[type=file]").trigger("click");
}
$("input[type=file]").on('change', function(){
    console.log(this.files.length);
    $(this).parent(".file_upload_form").find(".file_container.trigger").html("<span>"+this.files.length+"</span>");
});     
