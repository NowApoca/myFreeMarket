const { initialize } = require(__dirname + "/../index");
const database = require(__dirname + "/../src/database/database");
const settings = require(__dirname + "/./config.json");
const axios = require("axios");
const uuid4 = require("uuid/v4");
const expect = require('expect');
const common = require("./common")

before(() => {
  return new Promise((resolve) => {
    initialize(settings);
    setTimeout(() => {
      resolve();
    }, 5000);
  });
});

describe('Products Controller', function() {
    
    it('Publish a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
    });

    it('Get complains by colour', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const complainObj2 = {
            colour: "yellow",
            text: " My pay did not test",
            tag: "Pays",
        }
        const complainObj3 = {
            colour: "green",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj2)
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj3)
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const resultGet = await axios.get("http://localhost:" + settings.port + "/complain/by/colour/red")
        expect(resultGet.data.length).toEqual(3);
    });

    it('Publish a complain and change colour', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj);
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/"+complain.complainKey+"/change/colour/green");
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const complainAfterSet = await complains.findOne({complainer: user.mail});
        expect(complainAfterSet.colour).toEqual("green")
    });

    it('Publish a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/close/"+complain.complainKey+"/user/"+user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const complainClosed = await complains.findOne({complainer: user.mail});
        expect(complainClosed.status).toEqual("closed")
        expect(complainClosed.helper).toEqual(user.mail)
    });


    it('Publish a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/close/"+complain.complainKey+"/user/"+user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const complainClosed = await complains.findOne({complainer: user.mail});
        expect(complainClosed.status).toEqual("closed")
        expect(complainClosed.helper).toEqual(user.mail)
    });

    it('Comment a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/comment/" + complain.complainKey + "/user/" + user.mail, {
            text: "Comment complained",
        });
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const commentedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(commentedComplain.comments.length).toEqual(1);
        expect(commentedComplain.comments[0].text).toEqual("Comment complained");
    });

    it('Upvote a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/" + user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const pointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(pointedComplain.points).toEqual(1);
    });


    it('Downvote a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/" + user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const pointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(pointedComplain.points).toEqual(-1);
    });

    it('Upvote a complain 2 times', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        };
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/" + user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const pointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(pointedComplain.points).toEqual(1);
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/" + user.mail);
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const desPointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(desPointedComplain.points).toEqual(0);
    });

    it('Downvote a complain 2 times', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        };
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/" + user.mail);
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const pointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(pointedComplain.points).toEqual(-1);
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/" + user.mail);
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const desPointedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(desPointedComplain.points).toEqual(0);
    });
    
    it('Upvote a complain comment', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/comment/" + complain.complainKey + "/user/" + user.mail, {
            text: "Comment complained",
        });
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const commentedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(commentedComplain.comments.length).toEqual(1);
        expect(commentedComplain.comments[0].text).toEqual("Comment complained");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const votedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(votedCommentedComplain.comments[0].points).toEqual(1);
    });


    it('Downvote a complain comment', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/comment/" + complain.complainKey + "/user/" + user.mail, {
            text: "Comment complained",
        });
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const commentedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(commentedComplain.comments.length).toEqual(1);
        expect(commentedComplain.comments[0].text).toEqual("Comment complained");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const votedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(votedCommentedComplain.comments[0].points).toEqual(-1);
    });

    it('Undo upvote a complain comment', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/comment/" + complain.complainKey + "/user/" + user.mail, {
            text: "Comment complained",
        });
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const commentedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(commentedComplain.comments.length).toEqual(1);
        expect(commentedComplain.comments[0].text).toEqual("Comment complained");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const votedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(votedCommentedComplain.comments[0].points).toEqual(1);
        const resultPost4 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/upvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost4.status).toEqual(200);
        expect(resultPost4.data).toEqual("Done.");
        const undoVotedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(undoVotedCommentedComplain.comments[0].points).toEqual(0);
    });


    it('Undo downvote a complain comment', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/complain/comment/" + complain.complainKey + "/user/" + user.mail, {
            text: "Comment complained",
        });
        expect(resultPost2.status).toEqual(200);
        expect(resultPost2.data).toEqual("Done.");
        const commentedComplain = await complains.findOne({complainKey: complain.complainKey})
        expect(commentedComplain.comments.length).toEqual(1);
        expect(commentedComplain.comments[0].text).toEqual("Comment complained");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost3.status).toEqual(200);
        expect(resultPost3.data).toEqual("Done.");
        const votedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(votedCommentedComplain.comments[0].points).toEqual(-1);
        const resultPost4 = await axios.post("http://localhost:" + settings.port + "/complain/" + complain.complainKey + "/vote/downvote/user/"+ user.mail +"/comment/0", {
            text: "Comment complained",
        });
        expect(resultPost4.status).toEqual(200);
        expect(resultPost4.data).toEqual("Done.");
        const undoVotedCommentedComplain = await complains.findOne({complainKey: complain.complainKey});
        expect(undoVotedCommentedComplain.comments[0].points).toEqual(0);
    });
});

async function createUser(){
    const user = {
        name: uuid4(),
        lastName: uuid4(),
        mail: uuid4(),
        password: uuid4()
    }
    await axios.post("http://localhost:" + settings.port + "/logup", user);
    return user;
}

async function createProduct(productParameters){
    await axios.post("http://localhost:" + settings.port + "/publish", productParameters);
    return;
}

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}