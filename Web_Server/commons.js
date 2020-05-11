module.exports = {
    check_password_verification : function(password, vpassword){
        if(password === vpassword){
            return true;
        }else{
            return false;
        }
    }
};