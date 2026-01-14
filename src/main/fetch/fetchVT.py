import requests
import os

# VirusTotal API Base URL
VT_API_URL = "https://www.virustotal.com/api/v3"

def get_vt_api_key():
    """Get VirusTotal API key from environment"""
    return os.getenv("VIRUSTOTAL_API_KEY")

def fetch_file_report(file_hash):
    """Fetch file analysis report from VirusTotal"""
    api_key = get_vt_api_key()
    if not api_key:
        print("Error: VIRUSTOTAL_API_KEY not found in environment")
        return None
    
    headers = {
        "x-apikey": api_key
    }
    
    try:
        url = f"{VT_API_URL}/files/{file_hash}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching file report: {e}")
        return None

def fetch_url_report(url_to_scan):
    """Fetch URL analysis report from VirusTotal"""
    api_key = get_vt_api_key()
    if not api_key:
        print("Error: VIRUSTOTAL_API_KEY not found in environment")
        return None
    
    headers = {
        "x-apikey": api_key
    }
    
    try:
        # First, encode the URL to get its ID
        import base64
        url_id = base64.urlsafe_b64encode(url_to_scan.encode()).decode().strip("=")
        
        url = f"{VT_API_URL}/urls/{url_id}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL report: {e}")
        return None

def fetch_domain_report(domain):
    """Fetch domain analysis report from VirusTotal"""
    api_key = get_vt_api_key()
    if not api_key:
        print("Error: VIRUSTOTAL_API_KEY not found in environment")
        return None
    
    headers = {
        "x-apikey": api_key
    }
    
    try:
        url = f"{VT_API_URL}/domains/{domain}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching domain report: {e}")
        return None

def fetch_ip_report(ip_address):
    """Fetch IP address analysis report from VirusTotal"""
    api_key = get_vt_api_key()
    if not api_key:
        print("Error: VIRUSTOTAL_API_KEY not found in environment")
        return None
    
    headers = {
        "x-apikey": api_key
    }
    
    try:
        url = f"{VT_API_URL}/ip_addresses/{ip_address}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching IP report: {e}")
        return None

def process_vt_report(vt_data):
    """Process VirusTotal report data"""
    if not vt_data or 'data' not in vt_data:
        print("No data found or invalid response")
        return None
    
    data = vt_data['data']
    attributes = data.get('attributes', {})
    stats = attributes.get('last_analysis_stats', {})
    
    result = {
        'id': data.get('id', 'N/A'),
        'type': data.get('type', 'N/A'),
        'malicious': stats.get('malicious', 0),
        'suspicious': stats.get('suspicious', 0),
        'undetected': stats.get('undetected', 0),
        'harmless': stats.get('harmless', 0),
        'total_votes': stats.get('malicious', 0) + stats.get('suspicious', 0) + stats.get('undetected', 0) + stats.get('harmless', 0),
        'reputation': attributes.get('reputation', 0),
        'last_analysis_date': attributes.get('last_analysis_date', 'Unknown'),
        'categories': attributes.get('categories', {}),
    }
    
    return result
