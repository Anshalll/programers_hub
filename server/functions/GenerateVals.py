import random
def GenerateOTP(length):
    otp = ""
    for _ in range(0, length):
        value= random.randint(1, 9)
        otp+=str(value)
    return int(otp)