# ReWear - Community Clothing Exchange Platform Setup Script

Write-Host "Setting up ReWear platform..." -ForegroundColor Green

# Create directory structure
Write-Host "Creating directory structure..." -ForegroundColor Yellow
# Run the PowerShell commands from the earlier section here

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path .\rewear\client
npm install

# Create .env file for client
$clientEnvContent = @"
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
"@
$clientEnvContent | Out-File -FilePath .\.env -Encoding utf8

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path ..\server
python -m pip install -r requirements.txt

# Create .env file for server
$serverEnvContent = @"
FLASK_ENV=development
DATABASE_URL=mysql://rewear:rewear_password@localhost/rewear
JWT_SECRET_KEY=your_jwt_secret_key_here
SECRET_KEY=your_app_secret_key_here
"@
$serverEnvContent | Out-File -FilePath .\.env -Encoding utf8

# Set up database (if MySQL is installed)
Write-Host "Setting up database..." -ForegroundColor Yellow
# This assumes MySQL is installed and configured
# You may need to modify these commands based on your MySQL setup
# mysql -u root -p < ..\database\schema.sql

# Return to root directory
Set-Location -Path ..\..\

Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Start the server: cd rewear/server && flask run" -ForegroundColor Cyan
Write-Host "2. Start the client: cd rewear/client && npm start" -ForegroundColor Cyan
Write-Host "3. Or use Docker: docker-compose -f rewear/docker/docker-compose.yml up" -ForegroundColor Cyan