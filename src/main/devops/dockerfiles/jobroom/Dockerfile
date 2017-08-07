FROM openjdk:8-jre-alpine

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    SLEEP=0 \
    JAVA_OPTS=""

# add directly the jar
COPY jobroom.war /app.war

EXPOSE 8080 5701/udp
CMD echo "The application will start in ${SLEEP}s..." && \
    sleep ${SLEEP} && \
    java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /app.war
