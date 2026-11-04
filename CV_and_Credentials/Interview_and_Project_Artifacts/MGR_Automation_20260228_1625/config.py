import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://mgr-uat.dv.vai247.pro"
USERNAME = os.getenv("MGR_USERNAME", "tester")
PASSWORD = os.getenv("MGR_PASSWORD", "123456")

# Driver settings
DRIVER_NAME = "msedgedriver.exe"
CERT_CN = os.getenv("CERT_CN", "mgr.dvpay.net")
URL_PATTERN = os.getenv("URL_PATTERN", "[*.]dv.vai247.pro")

# Paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DRIVER_PATH = os.path.join(ROOT_DIR, DRIVER_NAME)
