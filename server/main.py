
from flask import Flask, jsonify , request
from  flask_cors import CORS
from db import database



app = Flask(__name__)
CORS(app , origins=["http://localhost:5173", "http://127.0.0.1:5173"])
database.get_connection()

@app.route('/', methods=['GET'])
def index():
    
    return jsonify(message='Hello World')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    checkemail = database.ExecuteQuery("SELECT * FROM registers WHERE email = %s" , (data.email))
    return jsonify({"message": "This is working"}), 200

@app.route("/login", methods=['POST'])
def login():
    return jsonify(message='Login route')

app.run(debug=True , port=8000 )
