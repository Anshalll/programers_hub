import random
def GenerateOTP(length):
    otp = ""
    for _ in range(0, length):
        value= random.randint(1, 9)
        otp+=str(value)
    return int(otp)

def GenerateToken():
    token=""
    strval = "abcdefghijklmnopqrstuvwxyz@#$%^&*"
    for i in range(0, len(strval) - 1):
        token+=strval[i]
    return token