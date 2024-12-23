import requests
import dotenv
import os

# Set up the OTX API URL and your API key
dotenv.load_dotenv()
ALIENVAULT_API_KEY = os.getenv('ALIENVAULT_API_KEY')      
BASE_URL = 'https://otx.alienvault.com/api/v1/indicators'

headers = {
    'X-OTX-API-KEY': ALIENVAULT_API_KEY
}

# Example to get IPs related to attacks
response = requests.get(f'{BASE_URL}/IPv4', headers=headers)

if response.status_code == 200:
    data = response.json()
    for indicator in data['results']:
        ip = indicator['indicator']
        # You can use a GeoIP API to convert IP to latitude and longitude
        print(f'IP: {ip}')
else:
    print(f'Error fetching data: {response.status_code}')
