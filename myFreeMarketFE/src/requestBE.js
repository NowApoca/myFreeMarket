const axios = require("axios");
const {apiUrl} = require("../settings.json");

function getBackEnd(endpoint) {
	let endpointUrl = "http://" +apiUrl + endpoint;
    const headers = {};
	return axios.get(endpointUrl.toString(), { headers: headers });
}

function postBackEnd(endpoint, data) {
	let endpointUrl = "http://" + apiUrl + endpoint;
    return axios({
        method: 'post',
        url: endpointUrl,
        data: data
      });
}

module.exports = {
    getBackEnd,
    postBackEnd
}