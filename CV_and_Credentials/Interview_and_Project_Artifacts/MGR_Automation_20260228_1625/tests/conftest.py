import pytest
import os
import sys

# Add the parent directory to sys.path so we can import utils and pages
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils import get_edge_driver

@pytest.fixture(scope="function")
def driver():
    """Fixture to provide a clean WebDriver instance for each test."""
    driver = get_edge_driver()
    yield driver
    
    # Check if the user wants to keep the browser open
    # We can use an environment variable to control this
    if os.getenv("KEEP_OPEN", "false").lower() != "true":
        driver.quit()
    else:
        print("\n[LOG] Browser kept open as requested (KEEP_OPEN=true)")
