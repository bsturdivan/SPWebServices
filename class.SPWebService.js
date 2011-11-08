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

		return envelope = $("<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><"+m+" xmlns='http://schemas.microsoft.com/sharepoint/soap/'><listName>"+ln+"</listName><viewName>"+vn+"</viewName>{{XMLTMP}}</"+m+"></soap:Body></soap:Envelope>");
	};

	this.conditionParser = function(where) {
	    var i = 0,
	        vars = {},
	        hash, hashes = where.split(/and|or/),
	        hashLen = hashes.length;
	    for (; i < hashLen; i++) {
	        hash = hashes[i].split('=');
	        vars[$.trim(hash[0])] = $.trim(hash[1]);
	    }
	    return vars;
	};
	
	//Publicly accessible methods
	return {
		/**
		* @param Array cols Columns to query in select statement
		* @param String condition Accepts a standard SQL where statement //id=x and Assessment_x0020_Area='y'
		**/
		getListItems: function(cols, condition) {
			var i=0,
				colTotal = cols.length,
				viewFields = '<viewFields><ViewFields>';
			for(; i<=colTotal; i++) {
				viewFields += '<FieldRef Name='+cols[i]+' />';
			}
			viewFields += '</ViewFields></viewFields>';
			return sendData(d, 'getListItems');
		},
		
		/**
		* @param Object cols Key->Value pair to modify row
		**/
		updateListItems: function(cols) {
			return sendData(d, 'updateListItems');
		}
	};
	
}).call(SPWebService, url);