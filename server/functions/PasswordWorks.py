import bcrypt


def VerifyPassword(password , hashpwd):
    upass = password.strip().encode("utf-8")

    verify = bcrypt.checkpw(upass , hashpwd.encode("utf-8"))
    return verify




def HashPassword(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode()
    