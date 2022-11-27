const isFunction = (fn) => ({}).toString.call(fn) === "[object Function]";
const isPlainObject = obj => ({}).toString.call(obj) === '[object Object]';

function handleErrors(response) {
	if (!response.ok) {
		if (response.status == 400) {
			return response.json().then(data => {
				console.error(data.data.errors);
				throw new Error(JSON.stringify(data.data.errors));
			});
		} else if (response.status === 401) {
			if(!sessionStorage.getItem('_ticket')) alert('Session expired. Plese login again')
            // Redirect to Login
            window.location.href = "#/login";
            sessionStorage.clear();
		}
		else throw new Error(JSON.stringify(response.statusText));
	}
	return response;
}

const requestor = defaults => ( requestURL, options = {} ) => {
	if(isPlainObject(options) === false) options = {};
	const onError = options.onError; delete options.onError;
	let contentType = "application/json;";
	// merging defaults and other passed options, and deep merging body and headers.
	let _body = options.body;
	let _headers = options.headers;

	requestURL = options.requestURL || requestURL;

	if(options && options.headers && options.headers.get) {
		options.body = _body
		options.headers = _headers
		options.headers.set("sessionid", sessionStorage.getItem('_ticket'))

	} else {
		options = Object.assign({}, defaults, options, { headers : { ...defaults.headers, ...options.headers } },{ body: JSON.stringify(options.body)});
		options.headers.sessionid = sessionStorage.getItem('_ticket')
	}	
	
	return fetch(requestURL, options)
	.then(response => {
		handleErrors(response);
		if(response && response.headers && isFunction(response.headers.get)) 
			contentType = response.headers.get("Content-Type");
		
		if (contentType.includes("application/json;"))
			return response.json();
			
		if (contentType.includes("application/json;") && options.headers.type=='blob')
			return response.json();
		else{
			return response.blob();
		}
	})
	.catch(error => {
		console.error(JSON.stringify(error));
		isFunction(onError) && onError(error);
		return {error, status: "unsuccess"};
	});
}

const NREST = requestor({
	method: "POST",
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
	},
});

const jsonserverRead = function (url, query) {
	// const processQuery = function (querydetails) {
	// 	var result = "";
	// 	if (querydetails.id) result += `/${querydetails.id}`;
	// 	if (querydetails.start) {
	// 		if (!querydetails.end) querydetails.end = querydetails.start + 20;
	// 		result += `&_start=${querydetails.start}&_end=${querydetails.end}`;
	// 	}
	// 	const operatormap = { $lte: "_lte", $gte: "_gte", $eq: "" };
	// 	if (querydetails) {
	// 		result += `&user=${JSON.stringify(user)}`;
	// 		Object.keys(querydetails).forEach(key => {
	// 			var condition = querydetails[key];
	// 			if (typeof condition === "object") {
	// 				result += `&${key}=${encodeURIComponent(JSON.stringify(condition))}`;
	// 			} else {
	// 				result += `&${key}=${querydetails[key]}`;
	// 			}
	// 		});
	// 	}
	// 	return result;
	// };
	var requestURL = url;
	// if (query) requestURL += "?" + processQuery(query);
	if (query) requestURL;
	return fetch(requestURL)
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};

const jsonserverCreate = function (requestURL, data) {
	const body = { ...data };
	return fetch(requestURL, {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};

export default options => {
	var baseurl = options ? (options.baseurl || "") : "",
		serverType = options.servertype || "jsonserver",
		fetchCreate = null, 
		fetchRead = null, 
		fetchUpdate = null, 
		fetchDelete = null

	switch(serverType) {
		case "jsonserver":
			fetchRead = jsonserverRead;
			fetchCreate = jsonserverCreate;
			break;

		default:
			fetchCreate = fetchRead = fetchUpdate = fetchDelete = NREST;
			break;
	}

	return {
		collection(collName) {
			return {
				create(data) {
					return fetchCreate(`${baseurl}/${collName}`, data);
				},
				read(data) {
					return fetchRead(`${baseurl}/${collName}`, data);
				},
				readone(id) {
					return fetchRead(`${baseurl}/${collName}/${id}`);
				},
				update(data) {
					return fetchUpdate(`${baseurl}/${collName}`, data);
				},
				delete(data) {
					return fetchDelete(`${baseurl}/${collName}`, data);
				}
			};
		}
	};
};
