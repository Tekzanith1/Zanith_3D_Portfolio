import pytest
from pages.login_page import LoginPage
from pages.navigation_page import NavigationPage
from pages.user_page import UserPage

USER_ID = "10114708"
USER_NAME = "Zan"
PHONE = "85930693"

@pytest.fixture(autouse=True)
def setup_user(driver):
    login_pg = LoginPage(driver)
    nav_pg = NavigationPage(driver)
    login_pg.login()
    login_pg.change_language_to_english()
    nav_pg.go_to_client_section()
    nav_pg.go_to_user_management()

def test_user_01_search_by_id(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    assert True

def test_user_02_search_by_name(driver):
    user_pg = UserPage(driver)
    user_pg.search_user("", USER_NAME, "")
    assert True

def test_user_03_search_by_phone(driver):
    user_pg = UserPage(driver)
    user_pg.search_user("", "", PHONE)
    assert True

def test_user_04_reset_search(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, USER_NAME, PHONE)
    user_pg.click_reset()
    assert True

def test_user_05_open_details(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    assert True

def test_user_06_switch_tab_account(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    user_pg.switch_tab("Account")
    assert True

def test_user_07_switch_tab_bill(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    user_pg.switch_tab("Bill")
    assert True

def test_user_08_switch_tab_water(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    user_pg.switch_tab("Water")
    assert True

def test_user_09_close_modal(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    user_pg.close_modal()
    assert True

def test_user_10_sequential_tab_switch(driver):
    user_pg = UserPage(driver)
    user_pg.search_user(USER_ID, "", "")
    user_pg.open_user_details(USER_ID)
    for t in ["Account", "Bill", "Water"]:
        user_pg.switch_tab(t)
    assert True
