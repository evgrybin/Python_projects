var mainDiv="tracker";
var map=null;
var mainSignature="";
var mainID=0;
var url="http://online.mobidel.ru";
var timeoutTracker=null;

function makeMap(divMap,z,clo,cla,status,dlo,dla,wlo,wla) {
  if (
      (cla==0) && (clo==0) &&
      (dla==0) && (dlo==0) &&
      (wla==0) && (wlo==0)
     ) return;

  var la,lo;
  if ((cla!=0) || (clo!=0)) { la=cla; lo=clo; }
    else if ((dla!=0) || (dlo!=0)) { la=dlo; lo=dla; }
      else if ((wla!=0) || (wlo!=0)) { la=wla; lo=wlo; };

  if (map!=null) map.destroy();
  
  if (ymaps!=null) {
    map = new ymaps.Map(divMap, {
              // Центр карты
              center: [la, lo],
              // Коэффициент масштабирования
              zoom: z,
              // Тип карты
              type: "yandex#map",
//              controls: ['zoomControl', 'typeSelector',  'fullscreenControl']
              controls: []
          });

    var z=parseInt(status,10);

    switch (z) {
      case ORDER_NONE:
      case ORDER_CREATE:
      case ORDER_EDIT:
      case ORDER_MAKE:
      case ORDER_DEVELOPE: iconImageHref=url+'/img/orders/normal.png'; break;
                                  
      case ORDER_BLOCKED:
      case ORDER_ACCEPTED: iconImageHref=url+'/img/orders/working.png'; break;
                                              
      case ORDER_READY:
      case ORDER_DELIVERY: iconImageHref=url+'/img/orders/delivery.png'; break;
    };
                                                            
    var nplacemarks=1;                                                        
    var placemark = new ymaps.Placemark(
                                        [cla, clo],
                                        { name: "You" },
                                        {
                                             iconLayout: 'default#image',
                                         iconImageHref : iconImageHref,
                                          iconImageSize: [30, 30],
                                        iconImageOffset: [-11, -30]
                                        }
                                       );

    // Добавление метки на карту
    map.geoObjects.add(placemark);

    if ((dlo!=0) && (dla!=0)) {
      var placemark = new ymaps.Placemark(
                                        [dlo, dla],
                                        { name: "Driver" },
                                        {
                                             iconLayout: 'default#image',
                                         iconImageHref : url+'/img/drivers/normal.png',
                                          iconImageSize: [30, 30],
                                        iconImageOffset: [-11, -30]
                                        }
                                       );

      // Добавление метки на карту
      map.geoObjects.add(placemark);
      nplacemarks++;
    };

    if ((wlo!=0) && (wla!=0)) {
      var placemark = new ymaps.Placemark(
                                        [wla, wlo],
                                        { name: "Staff" },
                                        {
                                             iconLayout: 'default#image',
                                         iconImageHref : url+'/img/warehouses/normal.png',
                                          iconImageSize: [30, 30],
                                        iconImageOffset: [-11, -30]
                                        }
                                       );

      // Добавление метки на карту
      map.geoObjects.add(placemark);
      nplacemarks++;
    };
    
    if (nplacemarks>1) {
      var centerAndZoom = ymaps.util.bounds.getCenterAndZoom(
                                   map.geoObjects.getBounds(),
                                   map.container.getSize(),
                                   map.options.get('projection')
                          );
    
      if (centerAndZoom.zoom>1) centerAndZoom.zoom-=1;
      if (centerAndZoom.zoom>17) centerAndZoom.zoom=17;
      if (centerAndZoom!=null) map.setCenter(centerAndZoom.center,centerAndZoom.zoom);
    };
  };
};

var count=0;
function loadOK(id) {
  count|=1<<id;
  if (count==14) startTracker();
};

function loadError(id) {
  switch(id) {
    case 1: alert("Error loading css file"); break;
    case 2: alert("Error loading yandex-map"); break;
    case 3: alert("Error loading defaults.js file"); break;
  };
};

function initTracker(id,signature) {
  mainSignature=signature;
  mainID=id;
  
  var link = document.createElement('link');
  link.rel="stylesheet";
  link.href=url+"/script/main.php?action=getCSS&uid="+mainID+"&signature="+mainSignature;
  link.addEventListener("load", function() { loadOK(1) }, false);
  link.addEventListener("error", function() { loadError(1) }, false);
  document.getElementsByTagName('head')[0].appendChild(link);
                
  var map = document.createElement('script');
  map.type = "text/javascript";
  map.src = "http://api-maps.yandex.ru/2.1/?lang=ru_RU";
  map.addEventListener("load", function() { loadOK(2) }, false);
  map.addEventListener("error", function() { loadError(2) }, false);
  document.getElementsByTagName('head')[0].appendChild(map);
                                
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.src = url+"/js-defaults.php";
  script.addEventListener("load", function() { loadOK(3) }, false);
  script.addEventListener("error", function() { loadError(3) }, false);
  document.getElementsByTagName('head')[0].appendChild(script);
};
                                                                     
function loadTracker(tr,id,signature) {
  mainDiv=tr;

  if (!document.getElementById(mainDiv)) {
    var parent = document.getElementsByTagName('BODY')[0]; //получаем ссылку на элемент body
    var elem = document.createElement('div');// создаст элемент div
    elem.id = mainDiv;
    elem.style.width = "100%";
    elem.style.height = "100%";
    elem.style.overflowY = 'auto';
    elem.style.overflowX = 'hidden';
    parent.appendChild(elem);
  };
  
  initTracker(id,signature);
};

function createRequest() {
  var request=null;
  try {
    request = new XMLHttpRequest();
  } catch (trymicrosoft) {
    try {
       request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (othermicrosoft) {
      try {
         request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
         request = null;
      }
    }
  }
  
  return request;
};


function ajax(url) {
  var request=createRequest();
  var z=10;
  if (request!=null) {
    request.open("GET", url, true);
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          var elem=document.getElementById(mainDiv);
          if (elem) {
            elem.innerHTML=request.responseText;
            for (i=0;i<elem.childNodes.length;i++) {
              var n=elem.childNodes[i];
              if (n.tagName=="SCRIPT") 
                try {
                  eval(n.innerHTML);
                } catch (e) { };
            };
          };
        } else
          alert("Page "+url+" not loaded");
      }
    };

    request.send(null);
  } else alert("AJAX not working");
};
                                                                     
function startTracker() {
  ajax(url+"/script/main.php?action=getMain&uid="+mainID+"&signature="+mainSignature);
};

function getOrder(id) {
//  ajax(url+"/script/main.php?action=getActiveOrder&idOrder="+id+"&uid="+mainID+"&signature="+mainSignature+"&item="+this);
  function getMainOrder() {
    if (timeoutTracker!=null) clearTimeout(timeoutTracker);
    ajax(url+"/script/main.php?action=getActiveOrder&idOrder="+id+"&uid="+mainID+"&signature="+mainSignature+"&item="+this);
    timeoutTracker=setTimeout(getMainOrder,10000);
  };
  getMainOrder();
};

function searchOrders() {
  if (document.getElementById("phone")) {
    ajax(url+"/script/main.php?action=getActiveOrders&phone="+document.getElementById("phone").value+"&uid="+mainID+"&signature="+mainSignature);
  };
};
