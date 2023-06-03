var script = document.createElement('script');
script.src = './js/jquery-3.3.1.min.js';
var script = document.createElement('script');
script.src = 'dat.gui.min.js';

let contexxt; // Declare the context variable
let analysser; // Declare the analysser variable
let freqqs;
let mediarecorder;
let chunks = [];
const shuffle = [1, 3, 0, 4, 2];
// the canvas size
const WIDTH = 310;
const HEIGHT = 70;

const ctxx = canvas.getContext("2d");

// options to tweak the look
const opts = {
  smoothing: 0.6,
  fft: 8,
  minDecibels: -70,
  scale: 0.1,
  glow: 10,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: "screen",
  shift: 50,
  width: 30,
  amp: 0.3
};


// Interactive dat.GUI controls
const gui = new dat.GUI();

// hide them by default
gui.close(); 

// connect gui to opts
gui.addColor(opts, "color1");
gui.addColor(opts, "color2");
gui.addColor(opts, "color3");
gui.add(opts, "fillOpacity", 0, 1);
gui.add(opts, "lineWidth", 0, 10).step(1);
gui.add(opts, "glow", 0, 100);
gui.add(opts, "blend", [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "lighten",
  "difference"
]);
gui.add(opts, "smoothing", 0, 1);
gui.add(opts, "minDecibels", -100, 0);
gui.add(opts, "amp", 0, 5);
gui.add(opts, "width", 0, 60);
gui.add(opts, "shift", 0, 200);


// Array to hold the analyzed frequencies

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

/**
 * Create an input source from the user media stream, connect it to
 * the analysser and start the visualization.
 */
let response;
var gstream;
function onStream(stream) {
  setTimeout(function() {
    mediarecorder.stop();
    mediarecorder.onstop = function(e) {
      let blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
      chunks = [];
      const formData = new FormData();
    formData.append('audio', blob, "audio.wav");
    if (gstream.active) {
      gstream.getAudioTracks()[0].stop();
    }
    $(".buttonstartrec").show();
    $(".buttonstoprec").hide();
    $(".transcript").show();
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData,
    })
    .then(r => r.json())
    .then(r => {
      if (r.lang=="fr"){
        $("#transcription").css("text-align", "left");
      }
      else{
        $("#transcription").css("text-align", "right");
      }
      document.getElementById("transcription").innerHTML=r.text;
      $("#transcription").fadeIn();
      $(".transcript").hide();
      setTimeout(function() {
      if (r.predict=="consultation derniers virements" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de consultation des derniers virements";
        $("#prediction").fadeIn();
        $("#item3").click();
      }
      else if (r.predict=="consultation derniers virements" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  آخر التحويلات";
        $("#prediction").fadeIn();
        $("#item3").click();   
      }
      else if (r.predict=="consultation du solde" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de consultation du solde";
        $("#prediction").fadeIn();
        $("#item2").click();
      }
      else if (r.predict=="consultation du solde" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  الرصيد";
        $("#prediction").fadeIn();
        $("#item2").click();
      }
      else if (r.predict=="payer une facture" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de paiement des factures";
        $("#prediction").fadeIn();
        $("#item5").click();
      }
      else if (r.predict=="payer une facture" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  دفع الفواتير";
        $("#prediction").fadeIn();
        $("#item5").click();
      }
      else if (r.predict=="savoir le numéro de RIB" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de consultation du RIB";
        $("#prediction").fadeIn();
        $("#item2").click();
      }
      else if (r.predict=="savoir le numéro de RIB" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  الرقم البنكي الدولي";
        $("#prediction").fadeIn();
        $("#item2").click();
      }
      else if (r.predict=="demander une carte bancaire ou un carnet de chèque" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de demande de carte bancaire ou de carnet de chèque";
        $("#prediction").fadeIn();
        $("#item6").click();
      }
      else if (r.predict=="demander une carte bancaire ou un carnet de chèque" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  طلب بطاقة بنكية أو دفتر شيكات";
        $("#prediction").fadeIn();
        $("#item6").click();
      }
      else if (r.predict=="virement" && r.lang=="fr"){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="redirection vers la page de virement";
        $("#prediction").fadeIn();
        $("#item4").click();
      }
      else if (r.predict=="virement" && r.lang=="ar"){
        $("#transcription").css("text-align", "right");
        document.getElementById("prediction").innerHTML="توجيه إلى صفحة  التحويل";
        $("#prediction").fadeIn();
        $("#item4").click();
      }
      else if (r.predict=="I do not understand..." ){
        $("#transcription").css("text-align", "left");
        document.getElementById("prediction").innerHTML="Je n'ai pas compris votre demande";
        $("#prediction").fadeIn();
      }
    }, 400);
              
  
          }).catch((error) => {
              console.error('Error:', error);
            });
  }
}, 7000);
  console.log("onStream");
  gstream = stream;
  const input = contexxt.createMediaStreamSource(stream);
  input.connect(analysser);
  requestAnimationFrame(visualize);
  mediarecorder= new MediaRecorder(stream);
  mediarecorder.start();
  mediarecorder.ondataavailable = function(e) {
    chunks.push(e.data);
  console.log(mediarecorder.state);
}
}
/**
 * Display an error message.
 */
function onStreamError(e) {
  document.body.innerHTML = "<h1>This pen only works with https://</h1>";
  console.error(e);
}

/**
 * Utility function to create a number range
 */
function range(i) {
  return Array.from(Array(i).keys());
}
var loc;
// shuffle frequencies so that neighbors are not too similar


/**
 * Pick a frequency for the given channel and value index.
 *
 * The channel goes from 0 to 2 (R/G/B)
 * The index goes from 0 to 4 (five peaks in the curve)
 *
 * We have 2^opts.fft frequencies to choose from and
 * we want to visualize most of the spectrum. This function
 * returns the bands from 0 to 28 in a nice distribution.
 */
function freq(channel, i) {
  const band = 2 * channel + shuffle[i] * 6;
  return freqqs[band];
}

/**
 * Returns the scale factor fot the given value index.
 * The index goes from 0 to 4 (curve with 5 peaks)
 */
function scale(i) {
  const x = Math.abs(2 - i); // 2,1,0,1,2
  const s = 3 - x;           // 1,2,3,2,1
  return s / 3 * opts.amp; 
}

/**
 *  This function draws a path that roughly looks like this:
 *       .
 * __/\_/ \_/\__
 *   \/ \ / \/
 *       '
 *   1 2 3 4 5
 *          
 * The function is called three times (with channel 0/1/2) so that the same
 * basic shape is drawn in three different colors, slightly shifted and
 * each visualizing a different set of frequencies. 
 */
function path(channel) {
  
  // Read color1, color2, color2 from the opts
  const color = opts[`color${channel + 1}`].map(Math.floor);
  
  // turn the [r,g,b] array into a rgba() css color
  ctxx.fillStyle = `rgba(${color}, ${opts.fillOpacity})`;
  
  // set stroke and shadow the same solid rgb() color
  ctxx.strokeStyle = ctxx.shadowColor = `rgb(${color})`;
  
  ctxx.lineWidth = opts.lineWidth;
  ctxx.shadowBlur = opts.glow;
  ctxx.globalCompositeOperation = opts.blend;
  
  const m = HEIGHT / 2; // the vertical middle of the canvas

  // for the curve with 5 peaks we need 15 control points

  // calculate how much space is left around it
  const offset = (WIDTH - 15 * opts.width) / 2;

  // calculate the 15 x-offsets
  const x = range(15).map(
    i => offset + channel * opts.shift + i * opts.width
  );
  
  // pick some frequencies to calculate the y values
  // scale based on position so that the center is always bigger
  const y = range(5).map(i =>
    Math.max(0, m - scale(i) * freq(channel, i))
  );
    
  const h = 2 * m;

  ctxx.beginPath();
  ctxx.moveTo(0, m); // start in the middle of the left side
  ctxx.lineTo(x[0], m + 1); // straight line to the start of the first peak
  
  ctxx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]); // curve to 1st value
  ctxx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]); // 2nd value
  ctxx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]); // 3rd value
  ctxx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]); // 4th value
  ctxx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]); // 5th value
  
  ctxx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m); // curve back down to the middle
  
  ctxx.lineTo(1000, m + 1); // straight line to the right edge
  ctxx.lineTo(x[13], m - 1); // and back to the end of the last peak
  
  // now the same in reverse for the lower half of out shape
  
  ctxx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
  ctxx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
  ctxx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
  ctxx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
  ctxx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
  ctxx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);
  
  ctxx.lineTo(0, m); // close the path by going back to the start
  
  ctxx.fill();
  ctxx.stroke();
}

/**
 * requestAnimationFrame handler that drives the visualization
 */
function visualize() {
  // set analysert props in the loop react on dat.gui changes
  analysser.smoothingTimeConstant = opts.smoothing;
  analysser.fftSize = Math.pow(2, opts.fft);
  analysser.minDecibels = opts.minDecibels;
  analysser.maxDecibels = 0;
  analysser.getByteFrequencyData(freqqs);
  
  // set size to clear the canvas on each frame
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  
  // draw three curves (R/G/B)
  path(0);
  path(1);
  path(2);

  // schedule next paint
  requestAnimationFrame(visualize);
}

function startaudio() {
  contexxt = new AudioContext();
  analysser = contexxt.createAnalyser();
  freqqs = new Uint8Array(analysser.frequencyBinCount);
  $(".buttonstartrec").hide();
  $(".buttonstoprec").show();
  $("#prediction").fadeOut();
  $("#transcription").fadeOut();
  navigator.getUserMedia({ audio: true }, onStream, onStreamError);

}

function stopaudio() {
  mediarecorder.stop();
  mediarecorder.onstop = function(e) {
    let blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
    chunks = [];
    const formData = new FormData();
    formData.append('audio', blob, "audio.wav");
  console.log(mediarecorder.state);
  if (gstream.active) {
    gstream.getAudioTracks()[0].stop();
  }
  $(".buttonstartrec").show();
  $(".buttonstoprec").hide();
  $(".transcript").show();
  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    body: formData,
  })
  .then(r => r.json())
  .then(r => {
            if (r.lang=="fr"){
              $("#transcription").css("text-align", "left");
            }
            else{
              $("#transcription").css("text-align", "right");
            }
            document.getElementById("transcription").innerHTML=r.text;
            $("#transcription").fadeIn();
            $(".transcript").hide();
            setTimeout(function() {
            if (r.predict=="consultation derniers virements" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de consultation des derniers virements";
              $("#prediction").fadeIn();
              $("#item3").click();
            }
            else if (r.predict=="consultation derniers virements" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  آخر التحويلات";
              $("#prediction").fadeIn();
              $("#item3").click();   
            }
            else if (r.predict=="consultation du solde" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de consultation du solde";
              $("#prediction").fadeIn();
              $("#item2").click();
            }
            else if (r.predict=="consultation du solde" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  الرصيد";
              $("#prediction").fadeIn();
              $("#item2").click();
            }
            else if (r.predict=="payer une facture" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de paiement des factures";
              $("#prediction").fadeIn();
              $("#item5").click();
            }
            else if (r.predict=="payer une facture" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  دفع الفواتير";
              $("#prediction").fadeIn();
              $("#item5").click();
            }
            else if (r.predict=="savoir le numéro de RIB" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de consultation du RIB";
              $("#prediction").fadeIn();
              $("#item2").click();
            }
            else if (r.predict=="savoir le numéro de RIB" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  الرقم البنكي الدولي";
              $("#prediction").fadeIn();
              $("#item2").click();
            }
            else if (r.predict=="demander une carte bancaire ou un carnet de chèque" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de demande de carte bancaire ou de carnet de chèque";
              $("#prediction").fadeIn();
              $("#item6").click();
            }
            else if (r.predict=="demander une carte bancaire ou un carnet de chèque" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  طلب بطاقة بنكية أو دفتر شيكات";
              $("#prediction").fadeIn();
              $("#item6").click();
            }
            else if (r.predict=="virement" && r.lang=="fr"){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="redirection vers la page de virement";
              $("#prediction").fadeIn();
              $("#item4").click();
            }
            else if (r.predict=="virement" && r.lang=="ar"){
              $("#prediction").css("text-align", "right");
              document.getElementById("prediction").innerHTML="توجيه إلى صفحة  التحويل";
              $("#prediction").fadeIn();
              $("#item4").click();
            }
            else if (r.predict=="I do not understand..." ){
              $("#prediction").css("text-align", "left");
              document.getElementById("prediction").innerHTML="Je n'ai pas compris votre demande";
              $("#prediction").fadeIn();
            }
          }, 400);
        }).catch((error) => {
            console.error('Error:', error);
          });
}
}
function dropaudio() {
  mediarecorder.stop();
  $(".buttonstartrec").show();
  $(".buttonstoprec").hide();
  if (gstream.active) {
    gstream.getAudioTracks()[0].stop();
  }
}

