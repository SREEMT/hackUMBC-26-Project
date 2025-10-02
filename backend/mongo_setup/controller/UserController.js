const dao = require('../models/userDao'); 
const passUtil = require('../util/PasswordUtil');

exports.getAll = async function(req, res){
    if( exports.adminCheck(req) === true ){ //security check
        //User are sensitive info, not necessary to check admin for every data
        res.status(200); // 200 = Ok
        res.send(await dao.readAll()); //send all users back to the client
        res.end();
    }else{  // Not admin, should not be able to see all users
        res.status(403); //forbidden
        res.end();
    } 
}

exports.deleteOne = function(req,res){
    //URL parameter always on req.params.<name>
    let id = req.params.id; //get param with id (different than body)    
    
    if(exports.adminCheck(req)){ //extra layer of security using session, not always necessary   
        dao.del(id);
        res.redirect('../admin/cruduser.html');
    } else {
        res.status(403);
        res.end();
    }
}

exports.postCreateOrUpdate = function(req,res){
    let newuser = {}; //empty obj
    newuser.login = req.body.txt_login;
    newuser.password = passUtil.hashPassword(req.body.txt_pass);
    if(exports.adminCheck(req)===true && req.body.txt_perm){ 
        // if Admin and permission data was sent
        newuser.permission = parseInt(req.body.txt_perm); //we fetch permission
    } else { //Otherwise can only be common user permission
        newuser.permission = 2;
    }

    if(req.body.txt_id){
        //update user
        newuser._id = req.body.txt_id;
        console.log('Update user');
        dao.update(newuser); //be careful to not override the password
    }
    else{
        //insert user
        dao.create(newuser);        
    }

    if(exports.adminCheck(req)===true) //if admin, redirect to crudusers
        res.redirect("admin/cruduser.html");
    else //regular user send to index
        res.redirect('index.html');
}

exports.login = async function(req, res){
    let plogin = req.body.txt_login;
    let user = await dao.findLogin(plogin);

    if(user == null){ //login not found, redirect to login page displaying error
        res.redirect('login.html?error=1');
    } else {
        //login found, check passwords
        if(passUtil.comparePassword(req.body.txt_pass, user.password)){
            //password matched with hashed one, login & pwd ok
            console.log("login sucessfull");

            //Save the user in the session
            req.session.user = user;
            res.redirect('index.html');
        }
        else{ // passwords do not match, redirect to login page displaying error
            res.redirect('login.html?error=1');
        }
    } 
}

exports.loggedUser = function(req,res){
    res.status(200); // 200 = Ok
    if(req.session.user) // if there is a logged user
        res.send( req.session.user ); //send the logged user
    else //otherwise send null
        res.json(null); //need to use res.json() because send(null) sends nothing
    res.end(); 
}

exports.logout = function(req, res){
    req.session.user = null; // user info no longer in session (logout)
    res.redirect('index.html');
}

exports.adminCheck = function(req){ //Use inside controllers to check permissions
    return (req.session.user && req.session.user.permission == 1);
    // true if admin (user not null/undefined and permission = 1)
}