var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var iconv  = require('iconv-lite');

let link = 'https://pikabu.ru/story/kaver_na_odin_iz_urovney_aladdina_4578279'
let interval = 8000

let html = '';

let parse = () => {
	request({
		url: link,
		encoding: null
	}
		, function (error, response, body) {
	  console.log('update')
	  body = iconv.decode(body, 'win1251')

	  var $ = cheerio.load(body)
	  html = '<html>';

	  html += $('head').html()

	  let posts = []
	  $('.b-comment').each(function() {
	  		posts.push($(this))
	  })
	  posts = posts.sort((a, b) => {
	  	let timeA = a.find('time[datetime]').attr('datetime');
	  	let timeB = b.find('time[datetime]').attr('datetime');
	  	if(timeA > timeB)
	  		return -1;
	  	if(timeA < timeB)
	  		return 1

	  	return 0
	  })
	  let b = ''
	  for(post of posts)
	  {
	  	b += post;
	  }

	  html += '<body>'
	  html += b;
	  html += '</body>'
	  html += '<script src="/socket.io/socket.io.js"></script>';
	  html += `
	  	<script>
	  		var socket = io('http://localhost:8000');
		    socket.on('update', function (data) {
		    	document.body.innerHTML = data
		 	 });
	  	</script>
	  `

	  html += '</html>'

	  io.emit('update', b)
	});
}
parse()

setInterval(() => parse(), interval)

let app = http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(iconv.encode(html, 'win1251'));  
        response.end();  
  });
var io = require('socket.io')(app);
app.listen(8000)

