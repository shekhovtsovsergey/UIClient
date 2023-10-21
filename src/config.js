export default {
  host: `http://${window.location.hostname}:8080`,
  keycloakSettings: {
    url: `http://${window.location.hostname}:8180/auth`,
    realm: 'Otus-Spring-Diploma',
    clientId: 'otus-spring-diploma-client'
  }
}