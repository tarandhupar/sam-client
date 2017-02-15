const localWebServer = require('local-web-server')

var apiConfig;
try{
  apiConfig = require('./api-config');
}
catch(Error){
  console.log('api-config.json not found, moving on ...', Error)
}

const API_UMBRELLA_URL = process.env.API_UMBRELLA_URL || apiConfig.API_UMBRELLA_URL;

localWebServer({
	'static':{
		'root':'dist/'
	},
	'spa':'index.html',
	'rewrite':[
	  { 'from':'/ie_api/*','to':API_UMBRELLA_URL+'/$1'},
    { 'from':'/users/*','to':'/'}
  ],
	'verbose':true
}).listen(8080)
