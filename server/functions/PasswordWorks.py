import bcrypt


def VerifyPassword(password):
    pass


def HashPassword(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode()
    