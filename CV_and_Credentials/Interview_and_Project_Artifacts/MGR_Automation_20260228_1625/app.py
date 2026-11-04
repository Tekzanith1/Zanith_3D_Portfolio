import os
import subprocess
import sys
from flask import Flask, render_template, jsonify, request, Response

app = Flask(__name__)

# Define paths relative to this script
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
TESTS_DIR = os.path.join(PROJECT_ROOT, 'tests')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tests')
def get_tests():
    """Scans the tests directory for python test files."""
    tests = []
    if os.path.exists(TESTS_DIR):
        for f in os.listdir(TESTS_DIR):
            if f.startswith('test_') and f.endswith('.py'):
                tests.append(f)
    return jsonify(tests)

@app.route('/api/run', methods=['POST'])
def run_test():
    """Runs one or more test files using pytest and streams the output."""
    data = request.json
    test_files = data.get('test_files', [])
    # Fallback for single file if provided
    if not test_files and data.get('test_file'):
        test_files = [data.get('test_file')]
        
    target_url = data.get('url', 'https://mgr-uat.dv.vai247.pro/')
    
    if not test_files:
        return jsonify({'error': 'No test files specified'}), 400

    def generate():
        # Prepare environment variables
        env = os.environ.copy()
        env['BASE_URL'] = target_url
        env['KEEP_OPEN'] = 'true'  # Ensure browser stays open for inspection
        
        yield f"Starting Automation Runner...\n"
        yield f"Target URL: {target_url}\n"
        yield f"Selected Tests: {', '.join(test_files)}\n"
        yield "="*50 + "\n\n"

        for test_file in test_files:
            yield f"Running {test_file}...\n"

            
            cmd = [sys.executable, '-m', 'pytest', os.path.join(TESTS_DIR, test_file), '-v', '-s']
            
            # Run pytest and capture output
            process = subprocess.Popen(
                cmd, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT, 
                text=True, 
                cwd=PROJECT_ROOT,
                env=env,
                bufsize=1,
                universal_newlines=True
            )
            
            if process.stdout:
                for line in process.stdout:
                    yield line
            
            process.wait()
            yield f"\nFinished {test_file}\n"
            yield "-"*50 + "\n\n"
            
        yield "All selected tests completed!"

    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    print("Starting MGR Automation Runner at http://localhost:5000")
    app.run(debug=True, port=5000)