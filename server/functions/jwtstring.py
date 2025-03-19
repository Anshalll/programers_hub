import jwt
import os
from functions.GenerateVals import GenerateToken

def Generatejwt():
    stringval = GenerateToken()
    print(stringval)
    encoded_jwt = jwt.encode({"token": stringval}, os.getenv("JWTKEY") , algorithm="HS256")
    return encoded_jwt

