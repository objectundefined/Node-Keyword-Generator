/*

    keywords.js
    Gabriel Lipson

    use:
    
        var generate_keywords = require('./keywords.js').generate,
            
            query = 'who is john f kennedy'; 
            
            generate_keywords(query,function(keywords){                
                console.log('keywords');
            });
    
    
    expect:
    
        [ 'kennedy',
          'john f. kennedy',
          'president',
          '1963',
          'john fitzgerald kennedy'
        ]
        
        
    abstract:
    
        Gathers and ranks keywords associated with yahoo boss
        search results for a particular query. Returns the top 5.

*/

var generate = function(query,callback){
	var qs = require('querystring'),
		keyterms  = {},
		boss_app_id = "5oA8fbfV34FuMBgDmxN3HriexGAikDoQj.RmBo7R6zoKZlk7ST8_tt7oQht5Ed9ZkKw-",
		query = qs.escape(query.slice(0,250)),
		params = {
			'appid': boss_app_id,
			'view': 'keyterms',
			format: 'json'
		},
		path = '/ysearch/web/v1/'+ query +'?'+qs.encode(params),
		host = 'boss.yahooapis.com',
		keywordClient = require('http').createClient(80, host);	
	request	= keywordClient.request("GET", path, {"host": host, "User-Agent": 'BOSS-KEYWORD-CLIENT'});
	request.addListener('response', function (response) {
		var chunks = [];		
		response.addListener("data", function (chunk) {	
			chunks.push(chunk);
		});
		response.addListener("end", function () {
			var jsonString = chunks.join(''),d={};
			try{d = JSON.parse(jsonString);}
			catch(e){d = {};}
			results = d.ysearchresponse.resultset_web || [];
			results.forEach(function(result){
				terms =  result.keyterms.terms || [];
				terms.forEach(function(term){					
					term = term.toLowerCase();
                    if(term in keyterms) keyterms[term] += 1;
                    else keyterms[term] = 1;
				});
			});
			var ordered = Object.keys(keyterms).sort(function(a,b){
				return keyterms[b] - keyterms[a];
			});
			callback(ordered.slice(0,5));
		});
	});
    request.addListener("clientError", function () {
			callback([]);
	});
    request.addListener("error", function () {
			callback([]);
	});
	request.end();
};
exports.generate = generate;
