import re

def CheckFields(reqfieldsarr  , udata): 
    error = False
  
    for i in reqfieldsarr:
        
        if not i["name"] in udata:
            error = True
            return {"error": error , "message": f"{i['value']} is required!" }
      

        if udata[i["name"]] == None or udata[i['name']].strip() == "":
            error = True
            return {"error": error , "message": f"{i['value']} is required!" }
    
    return {"error": False, "message" : ""}


def ValidateEmail(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

    if(re.fullmatch(regex, email.strip())):

        return True

    return False
