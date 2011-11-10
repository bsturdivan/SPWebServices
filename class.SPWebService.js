var SPWebService = SPWebService || {};

SPWebService = (function(url) {
	
	this.url = url;
	
	 var AJAXConstructor = function(SAction) {
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

	var verify = function(data) {
		//if no error return true;
		//else return error code;
		var err = '';
		return true;
	};
	
	var error = function(errorCode, status) {
		//do something with the error
		//For error message display purposes only
		return false;
	};

	var processor = function(XMLdata) {
		var isError = verify(XMLdata);
		if(!isError) {
			console.log(XMLData);
		}
		else {
			return error(isError);
		}
	};
		
	var sendData = function(d) {
		$.ajax({
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("SOAPAction","http://schemas.microsoft.com/sharepoint/soap/GetListItems");
	        },
	        data: d,
	        success: function(data) {
                //return processor(data);
                return data;
            },
            error: function(jqXHR, textStatus) {
                //return error(jqXHR, textStatus);
                return d;
            }
	    });
	};
	
	var soapWrapper = function(ln, vn, q, method) {
		var m, envelope;

		if(method.toLowerCase()==='updatelistitems') {
			m = 'UpdateListItems';
		}
		else if(method.toLowerCase()==='getlistitems') {
			m = 'GetListItems'; 
		}

		return envelope = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><"+m+" xmlns='http://schemas.microsoft.com/sharepoint/soap/'><listName>"+ln+"</listName><viewName>"+vn+"</viewName>"+q+"</"+m+"></soap:Body></soap:Envelope>";
	};

	var conditionParser = function(where) {
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
		 * Receives columns and conditions like an SQL select statement
		 * @param Array cols Columns to query in select statement
		 * @param Optional String condition Accepts a standard CAML where statement
		 * @return XML
		**/
		getListItems: function(list, view, cols) {
			var i=0,
				colTotal = cols.length,
				columns = '',
				colRef = '',
				conditions = '',
				listQuery = '',
				query = '<query><Query>{{conditions}}</Query></query>',
				soap = '',
				viewFields = '<viewFields><ViewFields>{{fields}}</ViewFields></viewFields>';
			for(; i<colTotal; i++) {
				columns += '<FieldRef Name="'+cols[i]+'"" />';
			}
			colRef = viewFields.replace('{{fields}}', columns);

			if(arguments[3]) {
				conditions = query.replace('{{conditions}}', arguments[3]);
			}
			listQuery = colRef+conditions;
			soap = soapWrapper(list, view, listQuery, 'getListItems');
			console.log(soap);
			return sendData(soap);
			//return soap;
		},
		
		/**
		 * Updates or creates a new table row
		 * @param Object cols Key->Value pair to modify row
		 * @return XML
		**/
		updateListItems: function(cols) {
			return sendData(d, 'updateListItems');
		}
	};
	
})('https://nserc.navy.mil/spawar/hq/chengws/TechRev');

console.log(SPWebService.getListItems('{A2D3739E-C1F6-4A61-951B-FBBE4476BD4A}', '{A2FEAB3C-CB38-40DE-B20E-BD9493D18308}', ['ID', 'Title', 'Technical_x0020_Discipline_x0020', 'Risk_x0020_Assessment', 'ACAT_x0020_Level_x0028_s_x0029_', 'SETR_x0020_Event_x0020_Type', 'Parent_x0020_Question', 'Assessment_x0020_Criteria_x002f_', 'Reference_x0020_Document_x002f_I', 'Relevant_x0020_Document_x0028_s_', 'Comments', 'Core_x0020_Question_x003f_', 'CSE_x0020_Assigned', 'Scope'], "<Where><And><Eq><FieldRef Name='SETR_x0020_Event_x0020_Type' /><Value Type='String'>TRR</Value></Eq><Eq><FieldRef Name='Technical_x0020_Discipline_x0020' /><Value Type='String'>Chief System Engineer</Value></Eq></And></Where>"));