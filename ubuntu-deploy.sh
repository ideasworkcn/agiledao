#!/bin/bash

# Update system packages
sudo apt update
sudo apt upgrade -y

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js 18.x..."
    sudo apt install -y curl
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js is already installed."
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null
then
    echo "MySQL not found. Installing MySQL 8.0..."
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    # Set MySQL root password and secure the installation
    MYSQL_ROOT_PASSWORD="agiledao"
    sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
    sudo mysql -e "DELETE FROM mysql.user WHERE User='';"
    sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
    sudo mysql -e "DROP DATABASE IF EXISTS test;"
    sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
    sudo mysql -e "FLUSH PRIVILEGES;"
    # Create database
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS agiledao;"
    echo "Database 'agiledao' has been created."
else
    echo "MySQL is already installed."
       # Create database
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS agiledao;"
    echo "Database 'agiledao' has been created."
fi

# Check if Java is installed
if ! command -v java &> /dev/null
then
    echo "Java not found. Installing JDK 11..."
    sudo apt install -y openjdk-11-jdk
else
    echo "Java is already installed."
fi

# Check if NGINX is installed
if ! command -v nginx &> /dev/null
then
    echo "NGINX not found. Installing NGINX..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "NGINX is already installed."
fi

# Check if Git is installed
if ! command -v git &> /dev/null
then
    echo "Git not found. Installing Git..."
    sudo apt install -y git
else
    echo "Git is already installed."
fi

# Print installed versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "MySQL version: $(mysql --version)"
echo "Java version: $(java -version 2>&1 | awk -F '"' '/version/ {print $2}')"
echo "NGINX version: $(nginx -v 2>&1)"
echo "Git version: $(git --version)"

echo "Installation check complete!"

# Check if the repository already exists
if [ ! -d "agiledao" ]; then
    echo "Cloning the repository..."
    git clone https://gitee.com/ideaswork/agiledao.git
else
    echo "Repository already exists. Updating..."
    cd agiledao
    git pull
    cd ..
fi

cd agiledao/scrum-frontend

if [ ! -f package.json ]; then
    echo "Error: package.json not found. Make sure you're in the correct directory."
    exit 1
fi

npm install

if grep -q '"build"' package.json; then
    rm -rf .next/
    npm run build
else
    echo "No build script found in package.json, skipping build step."
fi

# Kill any existing npm processes
sudo fuser -k 3000/tcp

if grep -q '"start"' package.json; then
    # Wait a moment to ensure processes are terminated
    sleep 2
    
    # Start the new process
    nohup npm run start > npm_start.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
fi

echo "Repository updated and project set up successfully!"

# Start backend service
cd ../scrum-service
nohup sudo java -jar scrum-0.0.1-SNAPSHOT.jar \
    --spring.datasource.url="jdbc:mysql://localhost:3306/agiledao?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
    --spring.datasource.username=root \
    --spring.datasource.password=agiledao  > backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend service started with PID: $BACKEND_PID"

# Configure NGINX
if [ ! -f /etc/nginx/sites-available/agiledao ]; then
    echo "Configuring NGINX..."
    sudo tee /etc/nginx/sites-available/agiledao > /dev/null <<EOL
server {
    listen 80;
    server_name scrum.ideaswork.cn;

    location /service/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

    # Remove the default NGINX configuration if it exists
    sudo rm -f /etc/nginx/sites-enabled/default

    # Create symbolic link for our configuration
    sudo ln -s /etc/nginx/sites-available/agiledao /etc/nginx/sites-enabled/

    # Test NGINX configuration
    sudo nginx -t

    # Restart NGINX service
    sudo systemctl restart nginx

    echo "NGINX configuration updated and service restarted."
else
    echo "NGINX configuration for agiledao already exists."
       # Test NGINX configuration
    sudo nginx -t

    # Restart NGINX service
    sudo systemctl restart nginx
fi

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null
then
    echo "Frontend is running."
else
    echo "Frontend is not running. Please check the logs for errors."
fi

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null
then
    echo "Backend is running."
else
    echo "Backend is not running. Please check the logs for errors."
fi

# Check if NGINX is running
if sudo systemctl is-active --quiet nginx
then
    echo "NGINX is running."
else
    echo "NGINX is not running. Please check the logs for errors."
fi

# Test frontend connection
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
then
    echo "Frontend is accessible."
else
    echo "Cannot access frontend. Please check the application and NGINX configuration."
fi

# Test backend connection
if curl -s -o /dev/null -w "%{http_code}" http://localhost/service/ping
then
    echo "Backend is accessible."
else
    echo "Cannot access backend. Please check the application and NGINX configuration."
fi

echo "Deployment and checks completed."
