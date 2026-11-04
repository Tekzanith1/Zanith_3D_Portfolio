import os
import json
import winreg
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
import config

def apply_auto_select_certificate_policy():
    """Forces Windows/Edge to automatically select a specific certificate."""
    reg_path = r"SOFTWARE\Policies\Microsoft\Edge\AutoSelectCertificateForUrls"
    policy_dict = {
        "pattern": config.URL_PATTERN,
        "filter": {"SUBJECT": {"CN": config.CERT_CN}}
    }
    policy_json = json.dumps(policy_dict)

    try:
        key = winreg.CreateKey(winreg.HKEY_CURRENT_USER, reg_path)
        winreg.SetValueEx(key, "1", 0, winreg.REG_SZ, policy_json)
        winreg.CloseKey(key)
        print(f"Certificate Policy Applied: {config.CERT_CN}")
    except Exception as e:
        print(f"Registry Warning: {e}. (Run as Admin if the pop-up still appears)")

def get_edge_driver():
    """Initializes and returns a configured Edge WebDriver."""
    # Removed taskkill to allow multiple browsers to stay open
    
    try:
        apply_auto_select_certificate_policy()
    except:
        pass # Non-critical failure

    options = Options()
    options.add_experimental_option("detach", True)
    # Hide the "controlled by automated software" infobar
    options.add_experimental_option("excludeSwitches", ["enable-logging", "enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    
    options.add_argument("--log-level=3") 
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--start-maximized")

    # Secondary preference layer
    cert_pref = {"pattern": config.BASE_URL, "filter": {"SUBJECT": {"CN": config.CERT_CN}}}
    options.add_experimental_option("prefs", {
        "autoselectcertificateforurls": [json.dumps(cert_pref)]
    })
    
    service = Service(config.DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)
    return driver
