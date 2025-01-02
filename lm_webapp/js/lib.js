	// Execute jMakeLink2LocalHost() when the DOM is ready
	document.addEventListener("DOMContentLoaded", function() {
	    jMakeLink2LocalHost();
	});

	function jMakeLink2LocalHost(){
		var h=document.location.host
		var href=document.location.pathname 
//		var href=document.location.pathname.replace(".html",".php")
		if (h==''){
 				href=href.split('htdocs')[1]	
				href='http://localhost'+href
				e=document.createElement('h1');
				var a=	document.createElement('a')
				e.append(a);
				a.textContent="SERVE AS LOCALHOST ";
				a.href=href;
				document.body.firstChild.before(e)
		 } else if(h=='localhost'){
				href='http://thorsen.it'+href
 		 }
	}

 