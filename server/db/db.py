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
           self.cursor = self.conn.cursor(dictionary=True , buffered=True)

           print("Database connection established")
        else:
           print("Database connection failed")

    def ExecuteQuery(self , query , values): 
        self.cursor.execute(query, values)
        
     
        if query.strip().lower().startswith("select"):
            
            return self.cursor.fetchall() 
        
        self.conn.commit()  
      
        return self.cursor.rowcount  

database = DB()