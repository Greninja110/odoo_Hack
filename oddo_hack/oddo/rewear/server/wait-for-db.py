import time
import socket
import sys
import os

# Configuration
db_host = "db"  # Docker service name for MySQL
db_port = 3306
max_retries = 30
retry_interval = 2  # seconds

def check_db_connection():
    """Check if the database is accepting connections"""
    print(f"Checking database connection at {db_host}:{db_port}...")
    
    for i in range(max_retries):
        try:
            # Create a socket connection to check if the port is open
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((db_host, db_port))
            sock.close()
            
            if result == 0:
                print("Database is ready!")
                # Add extra time for MySQL to fully initialize
                print("Waiting an additional 5 seconds for MySQL to fully initialize...")
                time.sleep(5)
                return True
            
            print(f"Attempt {i+1}/{max_retries}: Database not ready yet, waiting {retry_interval} seconds...")
            time.sleep(retry_interval)
        except Exception as e:
            print(f"Error checking database: {e}")
            time.sleep(retry_interval)
    
    print("Failed to connect to database after maximum retries")
    return False

if __name__ == "__main__":
    if not check_db_connection():
        sys.exit(1)
    
    # Make sure the environment variable is correctly set
    if 'DATABASE_URL' in os.environ:
        print(f"Using DATABASE_URL: {os.environ['DATABASE_URL']}")
    else:
        print("WARNING: DATABASE_URL environment variable not set")
    
    sys.exit(0)