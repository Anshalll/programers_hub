from flask import request
from functions.GenerateVals import GeneratePostToken
from Redis_config import RedisServer

class MainSocket:
    def handle_connect(self):
        print(request.sid)
        return {'message': 'Connected to the server'}

    def JoinChat(self, data):
        room_token = GeneratePostToken(10)
        check_room = RedisServer.Redis_get(room_token)
        print(check_room)
        return {"Joined chat with username"}
    
MainSocket = MainSocket()