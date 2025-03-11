import os
from dotenv import load_dotenv
import mysql.connector
class DB:
 
    def __init__(self):
        load_dotenv()
        self.conn = mysql.connector.connect(
            host=os.getenv("DBHOST"),
            database=os.getenv("DBNAME"),
            user=os.getenv("DBUSER"),
            password=os.getenv("DBPASSWORD")

        )
    def get_connection(self):
        if self.conn.is_connected():
           self.curosr = self.conn.cursor()

           print("Database connection established")
        else:
           print("Database connection failed")

    def ExecuteQuery(self , query): 
       return self.curosr.execute(query);    

database = DB()