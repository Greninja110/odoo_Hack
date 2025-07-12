import os
import pymysql
import time

# Force PyMySQL
pymysql.install_as_MySQLdb()

from flask import Flask
from config.database import db

def create_db_tables():
    """Create database tables if they don't exist"""
    print("Creating database connection with PyMySQL...")
    
    # Create a Flask app
    app = Flask(__name__)
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://rewear:rewear_password@db:3306/rewear'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    with app.app_context():
        try:
            print("Creating all database tables...")
            db.create_all()
            print("Database tables created successfully!")
            return True
        except Exception as e:
            print(f"Error creating database tables: {str(e)}")
            return False

if __name__ == "__main__":
    # Wait for database to be ready
    max_retries = 30
    retry_interval = 2
    
    for i in range(max_retries):
        try:
            # Try to connect to the database
            conn = pymysql.connect(
                host='db',
                user='rewear',
                password='rewear_password',
                database='rewear'
            )
            conn.close()
            print("Database connection successful!")
            break
        except Exception as e:
            print(f"Attempt {i+1}/{max_retries}: Database not ready yet: {str(e)}")
            time.sleep(retry_interval)
    else:
        print("Failed to connect to database after maximum retries")
        exit(1)
    
    # Wait additional time for MySQL to fully initialize
    print("Waiting 5 seconds for MySQL to fully initialize...")
    time.sleep(5)
    
    # Create tables
    if not create_db_tables():
        exit(1)