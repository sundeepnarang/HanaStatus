var http = require('http')
 	, nodemailer = require("nodemailer")
 	, config = require('./config')
 	, msgFlag = 1
 	,hanaFlag = 0; 

 //==================================================================
//======================== INIT NODEMAILER =========================
//==================================================================

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "contact.etc.unite@gmail.com",
        pass: "hne11DDh11"
    }
});


//==================================================================
//=========================== MAIL ============================
//==================================================================

sendContactMail = function(now){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: "<contact.etc.unite@gmail.com>" // sender address
	    ,to: "sundeepnrng@gmail.com, la@evolvingtech.com" // list of receivers
	    ,subject: "Hana On Warning ("+ (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+ "." + now.getMilliseconds() + ")" // Subject line
	    ,text: "Hana is on as of Date - " + (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+ "." + now.getMilliseconds() + ")"// plaintext body
		,html: "Hana is on as of Date - <b>(	" + (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+ "." + now.getMilliseconds() + ")</b>" // html body
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	        msgFlag = 1;
	    }else{
	        console.log("Message sent: " + response.message);
	        msgFlag = 0;
	    }

	    // if you don't want to use this transport object anymore, uncomment following line
	    //smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

checkhana = function() {
	
	var options = {
	  host: config.url,
	  port: config.port,
	};

	http.get(options, function(resp){
		console.log("Status",resp.statusCode,resp);
		resp.on('data', function(chunk){
			hanaFlag = 1;
		    
		});
	}).on("error", function(e){
	  console.log("Got error: " + e.message);
	  hanaFlag = 0;
	});
}

setInterval(function(){
  checkhana();
  now = new Date();
  console.log("Hana status - "+hanaFlag+" at "+ (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+ "." + now.getMilliseconds() + ")");
  if(now.getHours()>=18){
  	if(hanaFlag){
  		if(msgFlag){
  			sendContactMail(now);
  		}
  	}
  }
  if(now.getHours()==1){
  	if(!msgFlag){
  		msgFlag =1;
  	}
  }
  
},1000*60);

