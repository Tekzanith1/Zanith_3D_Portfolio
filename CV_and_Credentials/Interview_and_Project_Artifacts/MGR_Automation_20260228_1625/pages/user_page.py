from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class UserPage(BasePage):
    # Locators
    SEARCH_INPUT_ID = (By.XPATH, "//section/header//div[1]/input")
    SEARCH_INPUT_NAME = (By.XPATH, "//section/header//div[2]/input")
    SEARCH_INPUT_PHONE = (By.XPATH, "//section/header//div[3]/input")
    SEARCH_INPUT_REG_TIME = (By.XPATH, "//section/header//div[4]//input")
    SEARCH_BUTTON = (By.XPATH, "//button[contains(., 'Search')]")
    RESET_BUTTON = (By.XPATH, "//button[contains(., 'Reset')]")
    
    # Tabs inside User Profile
    TAB_ORDER = (By.ID, "tab-order")
    TAB_ACCOUNT = (By.ID, "tab-account")
    TAB_BILL = (By.ID, "tab-bill")
    TAB_WATER = (By.ID, "tab-water")
    
    # Modal Close
    CLOSE_BUTTON = (By.XPATH, "//button[contains(., 'Close')]")

    def search_user(self, user_id, user_name, phone_number, reg_time=None):
        self.send_keys(self.SEARCH_INPUT_ID, user_id, "User ID Search")
        self.send_keys(self.SEARCH_INPUT_NAME, user_name, "User Name Search")
        self.send_keys(self.SEARCH_INPUT_PHONE, phone_number, "Phone Number Search")
        if reg_time:
            self.send_keys(self.SEARCH_INPUT_REG_TIME, reg_time, "Registration Time Search")
        
        print(f"[DEBUG] Verifying data entry for {user_name} before searching...")
        self.slow_pause(0.8, 1.2) 
        
        self.click(self.SEARCH_BUTTON, "Search Button")
        self.wait_for_loading()

    def click_reset(self):
        self.click(self.RESET_BUTTON, "Reset Button")

    def open_user_details(self, user_id):
        xpath = (By.XPATH, f"//table//button[contains(., '{user_id}')]")
        self.click(xpath, f"User Details Link: {user_id}")

    def switch_tab(self, tab_name):
        tabs = {
            "Order": self.TAB_ORDER,
            "Account": self.TAB_ACCOUNT,
            "Bill": self.TAB_BILL,
            "Water": self.TAB_WATER
        }
        self.click(tabs[tab_name], f"{tab_name} Tab")
        self.slow_pause()

    def close_modal(self):
        try:
            self.click(self.CLOSE_BUTTON, "Close Modal Button")
        except:
            print("[DEBUG] No modal to close or button not found.")
