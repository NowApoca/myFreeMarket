
async function ping(req, res){
    res.status(200).json(true)
}  

module.exports = {
    ping
}