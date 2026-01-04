import requests
import uuid

def verify_license(license_key):
    # Get a unique hardware ID
    hwid = str(uuid.getnode())
    
    url = "http://localhost:3000/api/verify"
    payload = {
        "secret_key": "your_app_secret_key_here",
        "license_key": license_key,
        "hwid": hwid
    }
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        print(data) 
        if data.get("success"):
            print("Access Granted!")
            return True
        else:
            print(f"Access Denied: {data.get('message')}")
            return False
    except Exception as e:
        print(f"Connection Error: {e}")
        return False
    
if __name__ == "__main__":
    license_key = input("Enter your license key: ")
    verify_license(license_key)