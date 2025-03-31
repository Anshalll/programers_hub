from flask import Flask, jsonify , request , session , send_from_directory
from  flask_cors import CORS
from db.db import database
from  functions.CheckRequiredFields import CheckFields
from functions.PasswordWorks import VerifyPassword , HashPassword , CheckPassword
from functions.GenerateVals import GenerateOTP , GenerateUsername
from functions.SendMail import SendMail
from functions.CheckForms import CheckRegisterForm
from functions.GetTime import GetTime
from functions.Deleteotps import Deleteotps
from  functions.jwtstring import Generatejwt
from functions.VerifyHcaptcha import Verifyhcaptcha
import os
import requests
from functions.CreateProfile import createProfile
import json

app = Flask(__name__)
CORS(app , supports_credentials=True,   origins=[os.getenv("CLIENTURL") , "http://localhost:5173" , "http://127.0.0.1:5173"])

database.get_connection()
app.secret_key = os.getenv("SESSIONKEY")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,   # Prevent JavaScript access
    SESSION_COOKIE_SECURE=True,     # Allow only over HTTPS
    SESSION_COOKIE_SAMESITE="None", # Allow cross-origin requests
)

#Auth apis

@app.route('/api/index', methods=['GET'])
def index():
    
    if "username" in session:
        data  = {}
    
   
           
        udata = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (session.get("username") ,))

        if len(udata) > 0 :
            profiledata = database.ExecuteQuery("SELECT * FROM profile where id = %s" , (udata[0]["id"] , ))
            if len(profiledata) == 0:
                return jsonify(error='Internal server error!', logged=False) , 500

            data["profile"] = profiledata[0]
            data["udata"] = udata[0]
             
        return jsonify(data=data, logged=True) , 200
    
    else: 
      
        return jsonify(error='Unauthorized!', logged=False) , 401
    
@app.route('/api/otpregister', methods=['POST'])
def otpregister():
    try: 
        if "username" in session:
            return jsonify(logged=True) , 200
        
        data = request.get_json()
        reqfields = [
            {"name" : "captcha" ,  "value" : "HCaptcha"},
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}
        ]
        validatedata = CheckRegisterForm(data , reqfields)
      
        if  validatedata["error"]:
            return jsonify(error=validatedata["message"]), validatedata["status_code"]
        
        checkcap = Verifyhcaptcha(data.get("captcha"))
        if not checkcap:
            return jsonify(error="Invalid captcha!"), 400
        
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
            {"name" : "captcha" ,  "value" : "HCaptcha"},
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

        checkcap = Verifyhcaptcha(data.get("captcha"))
        if not checkcap:
            return jsonify(error="Invalid captcha!"), 400
        
        checkotp = database.ExecuteQuery("SELECT * FROM  otps WHERE email = %s" , (data.get("email") , ))
        if len(checkotp) == 0:
            return jsonify(error="An error occured!"), 400

        dbotp = checkotp[0]["otp"]
        if dbotp != int(data.get("otp").strip()):
            return jsonify(error="Invalid otp!"), 400
        
        hashpwd = HashPassword(data.get("password").strip())

        createuser = database.ExecuteQuery("INSERT INTO registers (email , username, password , name , type) VALUES (%s , %s , %s ,%s , %s)" , (data.get("email").strip() , data.get("username").strip() , hashpwd , data.get("name").strip() , "manual" ,))

        database.ExecuteQuery("DELETE FROM otps WHERE email = %s" , (data.get("email"), ))


        if createuser != 1:
            return jsonify(error="An error occured!"), 400
        else:
            fetchlast = database.ExecuteQuery("SELECT * FROM registers where id = LAST_INSERT_ID()" , ())

            createProfile(fetchlast[0]["id"])
        
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
            {"name" : "captcha" ,  "value" : "HCaptcha"},
            {"name" : "uemail" ,  "value" : "Email or Username"},
            {"name" : "password" ,  "value" : "Password"}
        ]
        fieldscheck = CheckFields(req_fields , data)
        if fieldscheck["error"]:
                return jsonify(error=fieldscheck["message"] , login=False), 400
        
        verifyhcap = Verifyhcaptcha(data.get("captcha"))
        if not verifyhcap:
            return jsonify(error="Invalid captcha!" , login=False), 400
        
        checkuser = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s OR username = %s" ,(data.get("uemail").strip(), data.get("uemail").strip() , ))
        
       
        if len(checkuser) == 0:
            
            return jsonify(error='Invalid credentials!' , login=False), 400
        
        pwdhashed = checkuser[0]["password"]
        isuser = VerifyPassword(data.get("password") , pwdhashed)

        if not isuser: 
            return jsonify(error='Invalid credentials!' , login=False), 400
        
        session["username"] = checkuser[0]["username"]
        session["type"] = "manual"
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
        session.pop("type" , None)
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
            database.ExecuteQuery("UPDATE otps set times = %s , time = %s WHERE email = %s" , (finduser[0]["times"] + 1, GetTime() ,  finduser[0]["email"]))

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
            {"name" : "captcha" ,  "value" : "HCaptcha"},
            {"name": "uemail", "value": "All fields are required!"}
        ]
        fieldscheck = CheckFields(reqfields, data)
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400
        checkhcap = Verifyhcaptcha(data.get("captcha"))
        if not checkhcap:
            return jsonify(error="Invalid captcha!"), 400
        
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
                database.ExecuteQuery("UPDATE passreset SET times=%s , time = %s,  WHERE email=%s" , (checkotpdata[0]["times"] + 1 , GetTime() ,  checkuser[0]["email"] , ))

            else:
                return jsonify(error="An error occured!"), 400
        return jsonify(message="OTP sent!",  email=checkuser[0]["email"]), 200

    except Exception as e:
        print(e)
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
            {"name": "captcha", "value": "HCaptcha"},
            {"name": "token", "value": "Token"},
            {"name": "password", "value": "Password"},
            {"name": "cpass", "value": "Confirm Password"}
        ]
        fieldscheck = CheckFields(reqfields, data)
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400

        if data.get("password") != data.get("cpass"):
            return jsonify(error="Passwords do not match!"), 400
        checkhcap = Verifyhcaptcha(data.get("captcha"))
        if not checkhcap:
            return jsonify(error="Invalid captcha!"), 400
        
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

@app.route("/api/googleauth" , methods=["POST"])
def authgoogle(): 
    
    try:

        if "username" in  session:
            return jsonify(logged=True) , 200
        
        data = request.get_json()
       
        reqfields = [{
            "name" : "access_token" , "value": "Access token"
        }]
        checkfields = CheckFields(reqfields , data)
        
        if checkfields["error"]:
            return jsonify(error=checkfields["message"]), 400

        
        GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
        access_token = data.get("access_token", "").strip()  # Extract & clean token
        
        if not access_token:
            return jsonify({"error": "Access token is missing"}), 400

        
        uinfo = requests.get(GOOGLE_USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        userinfo_response = uinfo.json()
        check_user = database.ExecuteQuery("SELECT * FROM registers WHERE email=%s" , (userinfo_response["email"],))
        
        if len(check_user) > 0:
            session["username"] = check_user[0]["username"]
            session["type"] = "google"
            return jsonify(logged=True) , 200
            
        else:
            username = GenerateUsername(userinfo_response["given_name"].strip())
            checkuname = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (username,))
            while True:
                if len(checkuname) > 0:
                    username = GenerateUsername()
                else:
            
                    break
            

            createuser = database.ExecuteQuery("INSERT INTO registers (email , username , name , type) VALUES (%s , %s , %s , %s)" , (userinfo_response["email"] , username, userinfo_response["name"]  , "google",))

            session["username"] = username
            session["type"] = "google"
            if createuser != 1:
                return jsonify(error="An error occurred!"), 400   
            else:
                fetchlast = database.ExecuteQuery("SELECT * FROM registers where id = LAST_INSERT_ID()" , ())

                createProfile(fetchlast[0]["id"])

            return jsonify(logged=True) , 200    
          
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error") , 500


#Account apis
@app.route("/api/updateinfo", methods=["POST"])
def updateinfo():
    try: 

        data = request.get_json()
   
        reqfields = [{"name": "username", "value": "Username"}]
        checkfields = CheckFields(reqfields, data)
        if checkfields["error"]:
            return jsonify(error=checkfields["message"]), 400

   
        getuserid = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
     
        if len(getuserid) == 0:
            return jsonify(error="An error occurred!"), 400

     
        update_profile = database.ExecuteQuery(
            "UPDATE profile SET socialmedialinks=%s, bio=%s, location=%s, role=%s WHERE id = %s",
            (json.dumps(data.get("socialmedialinks")), 
             data.get("bio", "").strip(),
             data.get("location", "").strip(),
             data.get("role", "").strip(),
             getuserid[0]["id"])
        )
    
        if session["username"] != data.get("username", "").strip():

            checkusername = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (data.get("username").strip() , ))
    
            if len(checkusername) > 0:
                return jsonify(error="Username already exists!"), 400

            database.ExecuteQuery(
                "UPDATE registers SET username = %s WHERE id = %s",
                (data.get("username", "").strip(), getuserid[0]["id"],)
            )
           
  
        if "name" in data and data.get("name"):
            database.ExecuteQuery(
                "UPDATE registers SET name = %s WHERE id = %s",
                (data.get("name").strip(), getuserid[0]["id"],)
            )

        if update_profile != 1 and update_profile != 0:
            
            return jsonify(error="An error occurred!"), 400
  

    
        session.pop("username" , None)
        session["username"] = data.get("username", "").strip()

        return jsonify(message="Profile updated!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/searchusers", methods=["POST"])
def search_users():
    try:
        data = request.get_json()
        search_term = data.get("search")
        if not search_term:
            return jsonify(error="Search term is required!"), 400

        # Query to fetch user details
        query = """
            SELECT p.*, r.username, r.name 
            FROM profile p 
            JOIN registers r ON p.id = r.id 
            WHERE r.username LIKE %s
        """
        users = database.ExecuteQuery(query, (f"{search_term}%",))

        return jsonify(users=users, success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/sendstatic/<path:filename>", methods=["GET"])
def send_static(filename):
    try:
        
        return send_from_directory(os.path.join(os.getcwd(), "static/uploads"), filename)
    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500


@app.route("/api/uploadimages", methods=["POST"])
def uploadfiles():
    try:

        def deleteFiles(filepath):
            os.remove(filepath)

        if "username" not in session:
            return jsonify(logged=False), 401

        ALLOWED_EXTENTIONS = {".jpg", ".jpeg", ".png", ".gif"}

        dp = request.files.get("dp")
        bg = request.files.get("bg")

        query = "SELECT p.*, r.username, r.name from profile p JOIN registers r ON p.id = r.id where username = %s "
        getuser = database.ExecuteQuery(query, (session["username"],))
     
        if len(getuser) != 1:
            return jsonify(error="An error occurred!"), 400
        
        if dp:
            if os.path.splitext(dp.filename)[1] not in ALLOWED_EXTENTIONS:
                return jsonify(error="Invalid file type for dp!"), 400
            generaterandvals = GenerateOTP(20)
            dp.save(os.path.join(os.getcwd() , "static/uploads/dp" , f"{generaterandvals}{os.path.splitext(dp.filename)[1]}"))
            if getuser[0]["dp"] != "defaultdp.jpg":
                deleteFiles(os.path.join(os.getcwd() , "static/uploads/dp" , getuser[0]["dp"]))
            database.ExecuteQuery("UPDATE profile SET dp = %s WHERE id = %s", (f"{generaterandvals}{os.path.splitext(dp.filename)[1]}", getuser[0]["id"]))

        if bg:
            if os.path.splitext(bg.filename)[1] not in ALLOWED_EXTENTIONS:
                return jsonify(error="Invalid file type for Background image!"), 400
            generaterandvals = GenerateOTP(20)
            bg.save(os.path.join(os.getcwd() , "static/uploads/bg" , f"{generaterandvals}{os.path.splitext(bg.filename)[1]}"))
            if getuser[0]["bg"] != "defaultbg.jpg":
                deleteFiles(os.path.join(os.getcwd() , "static/uploads/bg" , getuser[0]["bg"]))
            database.ExecuteQuery("UPDATE profile SET bg = %s WHERE id = %s", (f"{generaterandvals}{os.path.splitext(bg.filename)[1]}", getuser[0]["id"]))

        return jsonify(message="Files uploaded successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500


Deleteotps()

app.run(debug=True , port=8000 , host="0.0.0.0")