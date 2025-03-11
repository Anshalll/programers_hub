def CheckFields(reqfieldsarr  , udata): 
    error = False
  
    for i in reqfieldsarr:
  
    
        if udata[i["name"]] == None or udata[i["name"]].strip() == "":
            error = True
            return {"error": error , "message": f"{i["value"]} is required!" }
    
    return {"error": False, "message" : ""}