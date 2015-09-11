$(document).ready(function ()
{
  $('#song').hide();
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();
  var color = d3.scale.ordinal()
  .range(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"])
  .domain([0,1,2,3,4,5,6,7,8,9,10,11]);
  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  //var frequencyData = new Array(200);

  var svgHeight = '400';
  var svgWidth = '800';
  var frequencyData = new Uint8Array(parseInt(svgWidth));
  $('#song').show();
  var svg = createSvg('#song', svgHeight, svgWidth);
  $('#song').hide();
  
  $('#play').on('click', function()
  {
    $('#song').show();
  });
  
  $('#pause').on('click', function()
  {
    $('#song').hide();
  });
  
  $('#picker').on('click', function()
  {
      $("#audioElement").attr("src", $('#song_pick').val()).trigger("play");
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioElement = document.getElementById('audioElement');
  });

  function createSvg(parent, height, width)
  {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }
  
  svg.selectAll('line').data(frequencyData).enter().append('line');

  function renderChart()
  {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     svg.selectAll('line')
       .data(frequencyData)
       .attr('y1', function(d) { return svgHeight/2 - d; })
       .attr('y2', function(d) { return svgHeight/2 + d; })
       .attr('x1', function(d, i) { return i + 0.5; })
       .attr('x2', function(d, i) { return i + 0.5; })
       .attr("stroke-width", 2)
       .attr("stroke", function(d, i){return color(i%11);});
  }

  // Run the loop
  renderChart();

});
