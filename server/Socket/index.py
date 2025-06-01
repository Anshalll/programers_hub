from flask import request
from functions.GenerateVals import GeneratePostToken
from Redis_config import RedisServer
from db.db import database
class MainSocket:
    def handle_connect(self):
        print(request.sid)
        return {'message': 'Connected to the server'}

    def JoinChat(self, data):
        usera, userb = data["usera"]["name"] , data["userb"]["name"]
   
        if not usera or not userb: 
            return {"error" , "An error occured!"}, 400
        
        get_id_usera = database.ExecuteQuery("SELECT id FROM registers where username = %s" , (usera,))
        if len(get_id_usera) == 0:
            print("Cant not find user a: JoinChat Socket")
            return {"error": 'An error occured'}, 400
        
        get_id_userb = database.ExecuteQuery("SELECT id from registers where username = %s" , (userb,))
        if len(get_id_userb) == 0:
            print("Cant not find user b: JoinChat Socket")
            return {"error": 'An error occured'}, 400


        chat_room_id = database.ExecuteQuery(    "SELECT * FROM messages_user WHERE (sender = %s AND reciever = %s) OR (sender = %s AND reciever = %s)", (usera , userb , usera, userb))
        
        

        if len(chat_room_id) == 0:
            return {"chat": False , "data": []}
        else:
            return {"chat": True, "data": chat_room_id}
        
MainSocket = MainSocket()