import os

# Access your API keys directly from the environment variables
VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
SHODAN_API_KEY = os.getenv("SHODAN_API_KEY")
CVE_API_KEY = os.getenv("CVE_API_KEY")

# Uncomment the following lines to print the API keys. ONLY FOR DEBUGGING PURPOSES
#print(f"VirusTotal API Key: {VIRUSTOTAL_API_KEY}")
#print(f"Shodan API Key: {SHODAN_API_KEY}")
#print(f"CVE API Key: {CVE_API_KEY}")
