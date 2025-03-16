# Usando a imagem do OpenJDK
FROM openjdk:17-jdk-alpine

# Diretório de trabalho no container
WORKDIR /app

# Instalar Maven no container
RUN apk add --no-cache maven

# Copiar o pom.xml para o container (para que o Maven possa resolver dependências antes de copiar o código-fonte)
COPY pom.xml /app/

# Rodar o Maven para resolver as dependências
RUN mvn clean install -Dmaven.test.skip=true

# Copiar o código do backend
COPY src /app/src

# Empacotar o JAR após a compilação
RUN mvn package -Dmaven.test.skip=true

# Expor a porta 8080
EXPOSE 8080

# Rodar a aplicação Spring Boot
CMD ["java", "-jar", "/app/target/backend-0.0.1-SNAPSHOT.jar"]
