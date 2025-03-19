import random
import math
def GenerateOTP(length):
    otp = ""
    for _ in range(0, length):
        value= random.randint(1, 9)
        otp+=str(value)
    return int(otp)

def GenerateToken():
    token=""
    strval = "abcdefghijklmnopqrstuvwxyz@#$%^&*"
    for _ in range(0, len(strval)):
        randval = random.choice(strval)
        token+=randval
    return token