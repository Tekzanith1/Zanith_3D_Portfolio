import random
import string
import os
import sys

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_edge_driver
from pages.login_page import LoginPage
from pages.navigation_page import NavigationPage
from pages.business_hall_page import BusinessHallPage
from pages.user_page import UserPage

def get_random_string(length=5):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length)).upper()

def run_master_automation():
    print("🚀 Starting Master Automation Workflow...")
    driver = None
    
    try:
        driver = get_edge_driver()
        
        # Initialize Page Objects
        login_pg = LoginPage(driver)
        nav_pg = NavigationPage(driver)
        biz_pg = BusinessHallPage(driver)
        user_pg = UserPage(driver)

        # --- PHASE 1: Authentication & Setup ---
        login_pg.login()
        login_pg.change_language_to_english()

        # --- PHASE 2: User Module Workflow ---
        print("\n--- Phase 2: User Management ---")
        nav_pg.go_to_client_section()
        nav_pg.go_to_user_management()
        
        # Search for a specific user (Registration time reverted/omitted)
        user_pg.search_user("10114708", "Zan", "85930693")
        user_pg.open_user_details("10114708")
        
        # Navigate through user detail tabs
        for tab in ["Account", "Bill", "Water"]:
            try:
                user_pg.switch_tab(tab)
            except Exception as e:
                print(f"⚠️ Warning: Could not process tab {tab}: {e}")

        try:
            user_pg.close_modal() 
        except:
            pass
        
        # Click Reset after checking user details
        user_pg.click_reset()
            
        print("✅ User module checks completed.")

        # --- PHASE 3: Business Hall Module Workflow ---
        print("\n--- Phase 3: Business Hall Management ---")
        nav_pg.go_to_business_hall()
        biz_pg.click_add()
        
        # Generate and fill dynamic data
        uid = get_random_string()
        form_data = {
            "Coding": f"MST-{uid}",
            "Office name": f"Master Hall {uid}",
            "Address Detail": f"{random.randint(100, 999)} Master Rd",
            "Contact Number": "098765432",
            "Zip Code": "54321"
        }
        biz_pg.fill_form(form_data)
        biz_pg.set_multi_lang_names({
            "Chinese": "总控", 
            "English": "Master", 
            "Cambodian": "មេ",
            "Vietnamese": "Văn phòng Master"
        })
        biz_pg.set_coordinates("104.88", "11.66")
        biz_pg.select_type("Join")
        biz_pg.select_country(random.choice(["Cambodia", "China"]))
        biz_pg.select_region()
        
        print("✅ Business Hall form filled successfully.")
        
        # Final Step: Return to Home
        print("\n--- Phase 4: Clean Up ---")
        driver.get("https://mgr-uat.dv.vai247.pro/#/dashboard")
        print("🏆 Master workflow completed successfully!")

    except Exception as e:
        print(f"❌ Automation failed: {e}")
        if driver:
            try:
                driver.save_screenshot("master_failure.png")
                print("Captured screenshot: master_failure.png")
            except:
                print("Could not capture screenshot.")
    
    finally:
        if driver:
            print("Automation session kept open for review (detach mode active).")
        else:
            print("Driver failed to initialize.")

if __name__ == "__main__":
    run_master_automation()
