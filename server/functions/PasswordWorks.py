import bcrypt


def VerifyPassword(password , hashpwd):
    upass = password.strip().encode("utf-8")

    verify = bcrypt.checkpw(upass , hashpwd.encode("utf-8"))
    return verify




def HashPassword(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode()
    
def CheckPassword(password, username , email):
    valid = True
    
    if len(password.strip())  < 8:
        valid = False
        return { "valid" : valid, "error" : "Password is too short!" } 
    
    if  password.strip().isdigit():
        valid = False
        return { "valid" : valid, "error" : "Password is entirely numeric" } 
    if password.strip().lower() == username.strip().lower():
         valid = False
         return { "valid" : valid, "error" : "Password is same as username!" }
    if email.strip().lower() == password.strip().lower():
         valid = False
         return { "valid" : valid, "error" : "Password is same as email!" } 
    return {"valid": valid}