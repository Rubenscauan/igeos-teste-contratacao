# Usando a imagem base do OpenJDK
FROM openjdk:17-jdk-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar o JAR do backend
COPY target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

# Expor a porta 8080 (ou a porta que seu backend usa)
EXPOSE 8080

# Comando para rodar a aplicação Spring Boot
CMD ["java", "-jar", "/app/backend.jar"]
