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

def GenerateUsername(name):
    string  = "abcdefgijklmnopqrstuvwxyz0123456789"
    for _ in range(0, 5):
        rand_choice = random.choice(string)
        name +=rand_choice
    return name