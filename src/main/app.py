from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to the path so we can import the fetch modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetch.fetchOSV import fetch_osv_vulnerabilities, process_vulnerabilities
from fetch.fetchVT import fetch_file_report, fetch_url_report, fetch_domain_report, fetch_ip_report, process_vt_report
from fetch.fetchAlienVault import fetch_ip_reputation, fetch_domain_reputation, fetch_url_reputation, fetch_file_hash_reputation, process_otx_report
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/osv', methods=['POST'])
def osv_search():
    """Fetch vulnerabilities from OSV API"""
    try:
        data = request.json
        package_name = data.get('package')
        ecosystem = data.get('ecosystem', 'PyPI')  # Default to PyPI
        
        if not package_name:
            return jsonify({'error': 'Package name is required'}), 400
        
        # Fetch from OSV API
        vuln_data = fetch_osv_vulnerabilities(package_name, ecosystem)
        
        print(f"Raw OSV API response: {vuln_data}")
        
        if not vuln_data:
            return jsonify({'vulnerabilities': []}), 200
        
        # Process the data
        vulnerabilities = process_vulnerabilities(vuln_data)
        
        print(f"Vulnerabilities returned: {vulnerabilities}")
        return jsonify({'vulnerabilities': vulnerabilities}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/virustotal', methods=['POST'])
def virustotal_search():
    """Fetch analysis report from VirusTotal"""
    try:
        data = request.json
        query = data.get('query')
        scan_type = data.get('type', 'file')  # Default to file hash
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Fetch from VirusTotal API based on type
        if scan_type == 'file':
            vt_data = fetch_file_report(query)
        elif scan_type == 'url':
            vt_data = fetch_url_report(query)
        elif scan_type == 'domain':
            vt_data = fetch_domain_report(query)
        elif scan_type == 'ip':
            vt_data = fetch_ip_report(query)
        else:
            return jsonify({'error': 'Invalid scan type'}), 400
        
        print(f"Raw VirusTotal API response: {vt_data}")
        
        if not vt_data:
            return jsonify({'result': None, 'error': 'No data found'}), 200
        
        # Process the data
        result = process_vt_report(vt_data)
        
        print(f"VirusTotal result: {result}")
        return jsonify({'result': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alienvault', methods=['POST'])
def alienvault_search():
    """Fetch threat intelligence from AlienVault OTX"""
    try:
        data = request.json
        query = data.get('query')
        check_type = data.get('type', 'ip')  # Default to IP
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Fetch from AlienVault OTX based on type
        if check_type == 'ip':
            otx_data = fetch_ip_reputation(query)
        elif check_type == 'domain':
            otx_data = fetch_domain_reputation(query)
        elif check_type == 'url':
            otx_data = fetch_url_reputation(query)
        elif check_type == 'hash':
            otx_data = fetch_file_hash_reputation(query)
        else:
            return jsonify({'error': 'Invalid check type'}), 400
        
        print(f"Raw AlienVault OTX API response: {otx_data}")
        
        if not otx_data:
            return jsonify({'result': None, 'error': 'No data found'}), 200
        
        # Process the data
        result = process_otx_report(otx_data)
        
        print(f"AlienVault OTX result: {result}")
        return jsonify({'result': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
