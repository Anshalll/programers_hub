import bcrypt


def VerifyPassword(password , hashpwd):
    upass = password.strip().encode("utf-8")

    verify = bcrypt.checkpw(upass , hashpwd.encode("utf-8"))
    return verify




def HashPassword(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode()
    
def CheckPassword(password):
    valid = True
    
    if len(password.strip())  < 8:
        valid = False
        return { "valid" : valid, "error" : "Password is too short!" } 
    
    if not password.strip().isalnum():
        valid = False
        return { "valid" : valid, "error" : "Password should have number , letters and special characters." } 
    
    return {"valid": valid}