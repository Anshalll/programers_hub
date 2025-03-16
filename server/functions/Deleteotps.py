import schedule
import time
import threading
from flask import Flask
from db.db import database

app = Flask(__name__)

def Deleterecord():
    database.ExecuteQuery("DELETE FROM otps WHERE (UNIX_TIMESTAMP() * 1000 - time) > 9000" , ())
    

def run_scheduler():
    while True:
     
        schedule.run_pending()
        time.sleep(1)


def Deleteotps():
    Deleterecord()
    schedule.every(15).minutes.do(Deleterecord)

    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()


