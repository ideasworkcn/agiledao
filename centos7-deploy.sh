#!/bin/bash

# Update system packages
yum update -y

# Install Node.js 18.x
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install MySQL 8.0
rpm -Uvh https://repo.mysql.com/mysql80-community-release-el7-3.noarch.rpm
sed -i 's/enabled=1/enabled=0/' /etc/yum.repos.d/mysql-community.repo
yum --enablerepo=mysql80-community install -y mysql-community-server

# Install JDK 11
yum install -y java-11-openjdk-devel

# Install NGINX
yum install -y epel-release
yum install -y nginx

# Install Git
yum install -y git

# Start and enable services
systemctl start mysqld
systemctl enable mysqld
systemctl start nginx
systemctl enable nginx

# Set default MySQL password
MYSQL_TEMP_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')
MYSQL_NEW_PASSWORD="scrum"  # Change this to your desired password

mysql --connect-expired-password -u root -p"${MYSQL_TEMP_PASSWORD}" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_NEW_PASSWORD}';
FLUSH PRIVILEGES;
EOF

echo "MySQL root password has been set to: ${MYSQL_NEW_PASSWORD}"

# Print installed versions
echo "Node.js version: $(node -v)"
echo "MySQL version: $(mysql --version)"
echo "Java version: $(java -version 2>&1 | awk -F '"' '/version/ {print $2}')"
echo "NGINX version: $(nginx -v 2>&1)"
echo "Git version: $(git --version)"

echo "Installation complete!"

# Clone the repository
git clone https://gitee.com/ideaswork/agiledao.git

# Navigate to the project directory
cd agiledao/scrum-frontend

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "Error: package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Install project dependencies
npm install

# Check if build script exists in package.json
if grep -q '"build"' package.json; then
    npm run build
else
    echo "No build script found in package.json, skipping build step."
fi

# Check if start script exists in package.json
if grep -q '"start"' package.json; then
    npm run start &
else
    echo "No start script found in package.json. Please start the application manually."
fi

echo "Repository cloned and project set up successfully!"

# Configure NGINX
cat > /etc/nginx/nginx.conf <<EOL
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server localhost:8080;
    }

    upstream frontend {
        server localhost:3000;
    }

    server {
        listen 80;
        server_name scrum.ideaswork.cn;

        # Add CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        location /service/ {
            proxy_pass http://backend/;
            
            # Handle OPTIONS method for CORS preflight requests
            if (\$request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=utf-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location / {
            try_files \$uri \$uri/ /index.html;
        }
    }
}
EOL

# Restart NGINX to apply the new configuration
systemctl restart nginx

echo "NGINX configuration updated and service restarted."
