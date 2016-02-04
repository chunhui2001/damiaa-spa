var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl();

curl.setOpt( 'URL', '127.0.0.1:8088' );
curl.setOpt( 'FOLLOWLOCATION', true );

curl.setOpt( CURLOPT_HTTPHEADER, [
		'Content-Type: application/json'
	] );


curl.on( 'end', function( statusCode, body, headers ) {

    console.info( body );
    console.info( statusCode );
    console.info( '---' );
    console.info( body.length );
    console.info( '---' );
    console.info( this.getInfo( 'TOTAL_TIME' ) );

    this.close();
});

curl.on( 'error', function(e) {
	 curl.close.bind( curl );
	 console.log(e);
	 console.log('error');
} );

// send request
curl.perform();