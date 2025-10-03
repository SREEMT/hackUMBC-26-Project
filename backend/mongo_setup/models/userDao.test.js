const dbcon = require('./DbConnection');
const dao = require('./userDao');

beforeAll(async function(){ //Executed once before all tests
    dbcon.connect('test');
});
afterAll(async function(){ // Executed once after all tests have ran
    await dao.deleteAll();
    dbcon.disconnect();
});
beforeEach(async function(){ // Executed before each test
    await dao.deleteAll();
});
afterEach(function(){
    //No need
});

test('Create new user test',async function(){
    let newdata = {name:'Test',login:'test@test.com',
                  password:'123456',permission:1};
    let created = await dao.create(newdata);
    let found = await dao.read(created._id);
    
    //assertions
    expect(created._id).not.toBeNull(); // id cannot be null after creation
    expect(created.login).toBe(found.login); //login should match with found
});

test('Delete User', async function(){
    let newdata = {name:'Test',login:'test@test.com',
                  password:'123456',permission:1};
    let created = await dao.create(newdata); // create a new user
    let deleted = await dao.del(created._id); // then we delete the user
    let found = await dao.read(created._id); // we search for the deleted user

    expect(found).toBeNull(); // should be null since we deleted it
    expect(deleted._id).toEqual(created._id); //the one we created should ne the same deleted
    // Use "toEqual" for _id
});

test('Read All', async function(){
    let newdata1 = {name:'Test 1',login:'test1@test.com',
                  password:'123456',permission:1};
    let newdata2 = {name:'Test 2',login:'test2@test.com',
                  password:'123456',permission:1};
    let newdata3 = {name:'Test 3',login:'test3@test.com',
                  password:'123456',permission:1};

    await dao.create(newdata1);
    await dao.create(newdata2);
    await dao.create(newdata3); //create 3 users

    let lstUsers = await dao.readAll(); // read all users

    expect(lstUsers.length).toBe(3); //should be a list of 3
    expect(lstUsers[0].login).toBe("test1@test.com"); // 1st user login is test1 
});

test('Find Login user', async function(){
    let newdata = {name:'Test',login:'test@test.com',
                  password:'123456',permission:1};
    let created = await dao.create(newdata); // create a new user

    let logged = await dao.findLogin(newdata.login);

    expect(logged).not.toBeNull();
    expect(logged._id).toEqual(created._id);
    expect(logged.login).toEqual(created.login);
});

test('Login not found', async function(){
    let newdata = {name:'Test',login:'test@test.com',
                  password:'123456',permission:1};
    let created = await dao.create(newdata); // create a new user

    let badlogged = await dao.findLogin("not the login","654321"); //should not find
    expect(badlogged).toBeNull();
});