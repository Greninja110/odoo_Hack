#!/bin/bash
# Script to fix common issues in Flask app

# Fix 1: Replace @app.before_first_request with app context
sed -i 's/@app.before_first_request/# @app.before_first_request/g' /app/app.py
sed -i '/# @app.before_first_request/a with app.app_context():\\n    db.create_all()' /app/app.py

# Fix 2: Add @wraps to admin_required decorator in jwt_handler.py
sed -i '/def admin_required(fn):/a\ \ \ \ from functools import wraps' /app/auth/jwt_handler.py
sed -i '/def wrapper/i\ \ \ \ @wraps(fn)' /app/auth/jwt_handler.py

# Fix 3: Fix schema.sql with backticks for condition keyword
if [ -f /docker-entrypoint-initdb.d/schema.sql ]; then
    sed -i 's/condition VARCHAR/`condition` VARCHAR/g' /docker-entrypoint-initdb.d/schema.sql
fi

echo "Fixed common Flask issues"