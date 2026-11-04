import pytest
import config
from pages.login_page import LoginPage

def test_login_01_valid_login(driver):
    login_pg = LoginPage(driver)
    login_pg.login(config.USERNAME, config.PASSWORD)
    assert "dashboard" in driver.current_url.lower()

def test_login_02_invalid_username(driver):
    login_pg = LoginPage(driver)
    login_pg.login("wrong_user", config.PASSWORD)
    # Check for error or remaining on login
    assert "dashboard" not in driver.current_url.lower()

def test_login_03_invalid_password(driver):
    login_pg = LoginPage(driver)
    login_pg.login(config.USERNAME, "wrong_pass")
    assert "dashboard" not in driver.current_url.lower()

def test_login_04_empty_username(driver):
    login_pg = LoginPage(driver)
    login_pg.login("", config.PASSWORD)
    assert "dashboard" not in driver.current_url.lower()

def test_login_05_empty_password(driver):
    login_pg = LoginPage(driver)
    login_pg.login(config.USERNAME, "")
    assert "dashboard" not in driver.current_url.lower()

def test_login_06_change_language_to_english(driver):
    login_pg = LoginPage(driver)
    driver.get(config.BASE_URL)
    login_pg.change_language_to_english()
    # Logic to verify language changed (e.g. placeholder text)
    placeholder = login_pg.find_element(login_pg.USERNAME_INPUT).get_attribute("placeholder")
    assert "Username" in placeholder or "Account" in placeholder

def test_login_07_verify_username_placeholder(driver):
    login_pg = LoginPage(driver)
    driver.get(config.BASE_URL)
    placeholder = login_pg.find_element(login_pg.USERNAME_INPUT).get_attribute("placeholder")
    assert placeholder is not None

def test_login_08_verify_password_placeholder(driver):
    login_pg = LoginPage(driver)
    driver.get(config.BASE_URL)
    placeholder = login_pg.find_element(login_pg.PASSWORD_INPUT).get_attribute("placeholder")
    assert placeholder is not None

def test_login_09_verify_settings_icon_presence(driver):
    login_pg = LoginPage(driver)
    driver.get(config.BASE_URL)
    assert login_pg.find_visible_element(login_pg.SETTINGS_ICON)

def test_login_10_verify_login_page_load(driver):
    driver.get(config.BASE_URL)
    assert "login" in driver.current_url.lower() or "mgr" in driver.current_url.lower()
