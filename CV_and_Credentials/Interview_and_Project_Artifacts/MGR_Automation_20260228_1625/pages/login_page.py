from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from pages.base_page import BasePage
import config

class LoginPage(BasePage):
    USERNAME_INPUT = (By.XPATH, "//input[contains(@placeholder, '账号')]")
    PASSWORD_INPUT = (By.XPATH, "//input[@placeholder='请输入登录密码']")
    # Refined locator to target the dropdown container that holds the setting icon
    SETTINGS_ICON = (By.XPATH, "//div[contains(@class, 'el-dropdown') and .//i[contains(@class, 'el-icon-setting')]]")
    ENGLISH_OPTION = (By.XPATH, "//li[contains(text(), 'English')]")

    def login(self, username=config.USERNAME, password=config.PASSWORD):
        self.driver.get(config.BASE_URL)
        self.send_keys(self.USERNAME_INPUT, username, "Username")
        self.send_keys(self.PASSWORD_INPUT, password, "Password")
        
        # Try finding a login button if Enter doesn't work reliably
        try:
            self.find_element(self.PASSWORD_INPUT).send_keys(Keys.ENTER)
        except:
            # Fallback: find any button that looks like a login button
            self.click((By.XPATH, "//button[.//span[contains(text(), '登录')] or contains(., 'Login')]"))

        # Wait for the dashboard or a known element to confirm login
        print("[LOG] Login submitted. Waiting for dashboard...")
        self.slow_pause(3.0, 5.0) 
        self.wait_for_loading()

    def change_language_to_english(self):
        """Clicks the settings icon and selects English."""
        # Try both hovering and clicking as different environments/Edge versions behave differently
        try:
            self.hover(self.SETTINGS_ICON)
            self.slow_pause(0.5, 0.8)
        except:
            pass
            
        self.click(self.SETTINGS_ICON, "Language Settings Dropdown")
        self.slow_pause(1.0, 1.5)
        
        self.click(self.ENGLISH_OPTION, "English Language Option")
        self.slow_pause(1.5, 2.0)
