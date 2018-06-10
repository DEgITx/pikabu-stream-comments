var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var iconv  = require('iconv-lite');

const link = process.argv[2] || 'https://pikabu.ru/story/strim_dlya_podpischikov_s_pikabu_4_muzyikalnyiy_proekt_degitx_kryisinyiy_poiskovik_kibersportivnaya_platforma_i_drugie_proektyi_5956166'
const interval = 8000
const commentsSelector = '.comments .comment'

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
	  $(commentsSelector).each(function() {
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
	  	<style>

	  	</style>
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

