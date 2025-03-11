from flask import Flask, jsonify , request , session , redirect
from  flask_cors import CORS
from db import database
from  functions.CheckRequiredFields import CheckFields ,  ValidateEmail
from functions.PasswordWorks import HashPassword , VerifyPassword
import os

app = Flask(__name__)
CORS(app , origins=["http://localhost:5173", "http://127.0.0.1:5173"])
database.get_connection()
app.secret_key = os.getenv("SESSIONKEY")


@app.route('/api/index', methods=['GET'])
def index():
    if 'username' in session:

        return jsonify(message='Hello World') , 200
    else: 
        return jsonify(error='Unauthorized!') , 401
    
@app.route('/api/register', methods=['POST'])

def register():
    try: 
         
        data = request.get_json()
     
        reqfields = [
            {"name" : "name" , "value": "Name"},
            {"name" : "email" , "value": "Email"},
            {"name" : "username" , "value": "Username"},
            {"name" : "password" , "value": "Password"},
            {"name" : "confirmpassword" , "value": "Confirm Password"}
        ]
        fieldscheck = CheckFields(reqfields , data)
   
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400
        

        isValidEmail = ValidateEmail(data.get("email"))
    
        if not isValidEmail:
            return jsonify(error="Invalid email"), 400
        

        if data.get("password").strip() != data.get("confirmpassword").strip():
            return jsonify(error="Confirm password does not match!"), 400

        checkemail = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s" , (data.get("email"), ))


        if len(checkemail) > 0:
             return jsonify(error="This email is taken!") , 400
    
        checkusername = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (data.get("username"), ))
           
        if len(checkusername) > 0: 
            return jsonify(error="Username is taken!"), 400   
        
        hash_password = HashPassword(data.get("password").strip())

        createuser = database.ExecuteQuery("INSERT INTO registers (email , name , username , password ) VALUES (%s, %s , %s , %s)" , (data.get("email").strip(), data.get("name").strip(), data.get("username").strip(), hash_password, ))
        
        if createuser != 1:
            return jsonify(error= "Internal server error!"), 500
        
        return jsonify(message="Account created!"), 200
    
    except Exception as e:
        print(e)
        return jsonify(error= "Internal server error!"), 500
    
@app.route("/api/login", methods=['POST'])
def login():
    try: 
        if 'username' in session:
            return jsonify(login=True) , 200

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

        return jsonify(message='Login route' , login=True), 200
    
    except Exception as e:
        print(e)
        return jsonify(error='An error occured' , login=False), 500


@app.route("/api/logout" , methods=["GET"])
def logout():

    try:

        session.pop('username', None)
        return jsonify(logout=True) , 200
    except Exception as e:
        print(e)
        return jsonify(error="Internal server error") , 500
    
app.run(debug=True , port=8000 )