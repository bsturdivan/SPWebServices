var SPWebService = SPWebService || {};

(function(url) {
	
	this.url = url;
	
	this.AJAXConstructor = function(SAction) {
		$.ajaxSetup({
            url: url+'/_vti_bin/lists.asmx',
            type: "POST",
            dataType: "xml",
            cache: true,
            contentType: "text/xml; charset=\"utf-8\"",
            processData: true
        });
        console.log('AJAX Setup');
	}();
	
	this.verify = function(data) {
		//if no error return true;
		//else return error code;
	};
	
	this.error = function(errorCode, status) {
		//do something with the error
		//For error message display purposes only
	};
	
	this.processor = funtion(data) {
		var isError = verify(data);
		if(!isError) {
			request();
		}
		else {
			return error(isError);
		}
	};
	
	this.sendData = function(d, method) {
		$.ajax({
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/sharepoint/soap/"+method);
	        },
	        data: d,
	        success: function(data) {
                return processor(data);
            },
            error: function(jqXHR, textStatus) {
                return error(jqXHR, textStatus);
            }
	    });
	};
	
	this.soapWrapper = function(ln, vn, method) {
		var m, envelope;

		if(method.toLowerCase()==='updatelistitems') {
			m = 'UpdateListItems';
		}
		else if(method.toLowerCase()==='getlistitems') {
			m = 'GetListItems'; 
		}

		return envelope = $("<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><"+m+" xmlns='http://schemas.microsoft.com/sharepoint/soap/'><listName></listName><viewName></viewName></"+m+"></soap:Body></soap:Envelope>");
	};
	
	return {
		updateListItems: function(cols) {
			return sendData(d, 'updateListItems');
		},
		
		getListItems: function() {
			return sendData(d, 'getListItems');
		}
	};
	
}).call(SPWebService, url);