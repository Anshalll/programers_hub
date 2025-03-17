from flask import Flask, jsonify , request , session
from  flask_cors import CORS
from db.db import database
from  functions.CheckRequiredFields import CheckFields
from functions.PasswordWorks import VerifyPassword , HashPassword , CheckPassword
from functions.GenerateVals import GenerateOTP
from functions.SendMail import SendMail
from functions.CheckForms import CheckRegisterForm
from functions.GetTime import GetTime
from functions.Deleteotps import Deleteotps
from  functions.jwtstring import Generatejwt

import os

app = Flask(__name__)
CORS(app , supports_credentials=True,   origins=[os.getenv("CLIENTURL") , "http://localhost:5173" , "http://127.0.0.1:5173"])

database.get_connection()
app.secret_key = os.getenv("SESSIONKEY")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,   # Prevent JavaScript access
    SESSION_COOKIE_SECURE=True,     # Allow only over HTTPS
    SESSION_COOKIE_SAMESITE="None", # Allow cross-origin requests
)

@app.route('/api/index', methods=['GET'])
def index():
   
    if "username" in session:
        
        return jsonify(message='Hello World', logged=True) , 200
    
    else: 
      
        return jsonify(error='Unauthorized!', logged=False) , 401
    
@app.route('/api/otpregister', methods=['POST'])
def otpregister():
    try: 
        if "username" in session:
            return jsonify(logged=True) , 200
        
        data = request.get_json()
        reqfields = [
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}
        ]
        validatedata = CheckRegisterForm(data , reqfields)
      
        if  validatedata["error"]:
            return jsonify(error=validatedata["message"]), validatedata["status_code"]
        
        checkotpdata = database.ExecuteQuery("SELECT * FROM otps WHERE email = %s" , (data.get("email").strip() , ))

        
        if len(checkotpdata) == 0:

           otp = GenerateOTP(6)
           mailsend =  SendMail(data.get("email") , "Register otp" , f"Your otp for account registration is {otp}" )

           if not mailsend:
               return jsonify(error= "An error occured!"), 400
           
           database.ExecuteQuery("INSERT INTO otps (email , times , otp , time) VALUES (%s , %s , %s , %s)" , (data.get("email") , 1 , otp, GetTime()))
        
        elif checkotpdata[0]["times"] < 3 and  checkotpdata[0]["times"] >=1:
            otp = checkotpdata[0]["otp"]
            mailsend =  SendMail(data.get("email") , "Register otp" , f"Your otp for account registration is {otp}" )
            times = checkotpdata[0]["times"]

            if not mailsend:
                return jsonify(error= "An error occured!"), 400
            
            database.ExecuteQuery("UPDATE  otps SET times=%s WHERE email = %s" , (times + 1, checkotpdata[0]["email"] ,))
            
        else:
            return  jsonify(error="Max otp sent!") , 400

        
        return jsonify(message="Registration otp sent!", success=True), 200

    except Exception as e:
        print(e)
        return jsonify(error= "Internal server error!"), 500

@app.route("/api/register" , methods=["POST"])
def registeruser(): 
    try: 
        if "username" in session:
            return jsonify(logged=True) , 200
        
        data = request.get_json()
       
        reqfields = [
            {"name": "otp", "value": "otp"},
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}
        ]
        validatedata = CheckRegisterForm(data , reqfields)
      
        if  validatedata["error"]:
            return jsonify(error=validatedata["message"]), validatedata["status_code"]


        checkotp = database.ExecuteQuery("SELECT * FROM  otps WHERE email = %s" , (data.get("email") , ))
        if len(checkotp) == 0:
            return jsonify(error="An error occured!"), 400

        dbotp = checkotp[0]["otp"]
        if dbotp != int(data.get("otp").strip()):
            return jsonify(error="Invalid otp!"), 400
        
        hashpwd = HashPassword(data.get("password").strip())

        createuser = database.ExecuteQuery("INSERT INTO registers (email , username, password , name) VALUES (%s , %s , %s ,%s)" , (data.get("email").strip() , data.get("username").strip() , hashpwd , data.get("name").strip() , ))

        database.ExecuteQuery("DELETE FROM otps WHERE email = %s" , (data.get("email"), ))


        if createuser != 1:
            return jsonify(error="An error occured!"), 400
        
        session["username"] = data.get("email").strip()

        return jsonify(message="Registration successful!"), 200

    except Exception as e:
        print(e)
        return jsonify(error= "Internal server error!"), 500

@app.route("/api/login", methods=['POST'])
def login():
    try: 
        if 'username' in session:
            return jsonify(logged=True) , 200

        data = request.get_json()

        req_fields = [

            {"name" : "uemail" ,  "value" : "Email or Username"},
            {"name" : "password" ,  "value" : "Password"}
        ]
        fieldscheck = CheckFields(req_fields , data)
        if fieldscheck["error"]:
                return jsonify(error=fieldscheck["message"] , login=False), 400
        checkuser = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s OR username = %s" ,(data.get("uemail").strip(), data.get("uemail").strip() , ))
        
       
        if len(checkuser) == 0:
            
            return jsonify(error='Invalid credentials!' , login=False), 400
        
        pwdhashed = checkuser[0]["password"]
        isuser = VerifyPassword(data.get("password") , pwdhashed)

        if not isuser: 
            return jsonify(error='Invalid credentials!' , login=False), 400
        
        session["username"] = checkuser[0]["username"]
     
        return jsonify(message='Logged in!' , login=True), 200
    
    except Exception as e:
        print(e)
        return jsonify(error='An error occured' , login=False), 500

@app.route('/api/check')
def check_session():
    if 'username' in session:
        
        return jsonify(user=session['username'], login=True), 200
    return jsonify(login=False), 401

@app.route("/api/logout" , methods=["GET"])
def logout():

    try:

        session.pop('username', None)
        return jsonify(logout=True) , 200
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error") , 500

@app.route("/api/resendotp" , methods=["POST"])
def resendotp():
    try: 
        if 'username' in session:
            return jsonify(logged=True) , 200
         
        data = request.get_json()
        reqfields = [
            
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}

        ]
        validatedata = CheckRegisterForm(data , reqfields)
      
        if  validatedata["error"]:
            return jsonify(error=validatedata["message"]), validatedata["status_code"]
        
        finduser = database.ExecuteQuery("SELECT * FROM otps where email = %s" , (data.get("email"),))
        if len(finduser) == 0:
            return jsonify(error="An error occured!"), 400
        elif finduser[0]["times"] ==3 :
            return jsonify(error="Max otp sent!"), 400
        else:
            SendMail(data.get("email") , "Register otp verification!" , f"{finduser[0]["otp"]}")
            database.ExecuteQuery("UPDATE otps set times = %s WHERE email = %s" , (finduser[0]["times"] + 1, finduser[0]["email"]))

        return jsonify(message="otp sent!"), 200
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/forgotpassword" , methods=["POST"])
def forgotpass():
    try:
        if "username" in session: 
            return jsonify(logged=True) , 200
        
        data = request.get_json()
        reqfields = [
            {"name": "uemail", "value": "All fields are required!"}
        ]
        fieldscheck = CheckFields(reqfields, data)
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400

        checkuser = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s OR username = %s", (data.get("uemail").strip(),data.get("uemail").strip(),))

        if len(checkuser) == 0:
            return jsonify(error="Email or Username not found!"), 400

        checkotpdata = database.ExecuteQuery("SELECT * FROM passreset WHERE email = %s", (checkuser[0]["email"],))
        if len(checkotpdata) == 0:
            jwt_token = Generatejwt()


            mailsend = SendMail(checkuser[0]["email"] , "Your password reset link!", f"Your password reset link is: {os.getenv('CLIENTLOCALURL')}/resetpass?token={jwt_token}")

            if mailsend:
                 database.ExecuteQuery("INSERT INTO passreset (email , times, token , timing) VALUES (%s, %s, %s, %s)", (checkuser[0]["email"] , 1 , jwt_token, GetTime() ,))
            else:
                return jsonify(error="An error occured!"), 400
        
        elif checkotpdata[0]["times"] == 3:
            return jsonify(error="Max password reset links sent!"), 400

        else:
            jwt_token = f"{os.getenv("CLIENTLOCALURL")}/resetpass?token={checkotpdata[0]['token']}"
            mailsend = SendMail(checkuser[0]["email"], "Your password reset link!", f"Your password reset link is: {jwt_token}")
            if mailsend:
                database.ExecuteQuery("UPDATE passreset SET times=%s WHERE email=%s" , (checkotpdata[0]["times"] + 1 , checkuser[0]["email"] , ))

            else:
                return jsonify(error="An error occured!"), 400
        return jsonify(message="OTP sent!",  email=checkuser[0]["email"]), 200

    except Exception:
        return jsonify(error="Internal server error!"), 500

@app.route("/api/validatetoken", methods=["POST"])
def validate_token():
    try:

        if 'username' in session:
            return jsonify(login=True) , 200
        
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify(error="Token is required!"), 400

        checkifexists = database.ExecuteQuery("SELECT * FROM passreset where token = %s" , (token , ))

        if len(checkifexists) == 0:
            return jsonify(error="An error occured!") , 400
        return jsonify(message="Token found!"), 200
    
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/resetpassword", methods=["POST"])
def resetpassword():
    try:
        if "username" in session:
            return jsonify(logged=True) , 200
        
        data = request.get_json()
        reqfields = [
            {"name": "token", "value": "Token"},
            {"name": "password", "value": "Password"},
            {"name": "cpass", "value": "Confirm Password"}
        ]
        fieldscheck = CheckFields(reqfields, data)
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400

        if data.get("password") != data.get("cpass"):
            return jsonify(error="Passwords do not match!"), 400
       
        checkifexists = database.ExecuteQuery("SELECT * FROM passreset WHERE token = %s", (data.get("token"),))
        
        if len(checkifexists) == 0:
            return jsonify(error="Invalid or expired token!"), 400

        email = checkifexists[0]["email"]
       
        getuser = database.ExecuteQuery("SELECT * FROM registers WHERE email =%s" , (email, ))
        if len(getuser) == 0:
            return jsonify(error="An error occured!"), 400
        
        checkpass = CheckPassword(data.get("password") , getuser[0]["username"] , email )
        
        if  not checkpass["valid"]:
            return jsonify(error=checkpass["error"]), 400
     
        hashpwd = HashPassword(data.get("password").strip())
        updateuser = database.ExecuteQuery("UPDATE registers SET password = %s WHERE email = %s", (hashpwd, email))

        if updateuser != 1:
            return jsonify(error="An error occurred!"), 400

        database.ExecuteQuery("DELETE FROM passreset WHERE email = %s", (email,))
        return jsonify(message="Password reset successful!"), 200

    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!"), 500

Deleteotps()

app.run(debug=True , port=8000 , host="0.0.0.0")