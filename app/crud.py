import requests
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration for testmail.app
TESTMAIL_KEY = os.getenv("TESTMAIL_KEY", "52dbd62d-307d-4f76-91ce-c501044fb6ae")
TESTMAIL_NAMESPACE = os.getenv("TESTMAIL_NAMESPACE", "3fatp")
ALERT_EMAIL = os.getenv("ALERT_EMAIL", "goutamdhanani@gmail.com")
GOUTAM_KUMAR_NAME = "goutam kumar"


def send_email_notification(sender_name: str, message: str):
    """Send email notification via testmail.app when goutam kumar receives a message"""
    try:
        # testmail.app API endpoint
        url = f"https://api.testmail.app/api/json?apikey={TESTMAIL_KEY}&namespace={TESTMAIL_NAMESPACE}"
        
        # For testmail.app, we send to their inbox format
        to_email = f"{TESTMAIL_NAMESPACE}.{ALERT_EMAIL.split('@')[0]}@inbox.testmail.app"
        
        payload = {
            "from": "SecureChat Notification <noreply@securechat.app>",
            "to": ALERT_EMAIL,
            "subject": f"New message from {sender_name}",
            "text": f"You received a new message from {sender_name}:\n\n{message}"
        }
        
        # Note: testmail.app is primarily for receiving/testing emails
        # For sending, we might need to use a different approach or SMTP
        # Alternative: Use requests to log/notify
        print(f"[EMAIL NOTIFICATION] To: {ALERT_EMAIL}, From: {sender_name}, Message: {message[:50]}...")
        
    except Exception as e:
        print(f"Failed to send email notification: {e}")


def send_email_notification_smtp(sender_name: str, message: str):
    """Send email notification when goutam kumar receives a message (SMTP variant)"""
    try:
        msg = MIMEMultipart()
        msg['From'] = 'SecureChat <noreply@securechat.app>'
        msg['To'] = ALERT_EMAIL
        msg['Subject'] = f'New message from {sender_name}'
        
        body = f"""
Hello Goutam,

You received a new message in SecureChat!

From: {sender_name}
Message: {message}

---
SecureChat - End-to-end encrypted messaging
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Log the notification (actual SMTP sending would require server config)
        print(f"[EMAIL NOTIFICATION] Sending to {ALERT_EMAIL}")
        print(f"Subject: New message from {sender_name}")
        print(f"Body preview: {message[:100]}...")
        
    except Exception as e:
        print(f"Failed to send email notification: {e}")


def send_message(db, msg):
    """
    Send a message and trigger email notification if recipient is goutam kumar.
    
    This function requires the following imports from the backend:
    - crypto: for encrypt_message function
    - models: for Message and User models
    - schemas: for MessageCreate schema
    
    Args:
        db: Database session (SQLAlchemy Session)
        msg: Message create schema with sender_id, recipient_id, message
    
    Returns:
        The created message object
    """
    # Import backend modules (these would be defined elsewhere in the backend)
    from . import crypto, models, schemas
    
    ciphertext, nonce = crypto.encrypt_message(msg.message)
    m = models.Message(
        sender_id=msg.sender_id,
        recipient_id=msg.recipient_id,
        ciphertext=ciphertext,
        nonce=nonce
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    
    # Check if recipient is goutam kumar and send email notification
    recipient = db.query(models.User).filter(models.User.id == msg.recipient_id).first()
    if recipient and recipient.name.lower() == GOUTAM_KUMAR_NAME.lower():
        sender = db.query(models.User).filter(models.User.id == msg.sender_id).first()
        sender_name = sender.name if sender else "Unknown"
        send_email_notification(sender_name, msg.message)
    
    return m
