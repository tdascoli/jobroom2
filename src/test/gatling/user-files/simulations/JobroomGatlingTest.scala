import _root_.io.gatling.core.scenario.Simulation
import ch.qos.logback.classic.{Level, LoggerContext}
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.slf4j.LoggerFactory

import scala.concurrent.duration._

class JobroomGatlingTest extends Simulation {

    val context: LoggerContext = LoggerFactory.getILoggerFactory.asInstanceOf[LoggerContext]
    // Log all HTTP requests
    //context.getLogger("io.gatling.http").setLevel(Level.valueOf("TRACE"))
    // Log failed HTTP requests
    //context.getLogger("io.gatling.http").setLevel(Level.valueOf("DEBUG"))

    val baseURL = Option(System.getProperty("baseURL")) orElse Option(System.getenv("baseURL")) getOrElse """http://127.0.0.1:8080"""

    val httpConf = http
        .baseURL(baseURL)
        .inferHtmlResources()
        .acceptHeader("*/*")
        .acceptEncodingHeader("gzip, deflate")
        .acceptLanguageHeader("fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3")
        .connectionHeader("keep-alive")
        .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0")

    val headers_http = Map(
        "Accept" -> """application/json""",
        "Cookie" -> """NG_TRANSLATE_LANG_KEY=de"""
    )

    val headers_http_authentication = Map(
        "Content-Type" -> """application/json""",
        "Accept" -> """application/json""",
        "Cookie" -> """NG_TRANSLATE_LANG_KEY=de"""
    )

    val headers_http_authenticated = Map(
        "Accept" -> """application/json""",
        "Authorization" -> "${access_token}",
        "Cookie" -> """NG_TRANSLATE_LANG_KEY=de"""
    )

    def resolveOccupationLabel(codeType: String, code: String) = {
        http(s"Resolve OccupationLabel by $codeType")
            .get(s"/referenceservice/api/occupations/label/$codeType/$code")
            .headers(headers_http_authenticated)
            .check(status.is(200))
    }

    val occupationFeeder = csv("occupations.csv").random

    val scn = scenario("Test the Jobroom workflow")
        .exec(http("First unauthenticated request")
            .get("/api/account")
            .headers(headers_http)
            .check(status.is(401))).exitHereIfFailed
        .pause(2)
        .exec(http("Authentication")
            .post("/api/authenticate")
            .headers(headers_http_authentication)
            .body(StringBody("""{"username":"admin", "password":"admin"}""")).asJSON
            .check(header.get("Authorization").saveAs("access_token"))).exitHereIfFailed
        .pause(1)
        .exec(http("Authenticated request")
            .get("/api/account")
            .headers(headers_http_authenticated)
            .check(status.is(200)))
        .repeat(5)(OccupationSearch.executeOccupationLabelSuggest())
        .repeat(2)(LocalitySearch.execute())
        .repeat(2)(OccupationSearch.executeResolveOccupationLabel())
        .repeat(10)(CandidateSearch.execute())
        .repeat(3)(PEADashboard.execute())
        .repeat(2)(LocalitySearch.execute())
        .repeat(10)(JobSearch.execute())

    val users = scenario("Users").exec(scn)

    setUp(
        users.inject(rampUsers(Integer.getInteger("users", 1)) over (Integer.getInteger("ramp", 1) minutes))
    ).protocols(httpConf)
}

object OccupationSearch {

    val occupationFeeder = csv("occupations.csv").random

    val occupationLabelFeeder = Array(
        Map("occupationLabelPrefix" -> "java"),
        Map("occupationLabelPrefix" -> "beamt"),
        Map("occupationLabelPrefix" -> "maur"),
        Map("occupationLabelPrefix" -> "software"),
        Map("occupationLabelPrefix" -> "poliz")
    ).random

    def suggestOccupationLabel(prefix: String) = {
        http(s"Suggest OccupationLabel by prefix")
            .get("/referenceservice/api/_search/occupations/label")
            .queryParam("prefix", prefix)
            .queryParam("types", "x28,sbn3,sbn")
            .queryParam("resultSize", "10")
            .check(status.is(200))
    }

    def executeOccupationLabelSuggest() = {
        feed(occupationLabelFeeder).exec(suggestOccupationLabel("${occupationLabelPrefix}"))
    }

    def resolveOccupationLabel(codeType: String, code: String) = {
        http(s"Resolve OccupationLabel by $codeType")
            .get(s"/referenceservice/api/occupations/label/$codeType/$code")
            .check(status.is(200))
    }

    def executeResolveOccupationLabel() = {
        feed(occupationFeeder)
            .exec(resolveOccupationLabel("x28", "${x28}"))
            .exec(resolveOccupationLabel("avam", "${avam}"))
            .exec(resolveOccupationLabel("sbf", "${sbf}"))
    }
}

object LocalitySearch {

    val locationFeeder = Array(
        Map("locationPrefix" -> "stel", "zipCode" -> "7226", "latitude" -> "47.012", "longitude" -> "9.79"),
        Map("locationPrefix" -> "gerol", "zipCode" -> "2575", "latitude" -> "47.08", "longitude" -> "7.212"),
        Map("locationPrefix" -> "daenik", "zipCode" -> "4658", "latitude" -> "47.358", "longitude" -> "7.965"),
        Map("locationPrefix" -> "Otto", "zipCode" -> "8561", "latitude" -> "47.593", "longitude" -> "9.091"),
        Map("locationPrefix" -> "Kiesen", "zipCode" -> "3629", "latitude" -> "46.811", "longitude" -> "9.078"),
        Map("locationPrefix" -> "Zueri", "zipCode" -> "8048", "latitude" -> "47.379", "longitude" -> "8.474"),
        Map("locationPrefix" -> "Drei", "zipCode" -> "9612", "latitude" -> "47.389", "longitude" -> "9.012"),
        Map("locationPrefix" -> "Muehleh", "zipCode" -> "8874", "latitude" -> "47.12", "longitude" -> "9.18")
    ).random

    def suggestLocalities(prefix: String) = {
        http("Suggest Locality")
            .get("/referenceservice/api/_search/localities")
            .queryParam("prefix", prefix)
            .queryParam("resultSize", "10")
            .check(status.is(200))
    }

    def findNearestLocality(latitude: String, longitude: String) = {
        http("Search for nearest locality")
            .get("/referenceservice/api/_search/localities/nearest")
            .queryParam("latitude", latitude)
            .queryParam("longitude", longitude)
            .check(status.is(200))
    }

    def execute() = {
        feed(locationFeeder)
            .exec(suggestLocalities("${locationPrefix}"))
            .repeat(2) {
                feed(locationFeeder).exec(findNearestLocality("${latitude}", "${longitude}"))
            }
    }
}

object CandidateSearch {
    def countCandidates() = {
        http("Count Candidates")
            .post("/candidateservice/api/_count/candidates")
            .body(StringBody("""{}""")).asJSON
            .check(status.is(200))
    }

    def searchCandidates() = {
        val index = scala.util.Random.nextInt(20)
        http("Search Candidates")
            .post("/candidateservice/api/_search/candidates")
            .body(StringBody("""{}""")).asJSON
            .queryParam("page", 0)
            .queryParam("size", 20)
            .check(status.is(200))
            .check(jsonPath(s"$$[$index].id").ofType[String].saveAs("candidateId"))
    }

    def getCandidate() = {
        http("Get Candidate")
            .get("/candidateservice/api/candidates/profiles/${candidateId}")
            .check(jsonPath("$.jobCenterCode").ofType[String].saveAs("jobCenterCode"))
            .check(status.is(200))
    }

    def getJobCenterData() = {
        http("Get Job center")
            .get("/referenceservice/api/job-centers?code=${jobCenterCode}&language=en")
            .check(status.is(200))
    }

    def getProtectedData() = {
        http("Get Protected data")
            .get("/candidateservice/api/candidates/${candidateId}")
            .check(status.in(200, 403))
    }

    def execute() = {
        exec(countCandidates())
            .exec(searchCandidates())
            .exec(getCandidate())
            .exec(getProtectedData())
            .exec(getJobCenterData())
    }
}

object PEADashboard {

    private val login = System.getProperty("login")
    private val password = System.getProperty("password")
    private val email = System.getProperty("email")

    private val headers_http_authenticated = Map("Authorization" -> "${agent_token}")

    def login() = {
        http("Authentication")
            .post("/api/authenticate")
            .body(StringBody(s"""{"username":"$login", "password":"$password"}""")).asJSON
            .check(header.get("Authorization").saveAs("agent_token"))
    }

    def loadJobPublications() = {
        val index = scala.util.Random.nextInt(20)
        http("Search Job Publications")
            .post("/jobpublicationservice/api/_search/jobPublications")
            .headers(headers_http_authenticated)
            .body(StringBody(s"""{"email":"$email"}""")).asJSON
            .queryParam("page", 0)
            .queryParam("size", 20)
            .check(status.is(200))
            .check(jsonPath(s"$$[$index].id").ofType[String].saveAs("jobPublicationId"))
            .check(jsonPath(s"$$[$index].accessToken").ofType[String].saveAs("jobPublicationAccessToken"))
    }

    def loadJobPublicationDetails() = {
        http("Load Job Publication Details")
            .get("/jobpublicationservice/api/jobPublications/${jobPublicationId}")
            .queryParam("accessToken", "${jobPublicationAccessToken}")
            .headers(headers_http_authenticated)
            .check(status.is(200))
    }

    def execute() = {
        exec(login())
            .exec(loadJobPublications())
            .exec(loadJobPublicationDetails())
    }
}

object JobSearch {

    def countJobs() = {
        http("Count Jobs")
            .post("/jobservice/api/_count/jobs")
            .body(StringBody("""{}""")).asJSON
            .check(status.is(200))
    }

    def searchJobs() = {
        val index = scala.util.Random.nextInt(20)
        http("Search jobs")
            .post("/jobservice/api/_search/jobs")
            .body(StringBody("""{}""")).asJSON
            .queryParam("page", 0)
            .queryParam("size", 20)
            .queryParam("language", "en")
            .check(status.is(200))
            .check(jsonPath(s"$$[$index].id").ofType[String].saveAs("jobId"))
    }

    def getJob() = {
        http("Get Job")
          .get("/jobservice/api/jobs/${jobId}")
          .check(status.is(200))
    }

    def execute() = {
        exec(countJobs())
            .exec(searchJobs())
            .exec(getJob())
    }
}
