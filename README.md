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

    It is an important thing in the majority of programs. It allows you, if the tests are well done, be sure that your code is enough roboust to pass your battery of tests. If you make tests for having a minimal functionality, everytime when your code run fine that battery of tests you will be a bit sure that everything is one is sure that aquire the less possibles functionalities. Imagine that situation: you have a function that perform a sum between two numbers, 'a' and 'b':
    
```javascript
function sum (a,b){
    return a + b;
}
```
For testing some code, we have to