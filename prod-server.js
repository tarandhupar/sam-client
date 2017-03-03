const localWebServer = require('local-web-server')

localWebServer({
	'static':{
		'root':'dist/'
	},
	'spa':'index.html',
	'rewrite':[
    { 'from':'/users/*','to':'/'}
  ],
	'verbose':true
}).listen(8080)
