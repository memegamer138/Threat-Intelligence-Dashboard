import requests
import os

# AlienVault OTX API Base URL
OTX_API_URL = "https://otx.alienvault.com/api/v1"

def get_otx_api_key():
    """Get AlienVault OTX API key from environment"""
    return os.getenv("ALIENVAULT_API_KEY")

def fetch_ip_reputation(ip_address):
    """Fetch IP address reputation from AlienVault OTX"""
    api_key = get_otx_api_key()
    if not api_key:
        print("Error: ALIENVAULT_API_KEY not found in environment")
        return None
    
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        url = f"{OTX_API_URL}/indicators/IPv4/{ip_address}/general"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching IP reputation: {e}")
        return None

def fetch_domain_reputation(domain):
    """Fetch domain reputation from AlienVault OTX"""
    api_key = get_otx_api_key()
    if not api_key:
        print("Error: ALIENVAULT_API_KEY not found in environment")
        return None
    
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        url = f"{OTX_API_URL}/indicators/domain/{domain}/general"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching domain reputation: {e}")
        return None

def fetch_url_reputation(url_to_check):
    """Fetch URL reputation from AlienVault OTX"""
    api_key = get_otx_api_key()
    if not api_key:
        print("Error: ALIENVAULT_API_KEY not found in environment")
        return None
    
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        url = f"{OTX_API_URL}/indicators/url/{url_to_check}/general"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL reputation: {e}")
        return None

def fetch_file_hash_reputation(file_hash):
    """Fetch file hash reputation from AlienVault OTX"""
    api_key = get_otx_api_key()
    if not api_key:
        print("Error: ALIENVAULT_API_KEY not found in environment")
        return None
    
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        url = f"{OTX_API_URL}/indicators/file/{file_hash}/general"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching file hash reputation: {e}")
        return None

def fetch_pulses(indicator, indicator_type):
    """Fetch threat pulses related to an indicator"""
    api_key = get_otx_api_key()
    if not api_key:
        print("Error: ALIENVAULT_API_KEY not found in environment")
        return None
    
    headers = {
        "X-OTX-API-KEY": api_key
    }
    
    try:
        url = f"{OTX_API_URL}/indicators/{indicator_type}/{indicator}/general"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching pulses: {e}")
        return None

def process_otx_report(otx_data):
    """Process AlienVault OTX report data"""
    if not otx_data:
        print("No data found or invalid response")
        return None
    
    pulse_info = otx_data.get('pulse_info', {})
    pulses = pulse_info.get('pulses', [])
    
    # Extract relevant information
    result = {
        'indicator': otx_data.get('indicator', 'N/A'),
        'type': otx_data.get('type', 'N/A'),
        'pulse_count': pulse_info.get('count', 0),
        'reputation': otx_data.get('reputation', 0),
        'country': otx_data.get('country_name', 'Unknown'),
        'city': otx_data.get('city', 'Unknown'),
        'asn': otx_data.get('asn', 'Unknown'),
        'pulses': []
    }
    
    # Get top 5 pulses
    for pulse in pulses[:5]:
        pulse_data = {
            'name': pulse.get('name', 'N/A'),
            'description': pulse.get('description', 'No description'),
            'created': pulse.get('created', 'Unknown'),
            'tags': pulse.get('tags', []),
            'threat_score': pulse.get('threat_score', 0),
            'author': pulse.get('author_name', 'Unknown')
        }
        result['pulses'].append(pulse_data)
    
    return result

