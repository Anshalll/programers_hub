import time
import datetime
def GetTime():
    milliseconds = time.time()
    return milliseconds

def GetMonthdate():

    now = datetime.datetime.now()
    month = now.strftime("%b")
    day = now.strftime("%d")
    year = now.strftime("%Y")
    return f"{day} {month} {year}"