import time
import random
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)  # Increased default wait time
        self.actions = ActionChains(driver)

    def find_element(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_visible_element(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def click(self, locator, description="Element"):
        """Standardized click with retries, explicit waits, and self-healing fallback."""
        for i in range(3):
            try:
                self.wait_for_loading()
                element = self.wait.until(EC.element_to_be_clickable(locator))
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
                
                # Attempt standard click first
                try:
                    element.click()
                except Exception:
                    # Fallback to JS click if intercepted
                    self.driver.execute_script("arguments[0].click();", element)
                
                print(f"[LOG] Clicked: {description}")
                return True
            except (StaleElementReferenceException, TimeoutException):
                print(f"[DEBUG] Retrying click on {description} ({i+1}/3)")
                time.sleep(1)
        
        # If standard methods fail, attempt self-healing
        return self._heal_and_click(description)

    def _heal_and_click(self, description):
        """Self-healing: Inspect DOM to find and click an element matching the description."""
        print(f"[HEALING] Normal locator failed. Inspecting DOM to find '{description}'...")
        try:
            elements = self.driver.find_elements(By.XPATH, "//button | //a | //li | //span | //div[contains(@class, 'button')]")
            for el in elements:
                try:
                    if el.is_displayed():
                        text = el.text.strip()
                        # Simple heuristic: Does the element text resemble our description?
                        if text and (description.lower() in text.lower() or text.lower() in description.lower()[:20]):
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
                            self.driver.execute_script("arguments[0].click();", el)
                            print(f"[HEALING-SUCCESS] Dynamically discovered and clicked element for '{description}': Text='{text}'")
                            return True
                except:
                    continue
        except Exception as e:
            print(f"[HEALING-ERROR] DOM inspection failed: {e}")
            
        print(f"[HEALING-FAILED] Could not auto-discover replacement for '{description}'.")
        return False

    def send_keys(self, locator, text, description="Field"):
        """Ensures field is ready, cleared, typed into properly, and verified."""
        try:
            el = self.find_visible_element(locator)
            el.clear()
            # If clear didn't work (common in some frameworks), use Ctrl+A + Backspace
            if el.get_attribute("value") != "":
                el.send_keys(Keys.CONTROL + "a")
                el.send_keys(Keys.BACKSPACE)
            
            el.send_keys(text)
            
            # Verification: Wait briefly and check if the value is set correctly
            time.sleep(0.3)
            current_val = el.get_attribute("value")
            if current_val != str(text):
                 # Retry once with JS if standard send_keys failed to stick
                 self.driver.execute_script("arguments[0].value = arguments[1];", el, text)
                 self.driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", el)
                 self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", el)

            print(f"[LOG] Typed and verified {description}: '{text}'")
            self.slow_pause(0.5, 0.8)
            return True
        except Exception as e:
            print(f"[DEBUG] Failed to type into '{description}' via standard locator. Error: {type(e).__name__}")
            return self._heal_and_send_keys(text, description)

    def _heal_and_send_keys(self, text, description):
        """Self-healing: Inspect DOM to find and input text into a field matching the description."""
        print(f"[HEALING] Normal locator failed. Inspecting DOM to find input for '{description}'...")
        try:
            inputs = self.driver.find_elements(By.XPATH, "//input | //textarea")
            for el in inputs:
                try:
                    if el.is_displayed():
                        placeholder = el.get_attribute("placeholder") or ""
                        # Heuristic: Check if placeholder resembles the description
                        if placeholder and (description.lower() in placeholder.lower() or placeholder.lower() in description.lower()):
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
                            el.clear()
                            el.send_keys(text)
                            print(f"[HEALING-SUCCESS] Dynamically discovered and typed into '{description}': Placeholder='{placeholder}'")
                            self.slow_pause(0.5, 1.0)
                            return True
                except:
                    continue
        except Exception as e:
             print(f"[HEALING-ERROR] DOM inspection failed: {e}")
             
        print(f"[HEALING-FAILED] Could not auto-discover replacement input for '{description}'.")
        return False

    def wait_for_loading(self):
        """Wait for common ElementUI loading masks and modals to disappear."""
        try:
            # Short timeout check for loading mask and modal overlays
            WebDriverWait(self.driver, 3).until(
                EC.invisibility_of_element_located((By.CLASS_NAME, "el-loading-mask"))
            )
            WebDriverWait(self.driver, 3).until(
                EC.invisibility_of_element_located((By.CLASS_NAME, "v-modal"))
            )
        except TimeoutException:
            pass

    def slow_pause(self, min_s=0.5, max_s=1.2):
        """Used sparingly for animations or specific transition states."""
        time.sleep(random.uniform(min_s, max_s))

    def hover(self, locator):
        el = self.find_visible_element(locator)
        self.actions.move_to_element(el).perform()
