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
