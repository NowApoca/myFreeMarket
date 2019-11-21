

module.exports = {
    getErrorAsyncRequest: async function(func){
        try{
            await func;
        }catch(e){
            return {e: e.response.statusText, status: e.response.status};
        }
        return {status: 200, e: "Not Throwed"}
    },
    sleep: async function sleep(milliseconds) {
	        while (milliseconds > 0) {
            const to_wait = (milliseconds > 300) ? 300 : milliseconds;
            await new Promise((resolve) => {
                setTimeout(resolve, to_wait);
            });
            milliseconds -= to_wait;
	        }
        }
}