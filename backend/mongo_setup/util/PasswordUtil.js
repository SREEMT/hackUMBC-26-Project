const bcrypt = require('bcrypt');

exports.hashPassword = function(stringpwd) { 
    const salt = bcrypt.genSaltSync(6);
    const hashedPassword = bcrypt.hashSync(stringpwd, salt);
    return hashedPassword;
}

exports.comparePassword = function(stringpwd, hashedpwd){
    return bcrypt.compareSync(stringpwd, hashedpwd);
}