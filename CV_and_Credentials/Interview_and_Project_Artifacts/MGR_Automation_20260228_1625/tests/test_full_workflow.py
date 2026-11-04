import pytest
import random
import string
from pages.login_page import LoginPage
from pages.navigation_page import NavigationPage
from pages.business_hall_page import BusinessHallPage
from pages.user_page import UserPage

def get_random_string(length=5):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length)).upper()

@pytest.mark.parametrize("user_data", [
    {"id": "10114708", "name": "Zan", "phone": "85930693"}
])
def test_full_business_and_user_workflow(driver, user_data):
    # Initialize Page Objects
    login_pg = LoginPage(driver)
    nav_pg = NavigationPage(driver)
    biz_pg = BusinessHallPage(driver)
    user_pg = UserPage(driver)

    # 1. Login and Setup
    login_pg.login()
    login_pg.change_language_to_english()

    # 2. User Module Workflow
    nav_pg.go_to_client_section()
    nav_pg.go_to_user_management()
    
    user_pg.search_user(user_data["id"], user_data["name"], user_data["phone"])
    user_pg.open_user_details(user_data["id"])
    
    for tab in ["Account", "Bill", "Water"]:
        user_pg.switch_tab(tab)
    
    user_pg.close_modal()
    user_pg.click_reset()

    # 3. Business Hall Module Workflow
    nav_pg.go_to_business_hall()
    biz_pg.click_add()
    
    uid = get_random_string()
    form_data = {
        "Coding": f"TST-{uid}",
        "Office name": f"Test Hall {uid}",
        "Address Detail": f"{random.randint(100, 999)} Automated Rd",
        "Contact Number": "098765432",
        "Zip Code": "54321"
    }
    biz_pg.fill_form(form_data)
    biz_pg.set_multi_lang_names({
        "Chinese": f"测试 {uid}", 
        "English": f"Test {uid}", 
        "Cambodian": f"មេ {uid}",
        "Vietnamese": f"Văn phòng {uid}"
    })
    biz_pg.set_coordinates("104.88", "11.66")
    
    # Select Dropdowns randomly
    biz_pg.select_type()
    biz_pg.select_country()
    biz_pg.select_region()
    
    # Finalize Business Hall Creation
    biz_pg.submit()
    print("Business Hall submitted successfully!")
    
    # 4. Cleanup/Return
    driver.get("https://mgr-uat.dv.vai247.pro/#/dashboard")
    assert "dashboard" in driver.current_url.lower()
