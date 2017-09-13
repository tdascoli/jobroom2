FROM jhipster/jhipster-registry:v3.1.0

CMD java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /jhipster-registry.war --spring.cloud.config.server.git.uri=${GIT_URI} --spring.cloud.config.server.git.search-paths=${GIT_SEARCH_PATHS}

