import requests
import os

def Verifyhcaptcha(token):
   
    secret = os.environ.get('HCAPTCHA_SECRET_KEY')
  
    response = requests.post("https://api.hcaptcha.com/siteverify", data={
        "secret": secret,
        "response": token
    })
    
    return response.json()["success"]