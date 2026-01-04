import requests
import uuid

def verify_license(license_key):
    # Get a unique hardware ID
    hwid = str(uuid.getnode())
    
    url = "http://localhost:3000/api/verify"
    payload = {
        "secret_key": "fb03e310a4b8f7e6df913b24edf4decea4cb525f61c882b20a4c68c7b7a79e1c",
        "license_key": license_key,
        "hwid": hwid
    }
    
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        
        print(data)  # Debugging line to see the full response
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