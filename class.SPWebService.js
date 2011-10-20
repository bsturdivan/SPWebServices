var SPWebService = SPWebService || {};

SPWebService = (function(url) {
	
	this.url = url;
	
	this.AJAXConstructor = function(SAction) {
		$.ajaxSetup({
            url: url+'/_vti_bin/lists.asmx',
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=\"utf-8\"",
            processData: true
        });
        console.log('AJAX Setup');
	}(); 
	
});

SPWebService.prototype.sendData = function(sAction, t, d, method) {
	$.ajax({
        beforeSend: function(xhr) {
            xhr.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/sharepoint/soap/"+method);
        },
        data: d,
    });
};

SPWebService.prototype.soapWrapper = function(ln, vn, method) {
	var m, envelope;

	if(method.toLowerCase()==='updatelistitems') {
		m = 'UpdateListItems';
	}
	else if(method.toLowerCase()==='getlistitems') {
		m = 'GetListItems'; 
	}

	return envelope = $("<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><"+m+" xmlns='http://schemas.microsoft.com/sharepoint/soap/'><listName></listName><viewName></viewName></"+m+"></soap:Body></soap:Envelope>");
};