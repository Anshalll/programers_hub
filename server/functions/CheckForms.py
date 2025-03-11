from db import database
from  functions.CheckRequiredFields import CheckFields ,   ValidateEmail  
from functions.PasswordWorks import  CheckPassword


def CheckRegisterForm(data):
      
        reqfields = [
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}
        ]
        fieldscheck = CheckFields(reqfields , data)
   
        if fieldscheck["error"]:
            return {"error": True, "message": fieldscheck["message"], "status_code": 400}
        
        isValidEmail = ValidateEmail(data.get("email"))
    
        if not isValidEmail:
            return {"error": True, "message": "Invalid email", "status_code": 400}
        
        checkpass = CheckPassword(data.get("password"))
        if  not checkpass["valid"]: 
            return {"error": True, "message": checkpass["error"], "status_code": 400}

        if data.get("password").strip() != data.get("confirmpassword").strip():
            return {"error": True, "message": "Confirm password does not match!", "status_code": 400}

        checkemail = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s" , (data.get("email").strip(), ))
      
        if len(checkemail) > 0:
             return {"error": True, "message": "This email is taken!", "status_code": 400}
    
        checkusername = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (data.get("username").strip(), ))
           
        if len(checkusername) > 0: 
            return {"error": True, "message": "Username is taken!", "status_code": 400}
        
        return {"error": False}
