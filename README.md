# myFreeMarket
A personal project for improving programmatic skills.


### This project was designed for practising several aspects of a complex server such as:

- Databases.
- Resiliency.
- Reliability.
- Read replicas.
- Master-Slave arquitecture.
- Master-Master arquitecture.
- Monitors.
- Tests enviroment: Unit and functional testing.
- Load Balancers.
- Proxy Servers.
- Basics of a frontend development with ReactJS and reactstrap.
- Web Sockets.
- Loggers.
- Scalability.
- Scaling out and up.
- Security.
- Back ups in real time.
- Docker.
- Jenkins.
- Identity and Access Management. (Not in AWS, in a normal web).
- RDS vs NoSql (Comparation of performance).
- Probably something of data minning and analytics.
- 2FA.
- Cookies.
- Caching.
- Sessions.
- Notificatons.

Probably more points are going to be added on the road.

Points to be covered in the program:

- Log in service.
- 2FA.
- Notifications.
- Upload products.
- Streaming of prices. (Probably with auctions in real time).
- Tests.
- Automatic tests.
- Monitors of api.
- API rest.
- A basic front end.
- A dynamic and scalable deployment such as database and servers by settings.
- Dynamic translation. More than 2 languages and regions supported.
- Forums for complaining.
- Filters in searchs.
- Password Recovery and that things.
- Some data apps.

In general, I am going to use javascript. Also this project is going to have code in Python and probably in C# or C.

I am going to write about my experience with that project. I do not expect to teach anybody, with explaining steps I try to explain what I am doing so if I commit a mistake, any programmer will know what I thought in that moment and if I do not do it so bad, people that want to improve their programmatic skills are going to have a friendly documentation. 

## Several aspects

My idea was organizing the project in three big sections: BackEnd, NodeBackEnd and FrontEnd. Let's see a summary of each one.

### BackEnd

    The BackEnd is the most important one in this project. It has both products and users tables which means that Frontend is going to request him the data (never request directly to NodeBackEnd) and the NodeBackEnd will transfer Txs, confirmate Txs and make deposits to users. IP of both backends are going to be private, frontend's api will be the unique public IP. Probably, in a certain future, I will code an API server for making request such prices, products, etc.

### NodeBackEnd

    NodeBackEnd ( or NBE ) is in charge of managing the flow of money in the myFreeMarket which means that he has to hold the private key of the main account and his respective childrens ( or deposit addresses ). It envolves the security of the BackEnd too, because the last one is the unique capable of withdraw money from the NBE. I choose Ethereum Blockchain because his useful testnet networks, npm libraries and because I work on ETH previously.

### FrontEnd

    I am going to be honest, I do not like programming front end code so much but if I want to make something cute, I must code something of front end. A simply interface made with Bootstrap is going to be code.

## A brief explanation of how Ethereum Blockchain works

    Here I am going to explain how apply that technology in a project of this characteristic. Basically, it has three types of addresses: deposit addresses, investor addresses and operation addresses.

### Deposit addresses

    Each user has at least 1 deposit address which he will use for refilling his balance. For that, He must sent amount to his address and the system will charge the amount of the transaction to the balance of the user. Note that users do not have the private keys of their deposit addresses, they unique way of interacting with the system is by sending money to that account or, if user has balance inside, making withdraws to accounts out of the system.

### Investor addresses

    In fact, that addresses do not help in the enviroment of the digital market. Of course is not obligatory, I decided a schema of investors for making something more complex but is not necesary.
    Basically, when you sell some product in that market you have to pay a porcentage of the sale, let's say 10%. Every day, or week, or month ( it depends on the schema ), the money of the fees will be distributed in the investors group by Ethereum transfers from an operation account. Only the money of the Fees, because if you take more money than you receive from deposits, you risk your system to run out of Ethers.

### Operation addresses

    Them are the most important addresses of all because from them, the system will distribute money, derive deposit child addresses and hold both fee and users money! Despite of sending money to the deposit address, with the private Key of the operation account you can sign transfers from deposit addresses. That model is called deterministic wallets and the idea is controlling a set of addresses with a same private key which is derivated for getting deposit addresses private keys.
    
## Testing

### Unit tests

    It is an important thing in the majority of programs. It allows you, if the tests are well done, be sure that your code is enough roboust to pass your battery of tests. If you make tests for having a minimal functionality, everytime when your code run and pass the battery of unit-tests you will be sure that everything you tested would be working fine. For example, imagine that situation: you have a function that perform a sum between two numbers, 'a' and 'b':
    
```javascript
function sum (a,b){
    return a + b;
}
```

How we test it? We have to reproduce the function externaly and compare the results betweet the function tested and the external behaviour and they have to be equal.

```javascript
function sum (a,b){
    return a + b;
}

function isSumWorking (){
    const resultSum = sum( 4, 5);
    const externalSum = 4 + 5; 
    return resultSum + externalSum;
}
```

Code above is a ugly way of testing if sum works. We reproduce a case externaly ( externalSum ) and compare the result of both behaviours and we expect them to match. Of course production code appearence is not like that, there are test tools like 'mocha' or 'jest' that allow us to make quality tests.

The idea of unit testing is, as the name says, test an unique functionality. Perhaps test an unique functionality require to test another functions, but we focus on the behaviour of that single functionality that we want to test because if another function fails, it is going to be showed in the test of the failed one. Let's see an example of myFreeMarket tests:


```javascript
    it('Log up', async () => {
        const user = {
            name: uuid4(),
            lastName: uuid4(),
            mail: uuid4(),
            password: uuid4()
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/logup", user);
        expect(resultPost.data.result).toEqual("DONE");
        expect(resultPost.status).toEqual(200);
        const users = database.getUsersCollection();
        const resultGet = await users.findOne({name: user.name})
        expect(resultGet.mail).toEqual(user.mail);
    });

    it('Log in with an invalid email', async () => {
        let user = {
            name: uuid4(),
            lastName: uuid4(),
            mail: uuid4(),
            password: uuid4()
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/logup", user);
        expect(resultPost.data.result).toEqual("DONE");
        expect(resultPost.status).toEqual(200);
        const users = database.getUsersCollection();
        const resultGet = await users.findOne({name: user.name})
        expect(resultGet.mail).toEqual(user.mail);
        user.mail = "Invalid Mail"
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/login", user));
        expect(resultError.e).toEqual("Invalid Mail or Password.")
        expect(resultError.status).toEqual(404)
    });
```

The first test, 'Log Up', test the registration of a person to the web site. The second test try to Log In with an invalid mail and expects request to exploit. If the Log Up in the second test exploit, we are going to see it reflected in the first test result so we know that the second test is not working because the first part of the code is exploding, not because the second test not work. Maybe it does not work too, but we know that the log up does not work.

### Integration tests

There are huge types of tests like Unit Testing, System Testing, Smoke testing, Volume Testing, Performance Testing, etc. I will only focus on two types: Integration tests and Unit tests. As the name says, Integration Tests involve more than one module of code and test the combined functionality of both. By now I do not have working integration tests, if a future I will explain that with examples.


## Log in session.

Actually I am using sessions for the Log in code. Basically, when an user logs succefully recives an sessionID from the website. Both user and server keep that sessionID that allows user to close and open the website and still being loged. I choose to expire user's sessionID so if the user left there will be few minutes for making malicious atacks. Basically I generate a random ID with the library uuid, more precisaisly the random v4. I save it in cookies which is vulnerable to atacks if the user's computer is compromised. It is difficult to make a friendly user interface secured of atacks if the user's PC is compromised, so I choose do not ask 2FA for all user actions, by default only for withdraws, purchases and sales. If the user wants he can uncheck that options.

### 2FA

That part of the code is not available now but the idea is next. Basically, both client and google generate a password with them in the moment of scan the QR. That passwords are going to be synced ( google supports HOTP and TOTP which are algorithms for generating one-time passwords) in both sides. When the user requires 2FA, the website server will ask his password and check with google if that code match. If it does, website allows the user to operate free. It is a step of security very important because both PC and cellphone have to be compromised for a full atack to users. In the next weeks I will upload an example.

### Password Save

Password is going to be keep encrypted. When the user Logs Up, website frontend hashs the password and send to the backend server the encrpyted password. When user wants to log in, he will write his password and send the log in request after hashing his password again, so the serverside would check if both passwords match. Only will match the encrpyted correct password with the log up encrpyted password. It prevents the server to be hacked, which does not affect the server but in case of do not encrpy the passwords it allows atackers to have the passwords of all the users and use them for atacking anothers web pages.

## Database

As we manage transactions, purchases and things with money, the best way of not having errors is with a database strong of ACID ( atomicity, consistency, isolation and durability). What does it means? Well, let's explain each characteristic of ACID with an example:

### Atomicity
    It guarantees that the action will not be perfomed partially. It fails or succeeds fully, never partially. It is very important because for preventing errors like crashes or power failures. If a bank transfer from A to B fail after taking the money from A and do not upload the balance of B, we will lost the money of A because it was not recorded and B balance was not refreshed.

### Consistency
    Consistency ensures you everytime that you read some data from database it is going to have the correct value. It saves you of reading the precise balance of an account.

### Isolation
    Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially. It prevents take entire balance of the user and try to send money before the change is committed from that account to other. With Isolation that transfer can not be do because the second action will know that a first action of withdraw was executed and there is no balance available.

### Durability
    Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure. For example, if energy crashs we could fine the database in a non-volatile memory.

In my opinion, RDS (Relational Data Bases) perform better ACID characteristics than NoRDS. Despite of that fact, I will use MongoDB. It is a NoSQL database, but recently it has obtained some ACID characteristics and I want to test them.

## Scalability.

First of all, what is scalability? In my opinion, a software project is scalable when if the demanding of that service grows, that project will be able to grow proportionaly to that increase of demands in a easy way, such as buying more hardware, putting more read databases, etc.

Obtain scalability could be a big problem if the architecture of the project is not thought for that purpouse from the beginning. Make a project scalable involves changes of code from the root and often that derivates in re-writting a lot of functions, tests, middlewares, etc. It is not easy make that changes! Here I throw some material for getting inside that branch of the software development.

(LINKS)

### General concepts.

There are two types of scalability: Horizontal or Vertical scaling. Horizontal scalling is when the developer adds more machines to the network and combine them for improving the speed (distributing tasks in all computers, multi-threading for processing data, etc). Vertical scalling means that the developer increase the power of a single PC, putting more RAM, CPU or whatever he wants. I am going to say something that I will repeat in the entire document: DO NOT FALL IN LOVE WITH ANYTHING. Both scalability models are useful, the important thing is the context. For example I would use horizontal architecture for scaling read databases and vertical one for scaling a one-write database. It is important to understand that, the most part of the tools were designed for one purpouse in a specific context and often you can apply that tool for resolving a similar problem.

Another key of scalability is the design concept. Your project is going to have some points of failure and you will have to make a decision of how handle it. Decision of what solution fits or perform better in your set up. I will cover that in a future section.

### Replication.

Replicate databases means that you will have the same information in more than one databases. Depending on the architecture, you can have one main write databases that will handle all the requests that change the content of the databases and the other databases will just only return the requested data. Only one database handling all write requests while more than one database answer read requests? Why? Well, first of all there is an avarage of 10 of 100 are write request and the other 90 are read requests, so it is okey to distribute requests in that way. Second, having a unique write database improves ACID characteristics in that one.

But, what pass if the project demands a replication of the writer database too? How you ensure ACID characteristics if you have more than one database and they are separated? Reach scalability is not easy, in the next section we will discuss some architectures that I found that could be useful for that kind of projects.

### Master-Master structure.
