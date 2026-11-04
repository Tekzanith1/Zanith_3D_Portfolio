from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class NavigationPage(BasePage):
    # Top Header Tabs
    CLIENT_TAB = (By.XPATH, "//header//li[contains(., 'Client')] | //header//li[2]")
    
    # Sidebar Items
    USER_SIDEBAR = (By.XPATH, "//aside//li[contains(., 'User')] | //aside//li[1]")
    BUSINESS_HALL_SIDEBAR = (By.XPATH, "//aside//li[contains(., 'Business Hall')] | //aside//li[2]")

    def go_to_client_section(self):
        self.click(self.CLIENT_TAB, "Client Tab")
    
    def go_to_user_management(self):
        self.click(self.USER_SIDEBAR, "User Sidebar")

    def go_to_business_hall(self):
        self.click(self.BUSINESS_HALL_SIDEBAR, "Business Hall Sidebar")
