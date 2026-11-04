import random
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage

class BusinessHallPage(BasePage):
    ADD_BUTTON = (By.XPATH, "//div[@class='cmm-toolbar_main']//button[contains(., 'Add')]")
    
    # Updated to specifically target the button structure provided:
    # <button...><span>Confirm</span></button>
    CONFIRM_BUTTON = (By.XPATH, "//button[contains(@class, 'el-button')]//span[text()='Confirm']/parent::button")

    def click_add(self):
        self.click(self.ADD_BUTTON, "Add Business Hall")

    def fill_form(self, data):
        """
        Expects data dict with: Coding, Office name, Address Detail, Contact Number, Zip Code
        """
        for label, value in data.items():
            # Try finding by label first, then fallback to placeholder
            xpath_label = (By.XPATH, f"//label[contains(text(), '{label}')]/following-sibling::div//input")
            xpath_placeholder = (By.XPATH, f"//input[contains(@placeholder, '{label}')]")
            
            try:
                self.send_keys(xpath_label, value, label)
            except:
                self.send_keys(xpath_placeholder, value, f"{label} (via placeholder)")
            self.slow_pause(0.3, 0.6)

    def set_multi_lang_names(self, lang_map):
        """Map: {'Chinese': '...', 'English': '...', 'Cambodian': '...', 'Vietnamese': '...'}"""
        for lang, val in lang_map.items():
            xpath = (By.XPATH, f"//div[text()='{lang}']/following-sibling::input")
            self.send_keys(xpath, val, f"{lang} Name")

    def set_coordinates(self, lon, lat):
        self.send_keys((By.XPATH, "//div[text()='Longitude']/following-sibling::input"), lon, "Longitude")
        self.send_keys((By.XPATH, "//div[text()='Latitude']/following-sibling::input"), lat, "Latitude")

    def select_type(self, type_name=None):
        """Randomly decides between keeping the pre-selected 'Self-operated' or choosing another one."""
        if not type_name and random.choice([True, False]):
            print("[LOG] Randomly decided to keep the default Type (Self-operated).")
            return

        print("[LOG] Randomly decided to change the Business Hall Type.")
        input_loc = (By.XPATH, "//label[contains(text(), 'Type')]/following-sibling::div//input")
        self.click(input_loc, "Type Dropdown")
        self.slow_pause(1.0, 1.5)
        
        el = self.find_visible_element(input_loc)
        if not type_name:
            # Since 'Self-operated' is usually first, we press Down once to get to the next option
            el.send_keys(Keys.ARROW_DOWN)
            time.sleep(0.3)
            el.send_keys(Keys.ENTER)
            print(f"[LOG] Changed Type via keyboard (Arrow Down + Enter)")
        else:
            self.click((By.XPATH, f"//li/span[text()='{type_name}']"), f"Type: {type_name}")

    def select_country(self, country_name=None):
        """Selects a country from the dropdown. Defaults to random selection among Cambodia and China."""
        input_loc = (By.XPATH, "//label[contains(text(), 'Country')]/following-sibling::div//input")
        self.click(input_loc, "Country Dropdown")
        self.slow_pause(1.5, 2.0)
        
        if not country_name:
            # Randomly press down 1 or 2 times (1=Cambodia, 2=China)
            el = self.find_visible_element(input_loc)
            presses = random.randint(1, 2)
            for _ in range(presses):
                el.send_keys(Keys.ARROW_DOWN)
                time.sleep(0.2)
            el.send_keys(Keys.ENTER)
            print(f"[LOG] Selected random Country via keyboard ({presses} downs: 1=Cambodia, 2=China)")
        else:
            # Try to find the exact or partial match in the dropdown list
            try:
                options_xpath = "//li[contains(@class, 'el-select-dropdown__item')]//span"
                options = self.driver.find_elements(By.XPATH, options_xpath)
                
                target = None
                for opt in options:
                    txt = opt.text.strip()
                    if country_name.lower() in txt.lower():
                        target = opt
                        break
                
                if target:
                    print(f"[LOG] Found country match: '{target.text.strip()}' for requested '{country_name}'")
                    target.click()
                else:
                    print(f"[WARNING] Could not find '{country_name}' in visible list. Falling back to keyboard.")
                    el = self.find_visible_element(input_loc)
                    # Use index logic: Cambodia=1, China=2
                    index_map = {"Cambodia": 1, "China": 2}
                    presses = index_map.get(country_name, 1)
                    for _ in range(presses):
                        el.send_keys(Keys.ARROW_DOWN)
                        time.sleep(0.2)
                    el.send_keys(Keys.ENTER)
            except Exception as e:
                print(f"[DEBUG] Select country by text failed: {e}")
                el = self.find_visible_element(input_loc)
                el.send_keys(Keys.ARROW_DOWN)
                el.send_keys(Keys.ENTER)

    def select_region(self):
        """
        Hierarchical selection: Communes -> Districts -> Villages.
        Handles both single Cascader component and separate linked dropdowns.
        """
        print("[LOG] Attempting Region selection...")
        self.slow_pause(2.0, 3.0) # Critical wait for region data to load after country selection
        
        levels = ["Commune", "District", "Village"]
        
        # 1. Try as a Cascader first (Single input with multi-level menus)
        region_input_xpath = "//label[contains(text(), 'Region')]/following-sibling::div//input"
        region_inputs = self.driver.find_elements(By.XPATH, region_input_xpath)
        
        if region_inputs and region_inputs[0].is_displayed():
            print("[LOG] Detected Cascader-style Region selection.")
            self.click((By.XPATH, region_input_xpath), "Region Cascader")
            self.slow_pause(1.0, 1.5)
            
            for i, level_name in enumerate(levels):
                level_idx = i + 1
                level_xpath = f"(//ul[contains(@class, 'el-cascader-menu__list')])[{level_idx}]/li"
                try:
                    self.slow_pause(0.8, 1.2)
                    options = self.wait.until(EC.visibility_of_all_elements_located((By.XPATH, level_xpath)))
                    valid_options = [opt for opt in options if "is-disabled" not in opt.get_attribute("class")]
                    
                    if not valid_options:
                        break
                        
                    target = random.choice(valid_options)
                    print(f"[LOG] Cascader: Selecting {level_name} -> {target.text.strip()}")
                    self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", target)
                    target.click()
                except Exception as e:
                    print(f"[DEBUG] Cascader level {level_name} failed or not present: {e}")
                    break
        else:
            # 2. Try as separate connected dropdowns
            print("[LOG] Region Cascader not found or hidden. Checking for separate dropdowns...")
            for level_name in levels:
                try:
                    # Look for labels like 'Communes', 'Districts', 'Villages'
                    xpath = f"//label[contains(text(), '{level_name}')]/following-sibling::div//input"
                    dropdowns = self.driver.find_elements(By.XPATH, xpath)
                    
                    if dropdowns and dropdowns[0].is_displayed():
                        self.click((By.XPATH, xpath), f"{level_name} Dropdown")
                        self.slow_pause(1.0, 1.5)
                        
                        # Wait for options in the dropdown list
                        options_xpath = "//li[contains(@class, 'el-select-dropdown__item') and not(contains(@class, 'is-disabled')) and .//span]"
                        options = self.wait.until(EC.visibility_of_all_elements_located((By.XPATH, options_xpath)))
                        
                        if options:
                            target = random.choice(options)
                            print(f"[LOG] Separate Dropdown: Selecting {level_name} -> {target.text.strip()}")
                            target.click()
                            self.slow_pause(0.8, 1.2) # Wait for next dropdown to populate
                except Exception as e:
                    print(f"[DEBUG] Separate dropdown {level_name} failed: {e}")
                    continue

        self.slow_pause()

    def submit(self):
        # Click the confirm button based on the updated locator
        self.click(self.CONFIRM_BUTTON, "Confirm Button")