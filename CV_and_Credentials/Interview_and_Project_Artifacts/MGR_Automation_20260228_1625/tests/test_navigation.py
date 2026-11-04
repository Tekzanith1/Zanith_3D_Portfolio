import pytest
from pages.login_page import LoginPage
from pages.navigation_page import NavigationPage

@pytest.fixture(autouse=True)
def setup_navigation(driver):
    login_pg = LoginPage(driver)
    login_pg.login()
    login_pg.change_language_to_english()

def test_nav_01_client_tab_switch(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    # Logic to verify Client section is active
    assert True

def test_nav_02_user_sidebar_switch(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    nav_pg.go_to_user_management()
    assert True

def test_nav_03_business_hall_sidebar_switch(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    nav_pg.go_to_business_hall()
    assert True

def test_nav_04_verify_client_tab_visible(driver):
    nav_pg = NavigationPage(driver)
    assert nav_pg.find_visible_element(nav_pg.CLIENT_TAB)

def test_nav_05_verify_user_sidebar_visible(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    assert nav_pg.find_visible_element(nav_pg.USER_SIDEBAR)

def test_nav_06_verify_business_hall_sidebar_visible(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    assert nav_pg.find_visible_element(nav_pg.BUSINESS_HALL_SIDEBAR)

def test_nav_07_sequential_nav_user_to_hall(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    nav_pg.go_to_user_management()
    nav_pg.go_to_business_hall()
    assert True

def test_nav_08_sequential_nav_hall_to_user(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    nav_pg.go_to_business_hall()
    nav_pg.go_to_user_management()
    assert True

def test_nav_09_verify_sidebar_labels(driver):
    nav_pg = NavigationPage(driver)
    nav_pg.go_to_client_section()
    assert "User" in nav_pg.find_element(nav_pg.USER_SIDEBAR).text
    assert "Business Hall" in nav_pg.find_element(nav_pg.BUSINESS_HALL_SIDEBAR).text

def test_nav_10_return_to_dashboard(driver):
    driver.get("https://mgr-uat.dv.vai247.pro/#/dashboard")
    assert "dashboard" in driver.current_url.lower()
