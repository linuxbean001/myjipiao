function getGlobalImageByName(name) {
  return '/images/'+name;
}

$(window).on('hashchange', function (e) {
       // Your Code goes here
       if(window.location.href.indexOf("payment") >=0)
       {
           alert("payment");
       }
   });

function isPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
}

if(isPC())
{
  $('#slider').nivoSlider({
          effect: 'random',                 // Specify sets like: 'fold,fade,sliceDown'
          slices: 15,
          directionNav: false,             // Next & Prev navigation
          controlNav: false,                 // 1,2,3... navigation
          pauseTime: 9000,
          randomStart: true
  });
}
else {
  $("#root").addClass("mobile-div");
}

$( window ).resize(function() {
  if (isPC())
  {
    if (window.innerWidth < 900)
    {
      $("#root").addClass("mobile-div");
    }
    else {
        $("#root").removeClass("mobile-div");
    }
  }
  else {
    $("#root").addClass("mobile-div");
  }
});
