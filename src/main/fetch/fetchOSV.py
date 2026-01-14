import requests

# OSV API Base URL
OSV_API_URL = "https://api.osv.dev/v1/query"

def fetch_osv_vulnerabilities(package_name, ecosystem):
    payload = {
        "package": {
            "name": package_name,
            "ecosystem": ecosystem
        }
    }
    print(f"Sending payload to OSV API: {payload}")
    try:
        response = requests.post(OSV_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        print(f"OSV API returned: {result}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error fetching vulnerabilities: {e}")
        return None

def process_vulnerabilities(vuln_data):
    if not vuln_data or 'vulns' not in vuln_data:
        print("No vulnerabilities found or invalid data")
        return []

    vulnerabilities = vuln_data['vulns']
    processed_vulns = []

    for vuln in vulnerabilities:
        vuln_info = {
            'id': vuln.get('id', 'N/A'),
            'summary': vuln.get('summary', 'No summary available'),
            'severity': vuln.get('severity', 'Unknown'),
            'published': vuln.get('published', 'Unknown date'),
            'references': [ref['url'] for ref in vuln.get('references', [])]
        }
        processed_vulns.append(vuln_info)

    return processed_vulns

# Example Usage
package = "requests"
ecosystem = "PyPI"
vuln_data = fetch_osv_vulnerabilities(package, ecosystem)

# Process the fetched data
if vuln_data:
    vulnerabilities = process_vulnerabilities(vuln_data)
    for vuln in vulnerabilities:
        print(f"Vulnerability ID: {vuln['id']}")
        print(f"Summary: {vuln['summary']}")
        print(f"Severity: {vuln['severity']}")
        print(f"Published: {vuln['published']}")
        print(f"References: {', '.join(vuln['references'])}")
        print("\n")
