var words = require( './joke.json' );
var nbRetry = 0;

exports.init = function() {
	console.log('\x1b[96mJoke plugin is initializing ... \x1b[0m');
};

exports.dispose  = function() {
	console.log('\x1b[96mJoke plugin is disposed ... \x1b[0m');
};

exports.action = function(data, next) {
	if ( data.mode && (data.mode == "JOKE")) {
		nbRetry = 0;
		return actionJoke(data, next);
	}

	commandError(next);
};

var commandError = function (next) {
	var toSpeak = '';
	var availableTTS = words["command_error"];
	if (Object.keys(availableTTS).length > 0) {
		var choice = Math.floor(Math.random() * Object.keys(availableTTS).length); 
		toSpeak = availableTTS[choice];
	}

	next({'tts': toSpeak});
};

var actionJoke = function (data, next) {
	console.log('\x1b[91mmode=JOKE \x1b[0m');

	var pluginProps = Config.modules.joke;
	if (!pluginProps.max_id) {
		console.log("Missing Joke max_id config in prop file");
		next({'tts' : 'Configuration invalide'});
		return;
	}

	var maxJokeId = parseInt(pluginProps.max_id);

	var url = 'http://www.takatrouver.net/blagues/index.php?id=' + Math.floor(Math.random() * maxJokeId);
	var request = require('request');

	request( { 'uri' : url, 'encoding': 'binary' }, function (err, response, body) {
		if (err || response.statusCode != 200) {
			next({'tts': "Je n'arrive pas à accéder aux informations du site takatrouver.net"});
			return;
		}

		var cheerio = require('cheerio');
		var $ = cheerio.load(body, { xmlMode: false, normalizeWhitespace: false, ignoreWhitespace: true, lowerCaseTags: true });
		var joke = $('#Layer11 table table:nth-child(2)').text();

		if (joke) {
			next({'tts': joke});
			return;
		}
		else if (nbRetry < 5) {
			nbRetry++;
			console.log("[takarire] Joke not found ! Retry #" + nbRetry + ".");
			actionJoke(data, next);
		} 
		else {
			next({'tts': "Je n'arrive pas à accéder aux informations du site takatrouver.net"});
			return;
		}
	});
};

var actionJokeOld = function(data, next) {
	console.log('\x1b[91mmode=JOKE \x1b[0m');

	var pluginProps = Config.modules.joke;

	var url = 'http://humour-blague.com/blagues-2/index.php';
	var request = require('request');

	request({ 'uri' : url }, function (err, response, body) {
		if (err || response.statusCode != 200) {
			next({'tts': "Désolé mais je n'arrive pas à accéder aux informations du site humour-blague.com"});
			return;
		}

		var $ = require('cheerio').load(body, { normalizeWhitespace: true, xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false, decodeEntities: false });
		var vocal = HTMLentitiesdecode( $('p.blague').text() );

		next({ 'tts': vocal});
	});
};

var HTMLentitiesdecode = function (texte) {
	//texte = texte.replace(/#/g,'&#35;'); // 160 A0
	//texte = texte.replace(/\n/g,'&#92;n'); // 160 A0
	//texte = texte.replace(/\r/g,'&#92;r'); // 160 A0

	texte = texte.replace(/&amp;/g,'&'); // 38 26
	texte = texte.replace(/&quot;/g,'"'); // 34 22
	texte = texte.replace(/&lt;/g,'<'); // 60 3C
	texte = texte.replace(/&gt;/g,'>'); // 62 3E

	texte = texte.replace(/&cent;/g,'\242');
	texte = texte.replace(/&pound;/g,'\243');
	texte = texte.replace(/&euro;/g,'\€');
	texte = texte.replace(/&yen;/g,'\245');
	texte = texte.replace(/&deg;/g,'\260');
	//texte = texte.replace(/\274/g,'&frac14;');
	texte = texte.replace(/&OElig;/g,'\274');
	//texte = texte.replace(/\275/g,'&frac12;');
	texte = texte.replace(/&oelig;/g,'\275');
	//texte = texte.replace(/\276/g,'&frac34;');
	texte = texte.replace(/&Yuml;/g,'\276');
	texte = texte.replace(/&iexcl;/g,'\241');
	texte = texte.replace(/&laquo;/g,'\253');
	texte = texte.replace(/&raquo;/g,'\273');
	texte = texte.replace(/&iquest;/g,'\277');
	texte = texte.replace(/&Agrave;/g,'\300');
	texte = texte.replace(/&Aacute;/g,'\301');
	texte = texte.replace(/&Acirc;/g,'\302');
	texte = texte.replace(/&Atilde;/g,'\303');
	texte = texte.replace(/&Auml;/g,'\304');
	texte = texte.replace(/&Aring;/g,'\305');
	texte = texte.replace(/&AElig;/g,'\306');
	texte = texte.replace(/&Ccedil;/g,'\307');
	texte = texte.replace(/&Egrave;/g,'\310');
	texte = texte.replace(/&Eacute;/g,'\311');
	texte = texte.replace(/&Ecirc;/g,'\312');
	texte = texte.replace(/&Euml;/g,'\313');
	texte = texte.replace(/&Igrave;/g,'\314');
	texte = texte.replace(/&Iacute;/g,'\315');
	texte = texte.replace(/&Icirc;/g,'\316');
	texte = texte.replace(/&Iuml;/g,'\317');
	texte = texte.replace(/&ETH;/g,'\320');
	texte = texte.replace(/&Ntilde;/g,'\321');
	texte = texte.replace(/&Ograve;/g,'\322');
	texte = texte.replace(/&Oacute;/g,'\323');
	texte = texte.replace(/&Ocirc;/g,'\324');
	texte = texte.replace(/&Otilde;/g,'\325');
	texte = texte.replace(/&Ouml;/g,'\326');
	texte = texte.replace(/&Oslash;/g,'\330');
	texte = texte.replace(/&Ugrave;/g,'\331');
	texte = texte.replace(/&Uacute;/g,'\332');
	texte = texte.replace(/&Ucirc;/g,'\333');
	texte = texte.replace(/&Uuml;/g,'\334');
	texte = texte.replace(/&Yacute;/g,'\335');
	texte = texte.replace(/&THORN;/g,'\336');
	texte = texte.replace(/&szlig;/g,'\337');
	texte = texte.replace(/&agrave;/g,'\340');
	texte = texte.replace(/&aacute;/g,'\341');
	texte = texte.replace(/&acirc;/g,'\342');
	texte = texte.replace(/&atilde;/g,'\343');
	texte = texte.replace(/&auml;/g,'\344');
	texte = texte.replace(/&aring;/g,'\345');
	texte = texte.replace(/&aelig;/g,'\346');
	texte = texte.replace(/&ccedil;/g,'\347');
	texte = texte.replace(/&egrave;/g,'\350');
	texte = texte.replace(/&eacute;/g,'\351');
	texte = texte.replace(/&ecirc;/g,'\352');
	texte = texte.replace(/&euml;/g,'\353');
	texte = texte.replace(/&igrave;/g,'\354');
	texte = texte.replace(/&iacute;/g,'\355');
	texte = texte.replace(/&icirc;/g,'\356');
	texte = texte.replace(/&iuml;/g,'\357');
	texte = texte.replace(/&eth;/g,'\360');
	texte = texte.replace(/&ntilde;/g,'\361');
	texte = texte.replace(/&ograve;/g,'\362');
	texte = texte.replace(/&oacute;/g,'\363');
	texte = texte.replace(/&ocirc;/g,'\364');
	texte = texte.replace(/&otilde;/g,'\365');
	texte = texte.replace(/&ouml;/g,'\366');
	texte = texte.replace(/&oslash;/g,'\370');
	texte = texte.replace(/&ugrave;/g,'\371');
	texte = texte.replace(/&uacute;/g,'\372');
	texte = texte.replace(/&ucirc;/g,'\373');
	texte = texte.replace(/&uuml;/g,'\374');
	texte = texte.replace(/&yacute;/g,'\375');
	texte = texte.replace(/&thorn;/g,'\376');
	texte = texte.replace(/&yuml;/g,'\377');
	texte = texte.replace(/&nbsp;/g,'');
	return texte;
};
