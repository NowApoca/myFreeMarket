

module.exports = {
    getErrorAsyncRequest: async function(func){
        try{
            await func;
        }catch(e){
            return {e: e.response.statusText, status: e.response.status};
        }
        return "Not Throwed"
    }
}