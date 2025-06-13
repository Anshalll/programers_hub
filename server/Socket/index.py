from flask import session, request
from functions.GenerateVals import GeneratePostToken
from Redis_config import RedisServer
from db.db import database
from flask_socketio import emit
class MainSocket:
    def handle_connect(self, user):
        sid = request.sid

        RedisServer.Redis_insert_key_value(user, sid)
 
      
    
    def handle_disconnect(self, user):
            data = RedisServer.Redis_get_key_value(user)
            if data:
                RedisServer.Redis_del(user)

    def Getchatdata(self, data):
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


        chat_room_id = database.ExecuteQuery("SELECT * FROM messages_user WHERE (sender = %s AND reciever = %s) OR (sender = %s AND reciever = %s)", (usera , userb , usera, userb))
        
        

        if len(chat_room_id) == 0:
            return {"chat": False , "data": []}
        else:
            return {"chat": True, "data": chat_room_id}
    def sendMessage(self, data ):
        msg = data["message"]
        touser = data["touser"]
        tousersid = RedisServer.Redis_get_key_value(touser)
       
        fromuser = session["username"]

        if msg.strip() != "" and touser.strip() != "" and fromuser.strip() != "":
            
            emit("receive_message" , {
                "from": session["username"],
                "message": msg
            } , to=tousersid )
            

MainSocket = MainSocket()