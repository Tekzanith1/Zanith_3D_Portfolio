# MGR Automation Readjusted

This project contains automation scripts for testing the MGR platform.

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.7+**: [Download and Install Python](https://www.python.org/downloads/)
- **Microsoft Edge**: Ensure Microsoft Edge is installed on your system.

### 2. Installation
Double-click `setup_everything.bat` to automatically install everything needed:
- Python 3.12
- Node.js LTS
- Visual Studio Code and its Python extensions
- Python libraries required for this project (`requirements.txt`)

*Note: The script will ask for Administrator permissions to install the system applications.*

Alternatively, if you already have Python installed, you can just install the libraries by running:
```bash
python -m pip install -r requirements.txt
```

### 3. Configuration
- Ensure `.env` is properly configured with your credentials (`MGR_USERNAME`, `MGR_PASSWORD`).
- `msedgedriver.exe` is already included. If your Microsoft Edge version updates and the script fails, you'll need to download a matching driver from the [Microsoft Edge WebDriver site](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) and replace the existing `msedgedriver.exe`.

### 4. Running the Automation
To run the full workflow, use:
```bash
python master_workflow.py
```

To run tests using `pytest`:
```bash
pytest tests/
```

## 📁 Project Structure
- `master_workflow.py`: Main entry point for the automation.
- `pages/`: Page Object Model (POM) files.
- `tests/`: Pytest test cases.
- `utils.py`: Helper functions (e.g., driver initialization, certificate policy).
- `config.py`: Configuration and environment variable loading.
