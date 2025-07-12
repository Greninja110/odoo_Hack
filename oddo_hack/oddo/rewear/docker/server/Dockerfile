FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install additional dependencies
RUN pip install --no-cache-dir eventlet>=0.24.1

RUN pip install --no-cache-dir pymysql cryptography

# Copy the rest of the application
COPY . .

# Create upload and logs directories
RUN mkdir -p uploads/profile_images uploads/items logs

# Fix Flask issues directly in the Dockerfile
RUN sed -i 's/@app.before_first_request/# @app.before_first_request/g' /app/app.py \
    && sed -i '/# @app.before_first_request/a with app.app_context():\\n    db.create_all()' /app/app.py \
    && sed -i '/def admin_required(fn):/a\ \ \ \ from functools import wraps' /app/auth/jwt_handler.py \
    && sed -i '/def wrapper/i\ \ \ \ @wraps(fn)' /app/auth/jwt_handler.py

# Expose port
EXPOSE 5000

# Run the application with a simpler command
CMD ["python", "app.py"]