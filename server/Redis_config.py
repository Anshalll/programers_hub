import redis
import json
class RedisConnect():
    def __init__(self, r):
        self.r = r

    def CheckConnection(self):
        try:   
            

            if self.r.ping():
                print("Connected to Redis successfully!")
            else:
                print("Connection to Redis failed!")


        except redis.ConnectionError as e:
            print(f"Redis connection error: {e}")

    def Redis_insert(self , key, values, tr="."):
        try:
            data = json.dumps(values)

            self.r.execute_command('JSON.SET', key, tr, data)

        except Exception as e:
            print(e)
    def Redis_insert_key_value(self , key , value):
        try:
            self.r.execute_command("SET" , key , value)
        except Exception as e:
            print(e)
            return {"error" : "Internal server error!"}
    
    def Redis_get_key_value(self , key):
        try:
            data = self.r.execute_command("GET" , key)
            return data
        except Exception as e:
            print(e)
            return {"error" : "Internal server error!"}
        

    def Redis_get(self , key ):
        try: 
            data = self.r.execute_command('JSON.GET', key, '.')
       
            if data:
                return {"data" : json.loads(data) , "error": False}
            else:
                return {"data" : None , "error": False}
        except:
            return {"error" : True}
    def Redis_del(self , key):
        try:
            print("deleted user" , key)
            self.r.delete(key)
        except Exception as e:
            print(e)
            return  {"error" : "Internal server error!"}
RedisServer = RedisConnect(redis.Redis(host='localhost', port=6379, decode_responses=True))
