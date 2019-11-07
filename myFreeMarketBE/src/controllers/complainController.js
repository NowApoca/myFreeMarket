const database = require(__dirname + "/../database/database");
const uuidv4 = require('uuid/v4');

async function newComplain(req, res){
    const { user } = res.locals
    const users = database.getUsersCollection();
    const complains = database.getComplainsCollection();
    const uuid = uuidv4();
    await complains.insertOne({
        colour: req.body.colour,
        text: req.body.text,
        tag: req.body.tag,
        comments: [],
        status: "unsolved",
        complainer: req.body.complainer,
        helper: "",
        complainID: uuid,
        timestamp: Math.trunc((new Date()).getTime()/1000),
    })
    user.complains.push(uuid)
    await users.updateOne({mail: res.body.complainer},{$set: {complains: user.complains}})
	res.status(200).json("Done.");
}

async function getComplainsByColour(req, res){
    const complains = database.getComplainsCollection();
    const queryResult = await complains.find({colour: req.params.colour});
    let output = [];
    await queryResult.forEach(function(item){
        output.push(item);
    })
    res.status(200).json(output);
}

async function changeComplainColour(req, res){
    const complains = database.getComplainsCollection();
    await complains.updateOne({complainID: req.params.complainID},{$set:{colour:req.params.colour}});
    res.status(200).json();
}

async function closeComplain(req, res){
    const complains = database.getComplainsCollection();
    await complains.updateOne({complainID: req.params.complainID},{$set:{status:"close", helper: req.body.helper, 
    closeTimestamp: Math.trunc((new Date()).getTime()/1000)}});
    res.status(200).json();
}

async function commentComplain(req, res){
    const complains = database.getComplainsCollection();
    const complain = await complains.findOne({complainID: req.params.complainID});
    complain.comments.push(req.body.comment);
    await complains.updateOne({complainID: req.params.complainID},{$set:{comments: complain.comments}});
    res.status(200).json();
}

async function subcommentComplain(req, res){
    const complains = database.getComplainsCollection();
    const complain = await complains.findOne({complainID: req.params.complainID});
    complain.comments[req.body.commentIndex].push(req.body.subcomment);
    await complains.updateOne({complainID: req.params.complainID},{$set:{comments: complain.comments}});
    res.status(200).json();
}

async function upvoteComplain(req, res){
    const complains = database.getComplainsCollection();
    if(res.locals.voted){
        await complains.updateOne({complainID: req.params.complainID},{$inc:{points: -1}});
    }else{
        const complain = await complains.findOne({complainID: req.params.complainID})
        complain.upvoters.push(req.body.user);
        const complain = await complains.updateOne({complainID: req.params.complainID},{$set: {upvoters: complain.upvoters}})
        await complains.updateOne({complainID: req.params.complainID},{$inc:{points: 1}});
    }
    res.status(200).json();
}

module.exports = {
    newComplain,
    getComplainsByColour,
    changeComplainColour,
    closeComplain,
    commentComplain,
    subcommentComplain,
    upvoteComplain,
    undoUpvoteComplain,
}

