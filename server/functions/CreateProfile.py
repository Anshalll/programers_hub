from db.db import database
import datetime
import json
def createProfile(id):
    time = datetime.datetime.now()
    day = time.strftime("%d")
    month = time.strftime("%B")
    year = time.strftime("%Y")


    createdon = f"{day} {month} {year}"

    database.ExecuteQuery("INSERT INTO profile (id, dp , bg , bio , role , location , joinedon , socialmedialinks, followers , following) VALUES (%s , %s , %s , %s , %s , %s , %s , %s , %s , %s)" , (id, "defaultdp.jpg" , "defaultbg.jpg" , "" , ""  , "" , createdon , json.dumps([])  , 0 , 0  ) )