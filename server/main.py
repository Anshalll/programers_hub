from flask import Flask, jsonify , request
from  flask_cors import CORS
from db import database
from  functions.CheckRequiredFields import CheckFields ,  ValidateEmail


app = Flask(__name__)
CORS(app , origins=["http://localhost:5173", "http://127.0.0.1:5173"])
database.get_connection()

@app.route('/', methods=['GET'])
def index():
    
    return jsonify(message='Hello World')

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
        isValidEmail = ValidateEmail(data.get("email"))
        
        if not isValidEmail:
            return jsonify(error="Invalid email"), 400
        
        if fieldscheck["error"]:
            return jsonify(error=fieldscheck["message"]), 400

        checkemail = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s" , (data.get("email"), ))

        if len(checkemail) > 0:
             return jsonify(error="This email is taken!") , 400
 
        checkusername = database.ExecuteQuery("SELECT * FROM registers WHERE username = %s" , (data.get("username"), ))
           
        if len(checkusername) > 0: 
            return jsonify(error="Username is taken!"), 400   
           
        createuser = database.ExecuteQuery("INSERT INTO registers (email , name , username , password ) VALUES (%s, %s , %s , %s)" , (data.get("email"), data.get("name"), data.get("username"), data.get("password"), ))
        
        if createuser != 1:
            return jsonify(error= "Internal server error!"), 500
        
        return jsonify(message="Account created!"), 200
    
    except Exception as e:
        print(e)
        return jsonify(error= "Internal server error!"), 500
    
@app.route("/login", methods=['POST'])
def login():
    return jsonify(message='Login route')

app.run(debug=True , port=8000 )
