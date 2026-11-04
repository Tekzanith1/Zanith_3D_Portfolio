import pytest
import random
import string
from pages.login_page import LoginPage
from pages.navigation_page import NavigationPage
from pages.business_hall_page import BusinessHallPage

def get_random_string(length=5):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length)).upper()

@pytest.fixture(autouse=True)
def setup_biz(driver):
    login_pg = LoginPage(driver)
    nav_pg = NavigationPage(driver)
    login_pg.login()
    login_pg.change_language_to_english()
    nav_pg.go_to_business_hall()

def test_biz_01_open_add_form(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    assert True

def test_biz_02_fill_form_basic(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    uid = get_random_string()
    biz_pg.fill_form({
        "Coding": f"TST-{uid}",
        "Office name": f"Test Hall {uid}",
        "Address Detail": "123 Test St",
        "Contact Number": "098765432",
        "Zip Code": "12345"
    })
    assert True

def test_biz_03_multi_lang_names(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.set_multi_lang_names({
        "Chinese": "测试", "English": "Test", "Cambodian": "មេ", "Vietnamese": "Văn phòng"
    })
    assert True

def test_biz_04_set_coordinates(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.set_coordinates("104.88", "11.66")
    assert True

def test_biz_05_select_type_self(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.select_type("Self-operated")
    assert True

def test_biz_06_select_type_join(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.select_type("Join")
    assert True

def test_biz_07_select_country_cambodia(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.select_country("Cambodia")
    assert True

def test_biz_08_select_country_china(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.select_country("China")
    assert True

def test_biz_09_select_region_hierarchical(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    biz_pg.select_country("Cambodia")
    biz_pg.select_region()
    assert True

def test_biz_10_full_submit_process(driver):
    biz_pg = BusinessHallPage(driver)
    biz_pg.click_add()
    uid = get_random_string()
    biz_pg.fill_form({"Coding": f"FULL-{uid}", "Office name": f"Full Test {uid}"})
    biz_pg.select_country("China")
    biz_pg.select_region()
    biz_pg.submit()
    assert True
