var script = document.createElement('script');
script.src = './js/jquery-3.3.1.min.js';
var script = document.createElement('script');
script.src = 'dat.gui.min.js';

function microphoneOpen(){
        $(".micslid").addClass("show");
        document.getElementById("transcription").innerHTML="";
        document.getElementById("prediction").innerHTML="";
        startaudio();

    };
    function microphoneClose(){
        $(".micslid").removeClass("show");
        dropaudio();    
}
$(function() {
    var taeb = $(".taeb-switch");
    taeb.find(".taeb").on("click", function() {
      var $this = $(this);
  
      if ($this.hasClass("active")) return;
  
      var direction = $this.attr("taeb-direction");
  
      taeb.removeClass("left right").addClass(direction);
      taeb.find(".taeb.active").removeClass("active");
      $this.addClass("active");
    });
  });