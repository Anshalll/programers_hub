from flask import Flask, jsonify , request , session , send_from_directory
from  flask_cors import CORS
from db.db import database
from  functions.CheckRequiredFields import CheckFields
from functions.PasswordWorks import VerifyPassword , HashPassword , CheckPassword
from functions.GenerateVals import GenerateOTP , GenerateUsername , GeneratePostToken
from functions.SendMail import SendMail
from functions.CheckForms import CheckRegisterForm
from functions.GetTime import GetTime , GetMonthdate
from functions.Deleteotps import Deleteotps
from  functions.jwtstring import Generatejwt
from functions.VerifyHcaptcha import Verifyhcaptcha
import os
import requests
from functions.CreateProfile import createProfile


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
        
        query = """
        SELECT p.* , r.id , r.username, r.email , r.name  from profile p
        join registers r on r.id = p.id 
        where username = %s
        
      """
        userdata = database.ExecuteQuery(query , (session["username"], ))
        userposts = database.ExecuteQuery(
            "SELECT p.* , lp.uid AS hasliked , lp.pid FROM posts p LEFT JOIN post_likes lp on lp.uid = p.belongsto where belongsto = %s",
            (userdata[0]["id"],)
        )
        userdata.append(userposts)
        if len(userdata) == 0:
            return jsonify(error="An error ocuured"), 400
             
        return jsonify(data=userdata, logged=True) , 200
    
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
            print(session["username"])
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
        if "username" not in session:
            return jsonify(logged=False), 401
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
            (data.get("socialmedialinks", "").strip(), 
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
        if "username" not in session:
            return jsonify(logged=False), 401
    
        data = request.get_json()
        search_term = data.get("search")
        if not search_term:
            return jsonify(error="Search term is required!"), 400

    
        query = """
            SELECT p.*, r.username, r.name 
            FROM profile p 
            JOIN registers r ON p.id = r.id 
            WHERE r.username LIKE %s
        """
        users = database.ExecuteQuery(query, (f"{search_term}%",))
        database.close_cursor()
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

@app.route("/api/getuser" , methods=["POST"])
def getuser():
    try:
       
        if "username" not in session:
            return jsonify(logged=False), 401
        data = request.get_json()
        username = data.get("username")
    
        if  username.strip() == "":
            return jsonify(error="Username is required!"), 400

        query = """
        SELECT p.* , r.id , r.username, r.email , r.name  from profile p
        join registers r on r.id = p.id 
        where username = %s
        
      """
        
        currentuser = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (session["username"] , ))
        if len(currentuser) == 0:
            return jsonify(error="An error occurred!"), 400
        userdata = database.ExecuteQuery(query , (username, ))
       
        userposts = database.ExecuteQuery("SELECT p.*, lp.pid , lp.uid AS hasliked FROM posts p LEFT JOIN post_likes lp on lp.uid = %s WHERE p.belongsto = %s" , (currentuser[0]["id"] , userdata[0]["id"]))
        userdata.append(userposts)
        if len(userdata) == 0:
            return jsonify(error="An error ocuured"), 400

        database.close_cursor()

        return jsonify(data=userdata ), 200
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/deleteimage", methods=["POST"])
def delete_images():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        image_type = data.get("type")

        if image_type not in ["dp", "bg"]:
            return jsonify(error="Invalid image type! Must be 'dp' or 'bg'."), 400

        username = session["username"]

        query = "SELECT r.id,  p.dp, p.bg FROM profile p JOIN registers r ON p.id = r.id WHERE r.username = %s"
        user_data = database.ExecuteQuery(query, (username,))
     
        if len(user_data) == 0:
            return jsonify(error="User not found!"), 404

        if image_type == "dp" and user_data[0]["dp"] != "defaultdp.jpg":
            dp_path = os.path.join(os.getcwd(), "static/uploads/dp", user_data[0]["dp"])
            if os.path.exists(dp_path):
                os.remove(dp_path)
            database.ExecuteQuery("UPDATE profile SET dp = %s WHERE id = %s", ("defaultdp.jpg", user_data[0]["id"]))
        elif image_type == "bg" and user_data[0]["bg"] != "defaultbg.jpg":
            bg_path = os.path.join(os.getcwd(), "static/uploads/bg", user_data[0]["bg"])
            if os.path.exists(bg_path):
                os.remove(bg_path)
            database.ExecuteQuery("UPDATE profile SET bg = %s WHERE id = %s", ("defaultbg.jpg", user_data[0]["id"]))

        return jsonify(message=f"{image_type.upper()} image deleted successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/uploadpost", methods=["POST"])
def uploadpost():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.files.get("post")
        description = request.form.get("description", "").strip()
        hide_like_count = request.form.get("hide_like_count", "false").lower() == "true"
        hide_comment = request.form.get("allow_comments", "true").lower() == "true"
        getuser = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (session["username"] , ))

        if len(getuser) == 0:
            return jsonify(error="Internal server error") , 500

        if data:
            ALLOWED_EXTENTIONS = {".jpg", ".jpeg", ".png", ".gif"}
            if os.path.splitext(data.filename)[1] not in ALLOWED_EXTENTIONS:
                return jsonify(error="Invalid file type for post!"), 400

            while True:
                generaterandvals = GenerateOTP(30)
                new_filename = f"{generaterandvals}{os.path.splitext(data.filename)[1]}"
                check_existing = database.ExecuteQuery("SELECT * FROM posts WHERE filename = %s", (new_filename,))
                if len(check_existing) == 0:
                    break

            data.save(os.path.abspath(os.path.join(os.getcwd(), "static/uploads/post", new_filename)))
            token = GeneratePostToken(20)
            database.ExecuteQuery(
                "INSERT INTO posts (filename, belongsto, description, hidelikecount, allowcomments , likes, shares , uniqueid , dateposted) VALUES (%s, %s, %s, %s, %s, %s, %s , %s , %s)",
                (new_filename, getuser[0]["id"], description, hide_like_count, hide_comment ,   0 , 0 , token , GetMonthdate() , )
            )

            return jsonify(message="Post uploaded!", success=True), 200

        else:
            return jsonify(error="No post uploaded!"), 400

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error"), 500

@app.route("/api/deletepost", methods=["DELETE"])
def delete_post():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        unique_id = data.get("uniqueid")
        
        if not unique_id:
            return jsonify(error="Unique ID is required!"), 400

       
        query = "SELECT * FROM posts WHERE uniqueid = %s"
        post_data = database.ExecuteQuery(query, (unique_id,))

        if len(post_data) == 0:
            return jsonify(error="Post not found!"), 404

     
        getuser = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
        if len(getuser) == 0 or post_data[0]["belongsto"] != getuser[0]["id"]:
            return jsonify(error="Unauthorized action!"), 403

     
        post_path = os.path.join(os.getcwd(), "static/uploads/post", post_data[0]["filename"])
        if os.path.exists(post_path):
            os.remove(post_path)

     
        database.ExecuteQuery("DELETE FROM posts WHERE uniqueid = %s", (unique_id,))

        return jsonify(message="Post deleted successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/updatepost", methods=["PATCH"])
def update_post():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        unique_id = data.get("uniqueid")
        description = data.get("description", "").strip()
        hide_like_count = data.get("hide_like_count", "false").lower() == "true"
        allow_comments = data.get("allow_comments", "true").lower() == "true"

        if not unique_id:
            return jsonify(error="Unique ID is required!"), 400

        query = "SELECT * FROM posts WHERE uniqueid = %s"
        post_data = database.ExecuteQuery(query, (unique_id,))

        if len(post_data) == 0:
            return jsonify(error="Post not found!"), 404

        getuser = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
        if len(getuser) == 0 or post_data[0]["belongsto"] != getuser[0]["id"]:
            return jsonify(error="Unauthorized action!"), 403

        database.ExecuteQuery(
            "UPDATE posts SET description = %s, hidelikecount = %s, allowcomments = %s WHERE uniqueid = %s",
            (description, hide_like_count, allow_comments, unique_id , )
        )

        return jsonify(message="Post updated successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/comments" , methods=["POST" , "DELETE"])
def comments():
    try: 

        if "username" not in session:
            return jsonify(logged=False) , 200
        
        data = request.get_json()
        postid = data.get("postid" , None)
       
        if postid is  None:
            return jsonify(error="An error occured!") , 400
        getpost = database.ExecuteQuery("SELECT * FROM posts where uniqueid = %s" , (postid , ))


        getuser = database.ExecuteQuery("SELECT * FROM registers where username = %s" , (session["username"],))
        if len(getpost) == 0:
            return jsonify(error="An error occured!") , 400
        
        if request.method == "POST":
            comment = data.get("comment")
            if comment.strip() == "":
                 return jsonify(error="An error occured!") , 400
            
            genval = GeneratePostToken(20)
            createComment = database.ExecuteQuery("INSERT INTO comments (uid , belongsto , likes, message , uniqueid , postedon) VALUES (%s , %s, %s , %s , %s , %s)" , (getuser[0]["id"] , getpost[0]["uniqueid"] , 0 , comment , genval , GetMonthdate()))
            if createComment != 1:
                return jsonify(error="Internal server error!"), 500


            last_insert = database.ExecuteQuery("SELECT  c.*, r.username, p.dp FROM comments c INNER JOIN registers r on r.id = c.uid INNER JOIN profile p on p.id = c.uid WHERE c.id =  LAST_INSERT_ID()  AND uniqueid=%s " , (genval,))

        
            return jsonify(message="Comment posted!" , comment=last_insert) , 200


        if request.method == "DELETE":
            comment_id = data.get("commentid")
            userid = data.get("userid")
           
            if comment_id is None or userid is None:
                return jsonify(error="An error occurred!"), 400
            
            getcomment = database.ExecuteQuery("SELECT * FROM comments WHERE uniqueid = %s " , (comment_id ,  ))
          
            if len(getcomment) == 0:
                return jsonify(error="An error occurred!"), 400
           
            if userid == getuser[0]["id"] and getpost[0]["belongsto"] == getuser[0]["id"]:
                
                database.ExecuteQuery("DELETE FROM comments WHERE uniqueid = %s " , (comment_id , ))

                return jsonify(message="Comment deleted!" , success=True) , 200
            
            elif userid == getcomment[0]["uid"]:
                
                database.ExecuteQuery("DELETE FROM comments WHERE uniqueid = %s " , (comment_id , ))
                return jsonify(message="Comment deleted!" , success=True) , 200
            
            else:
                return jsonify(error="Unauthorized action!"), 403



    except Exception as e:
        return jsonify(error="Internal server error!"), 500


@app.route("/api/getcomments/<postid>/" , methods=["GET"])
def get_comments(postid):
    try:
        if "username" not in session:
            return jsonify(logged=False) , 400
        
        data = postid
        user = database.ExecuteQuery("SELECT * FROM registers where username = %s" , (session["username"] ,))

        getpost = database.ExecuteQuery("SELECT * FROM posts WHERE uniqueid = %s", (data,))
        if len(getpost) == 0:
            return jsonify(error="Post not found!"), 404
        if data: 
            comments = database.ExecuteQuery(f"SELECT  c.*, r.username , r.id, p.dp , l.likedby , l.commentid FROM comments c INNER JOIN registers r on r.id = c.uid LEFT JOIN profile p on p.id = c.uid LEFT JOIN comment_likes l on l.commentid = c.uniqueid AND l.likedby = %s  WHERE belongsto = %s ORDER BY c.pinned DESC , c.id DESC " , (user[0]["id"] ,  data,))


            replies = database.ExecuteQuery("SELECT  cr.* , p.id AS profileid , p.dp , r.username AS whoReplied , r.id , crl.belongsto AS commentreplylikepid , crl.likedby AS hasliked FROM comment_replies cr INNER JOIN registers r on r.username = cr.username LEFT JOIN profile p on p.id = r.id  LEFT JOIN comment_replylikes crl on crl.likedby = %s  AND crl.belongsto = cr.uniqueid   WHERE cr.pid = %s ORDER BY cr.id  ASC" , (user[0]["id"] , data, ))
        
            return jsonify(comments=comments , replies=replies), 200
        
        else:
            jsonify(error="Post id is required!"), 400
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/likecomment", methods=["POST"])
def like_comment():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        comment_id = data.get("id")
        action = data.get("action")

        if  not comment_id or not action:
            return jsonify(error="Type, Comment ID, and Action are required!"), 400

       

        if action not in ["like", "unlike"]:
            return jsonify(error="Invalid action! Must be 'like' or 'unlike'."), 400

       
        query = "SELECT * FROM comments WHERE uniqueid = %s"
        comment_data = database.ExecuteQuery(query, (comment_id,))
    
        if len(comment_data) == 0:
            return jsonify(error="Comment not found!"), 404
        user = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (session["username"] , ))

        if action == "like":
            update_query = f"UPDATE comments SET likes = likes + 1 WHERE uniqueid = %s"
            database.ExecuteQuery(update_query, (comment_id,))
            checkLiked = database.ExecuteQuery(
                "SELECT * FROM comment_likes WHERE likedby = %s AND commentid = %s",
                (user[0]["id"], comment_id)
            )
            if len(checkLiked) == 0:
                database.ExecuteQuery(
                    "INSERT INTO comment_likes (likedby, commentid) VALUES (%s, %s)",
                    (user[0]["id"], comment_id)
                )
        elif action == "unlike":
            update_query = f"UPDATE comments SET likes = likes - 1 WHERE uniqueid = %s AND likes > 0"
            database.ExecuteQuery(update_query, (comment_id,))
            database.ExecuteQuery(
                "DELETE FROM comment_likes WHERE likedby = %s AND commentid = %s",
                (user[0]["id"], comment_id)
            )

        return jsonify(message="Comment {action} successfull!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500


@app.route("/api/pincomment", methods=["POST"])
def pin_comment():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        comment_id = data.get("commentid")
        action = data.get("action")
        postid = data.get("postid")
       

        if not comment_id or not action:
            return jsonify(error="Comment ID and Action are required!"), 400

        if action not in ["pin", "unpin"]:
            return jsonify(error="Invalid action! Must be 'pin' or 'unpin'."), 400

        user = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
        if len(user) == 0:
            return jsonify(error="An error occurred!"), 400
        
        getpost = database.ExecuteQuery("SELECT * FROM posts WHERE uniqueid = %s", (postid,))

        if len(getpost) == 0:
            return jsonify(error="An error occurred!"), 400

        if action == "pin" and user[0]["id"] == getpost[0]["belongsto"]:
            database.ExecuteQuery(
                "UPDATE comments SET pinned = 1 WHERE uniqueid = %s ",
                (comment_id, )
            )
        
        elif action == "unpin" and user[0]["id"] == getpost[0]["belongsto"]:
            database.ExecuteQuery(
                "UPDATE comments SET pinned = 0 WHERE uniqueid = %s",
                (comment_id,)
            )
        else:
            return jsonify(error="Unauthorized action!"), 403
        

        return jsonify(message=f"Comment {action}ned successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

@app.route("/api/likepost" , methods=["POST"])
def like_post():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        post_id = data.get("postid")
        action = data.get("action")

        if not post_id or not action:
            return jsonify(error="Post ID and Action are required!"), 400

        if action not in ["like", "unlike"]:
            return jsonify(error="Invalid action! Must be 'like' or 'unlike'."), 400

        user = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
        if len(user) == 0:
            return jsonify(error="An error occurred!"), 400

        getpost = database.ExecuteQuery("SELECT * FROM posts WHERE uniqueid = %s", (post_id,))

        if len(getpost) == 0:
            return jsonify(error="An error occurred!"), 400
        checkLiked = database.ExecuteQuery(
                "SELECT * FROM post_likes WHERE uid = %s AND pid = %s",
                (user[0]["id"], post_id)
        )
        if action == "like":
            
            if len(checkLiked) == 0:
                
                database.ExecuteQuery(
                    "UPDATE posts SET likes = likes + 1 WHERE uniqueid = %s",
                    (post_id,)
                )
            database.ExecuteQuery(
                "INSERT INTO post_likes (uid, pid) VALUES (%s, %s)",
                (user[0]["id"], post_id)
            )
        
        elif action == "unlike":

            if len(checkLiked) > 0:
                
                database.ExecuteQuery(
                    "UPDATE posts SET likes = likes - 1 WHERE uniqueid = %s AND likes > 0",
                    (post_id,)
                )
        
       
                database.ExecuteQuery(
                    "DELETE FROM post_likes WHERE uid = %s AND pid = %s",
                    (user[0]["id"], post_id)
                )

        return jsonify(message=f"Post {action}d successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500
Deleteotps()

@app.route("/api/reply" , methods=["POST"])
def reply_comment():
    try:
        if "username" not in session: 
            return jsonify(logged=False) , 401
        data =  request.get_json()
        pid = data.get("pid", None)
        mentioneduser = data.get("mentioneduser" , None)
        message = data.get("message" , None)
        cid= data.get("cid" , None)

        if not all([pid, mentioneduser, message, cid]):
            return jsonify(error="All fields (pid, user, message, cid) are required!"), 400

        check_pid = database.ExecuteQuery("SELECT * FROM posts WHERE uniqueid = %s", (pid,))
        if len(check_pid) == 0:
            return jsonify(error="Post not found!"), 404

        check_cid = database.ExecuteQuery("SELECT * FROM comments WHERE uniqueid = %s", (cid,))
        if len(check_cid) == 0:
            return jsonify(error="Comment not found!"), 404

        check_user = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (mentioneduser,))
        if len(check_user) == 0:
            return jsonify(error="User not found!"), 404

        
        reply_id = GeneratePostToken(20)
        database.ExecuteQuery(
            "INSERT INTO comment_replies (mentioneduser, cid, message, uniqueid, postedon , pid , username) VALUES (%s, %s, %s, %s, %s , %s , %s" \
            ")",
            (mentioneduser, cid, message.strip(), reply_id, GetMonthdate() , pid , session["username"])
        )

        lastquerycheck = "SELECT  cr.* , p.id AS profileid , p.dp , r.username AS whoReplied , r.id , crl.belongsto AS commentreplylikepid , crl.likedby AS hasliked FROM comment_replies cr INNER JOIN registers r on r.username = cr.username LEFT JOIN profile p on p.id = r.id  LEFT JOIN comment_replylikes crl on crl.likedby = %s  AND crl.belongsto = cr.uniqueid   WHERE cr.id = LAST_INSERT_ID() AND cr.pid = %s "

        last_insert = database.ExecuteQuery(lastquerycheck , (check_user[0]["id"], pid, ))
        return jsonify(data = "Replied!" , replies=last_insert) , 200
        

    except  Exception as e:
        print(e)
        return jsonify(erro="Internal server error!"), 500


@app.route("/api/deletereply" , methods=["DELETE"])
def del_reply():
    try:
        

        if "username" not in session :
            return jsonify(logged=False) , 403
        
        data = request.get_json()
        replyid = data.get("replyid")
        replypid = data.get("replypid")

        if replyid == None or replypid == None:
             return jsonify(error="An error occured!") , 400
        
        user  = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (session["username"],))


        if len(user) == 0:
            return jsonify(error="An error occured") , 400
        
        check_reply = database.ExecuteQuery("SELECT * FROM comment_replies WHERE uniqueid = %s AND pid = %s" , (replyid ,replypid ,  ))
       
        if len(check_reply) == 0:
                return jsonify(error="An error occured!") , 400

        if  check_reply[0]["username"] == session["username"]:
            database.ExecuteQuery("DELETE FROM comment_replies WHERE id = %s" , (check_reply[0]["id"],))

            return jsonify(data="Reply deleted!"), 200
    
        else:
            get_user_posts = database.ExecuteQuery("SELECT * FROM posts WHERE uniqueid = %s" , (replypid , ))
            if len(get_user_posts) == 0:
                return jsonify(error="An error occured!") , 400
            
            if get_user_posts[0]["belongsto"] == user[0]["id"]:

                database.ExecuteQuery("DELETE FROM comment_replies WHERE id = %s" , (check_reply[0]["id"],))

                return jsonify(data="Reply deleted!"), 200
            else:

                return jsonify(error="Unauthorized action!") , 403

       
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error!") , 500

@app.route("/api/likereply", methods=["POST"])
def like_reply():
    try:
        if "username" not in session:
            return jsonify(logged=False), 401

        data = request.get_json()
        reply_id = data.get("replyid")
        action = data.get("action")
        

        if not reply_id or not action:
            return jsonify(error="Reply ID and Action are required!"), 400

        if action not in ["like", "unlike"]:
            return jsonify(error="Invalid action! Must be 'like' or 'unlike'."), 400

        user = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s", (session["username"],))
        if len(user) == 0:
            return jsonify(error="An error occurred!"), 400

        query = "SELECT * FROM comment_replies WHERE uniqueid = %s"
        reply_data = database.ExecuteQuery(query, (reply_id,))

        if len(reply_data) == 0:
            return jsonify(error="Reply not found!"), 404

        checkLiked = database.ExecuteQuery(
                    "SELECT * FROM comment_replylikes WHERE likedby = %s AND belongsto = %s",
                    (user[0]["id"], reply_id)
                )

        if action == "like":
            if len(checkLiked) == 0:
                database.ExecuteQuery(
                            "UPDATE comment_replies SET likes = likes + 1 WHERE uniqueid = %s",
                            (reply_id,)
                        )
                database.ExecuteQuery(
                            "INSERT INTO comment_replylikes (likedby,   belongsto) VALUES (%s, %s )",
                            (user[0]["id"],  reply_id )
                        )
        elif action == "unlike":
                if len(checkLiked) > 0:
                    database.ExecuteQuery(
                            "UPDATE comment_replies SET likes = likes - 1 WHERE uniqueid = %s AND likes > 0",
                            (reply_id,)
                        )
                    database.ExecuteQuery(
                            "DELETE FROM comment_replylikes WHERE likedby = %s AND belongsto = %s",
                            (user[0]["id"], reply_id)
                        )

        return jsonify(message=f"Reply {action}d successfully!", success=True), 200

    except Exception as e:
        print("Error:", e)
        return jsonify(error="Internal server error!"), 500

app.run(debug=True , port=8000 , host="0.0.0.0")