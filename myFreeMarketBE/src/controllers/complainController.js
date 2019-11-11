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
        complainer: req.params.user,
        helper: "",
        complainKey: uuid,
        points: 0,
        voters: [],
        timestamp: Math.trunc((new Date()).getTime()/1000),
    })
    user.complains.push(uuid)
    await users.updateOne({mail: req.params.user},{$set: {complains: user.complains}})
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

async function setComplainColour(req, res){
    const complains = database.getComplainsCollection();
    await complains.updateOne({complainKey: req.params.complainId},{$set:{colour:req.params.colour}});
    res.status(200).json("Done.");
}

async function closeComplain(req, res){
    const complains = database.getComplainsCollection();
    await complains.updateOne({complainKey: req.params.complainId},{$set:{status:"closed", helper: req.params.user, 
    closeTimestamp: Math.trunc((new Date()).getTime()/1000)}});
    res.status(200).json("Done.");
}

async function commentComplain(req, res){
    const complains =  database.getComplainsCollection();
    const complain = await complains.findOne({complainKey: req.params.complainId});
    complain.comments.push({
        text: req.body.text,
        timestamp: Math.trunc((new Date()).getTime()/1000),
        user: req.params.user,
        points: 0,
        voters: [],
    })
    await complains.updateOne({complainKey: req.params.complainId}, {"$set": {comments: complain.comments}});
	res.status(200).json("Done.");
}

async function voteComplainComment(req, res){
    const complains = database.getComplainsCollection();
    const { user, voted, comment, numberComment } = res.locals;
    const complain = await complains.findOne({complainKey: req.params.complainId});
    if(voted){
        if(req.params.action == "upvote"){
            comment.points--;
        }else{
            comment.points++;
        }
        comment.voters.splice(comment.voters.indexOf(user.mail),1);
    }else{
        if(req.params.action == "upvote"){
            comment.points++;
        }else{
            comment.points--;
        }
        comment.voters.push(user.mail);
    }
    complain.comments[numberComment] = comment;
    await complains.updateOne({complainKey: req.params.complainId},{$set:{comments: complain.comments}});
    res.status(200).json("Done.");
}

async function voteComplain(req, res){
    const { user } = res.locals;
    const complains = database.getComplainsCollection();
    const complain = await complains.findOne({complainKey: req.params.complainId})
    if(req.params.action == "upvote"){
        if(res.locals.voted){
            complain.voters.splice(complain.voters.indexOf(user.mail),1);
            await complains.updateOne({complainKey: req.params.complainId},{$inc:{points: -1}});
        }else{
            complain.voters.push(user.mail);
            await complains.updateOne({complainKey: req.params.complainId},{$set: {voters: complain.voters}, $inc:{points: 1}})
        }
    }else{
        if(res.locals.voted){
            complain.voters.splice(complain.voters.indexOf(user.mail),1);
            await complains.updateOne({complainKey: req.params.complainId},{$inc:{points: 1}});
        }else{
            complain.voters.push(user.mail);
            await complains.updateOne({complainKey: req.params.complainId},{$set: {voters: complain.voters}, $inc:{points: -1}})
        }

    }
    res.status(200).json("Done.");
}

module.exports = {
    newComplain,
    getComplainsByColour,
    setComplainColour,
    closeComplain,
    commentComplain,
    voteComplainComment,
    voteComplain,
}

