import jwt
import os
from functions.GenerateVals import GenerateToken

def Generatejwt():
    encoded_jwt = jwt.encode({"token": GenerateToken()}, os.getenv("JWTKEY") , algorithm="HS256")
    return encoded_jwt

def Decodejwt(encoded_jwt):
    decoded  = jwt.decode(encoded_jwt , os.getenv("JWTKEY") , algorithm=["HS256"])
    return decoded