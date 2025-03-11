import os
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


load_dotenv()


def SendMail(email , subject , body ): 
    sender_email = os.getenv("EMAIL")
    sender_password = os.getenv("EMAILPASS")
    receiver_email = email



    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject

    
    msg.attach(MIMEText(body, "plain"))


    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

        return True
    
    except Exception as e:
        print(e)
        return False


