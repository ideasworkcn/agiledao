sudo lsof -i :8080
fuser -k 8080/tcp
sudo nohup  java -jar scrum-0.0.1-SNAPSHOT.jar \
    --spring.datasource.url="jdbc:mysql://localhost:3306/agiledao?useSSL=false&serverTimezone=UTC" \
    --spring.datasource.username=root \
    --spring.datasource.password=agiledao  > backend.log 2>&1 &