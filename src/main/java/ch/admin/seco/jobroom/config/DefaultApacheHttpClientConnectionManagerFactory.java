package ch.admin.seco.jobroom.config;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;

import org.springframework.cloud.commons.httpclient.ApacheHttpClientConnectionManagerFactory;

/**
 * Default implementation of {@link ApacheHttpClientConnectionManagerFactory}.
 * @author Ryan Baxter
 */
public class DefaultApacheHttpClientConnectionManagerFactory
    implements ApacheHttpClientConnectionManagerFactory {

    private static final Log LOG = LogFactory
        .getLog(org.springframework.cloud.commons.httpclient.DefaultApacheHttpClientConnectionManagerFactory.class);

    public HttpClientConnectionManager newConnectionManager(boolean disableSslValidation,
        int maxTotalConnections, int maxConnectionsPerRoute) {
        return newConnectionManager(disableSslValidation, maxTotalConnections,
            maxConnectionsPerRoute, -1, TimeUnit.MILLISECONDS, null);
    }

    @Override
    public HttpClientConnectionManager newConnectionManager(boolean disableSslValidation,
        int maxTotalConnections, int maxConnectionsPerRoute, long timeToLive,
        TimeUnit timeUnit, RegistryBuilder registryBuilder) {
        if (registryBuilder == null) {
            registryBuilder = RegistryBuilder.<ConnectionSocketFactory>create()
                .register(HTTP_SCHEME, PlainConnectionSocketFactory.INSTANCE);
        }
        try {
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            if (disableSslValidation) {
                sslContext.init(null, new TrustManager[] {new DisabledValidationTrustManager()}, new SecureRandom());
                registryBuilder.register(HTTPS_SCHEME, new SSLConnectionSocketFactory(
                    sslContext, NoopHostnameVerifier.INSTANCE));
            } else {
                sslContext.init(null, null, new SecureRandom());
                registryBuilder.register(HTTPS_SCHEME, new SSLConnectionSocketFactory(sslContext));
            }
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            LOG.warn("Error creating SSLContext", e);
        }
        final Registry<ConnectionSocketFactory> registry = registryBuilder.build();

        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(
            registry, null, null, null, timeToLive, timeUnit);
        connectionManager.setMaxTotal(maxTotalConnections);
        connectionManager.setDefaultMaxPerRoute(maxConnectionsPerRoute);

        return connectionManager;
    }

    class DisabledValidationTrustManager implements X509TrustManager {
        @Override
        public void checkClientTrusted(X509Certificate[] x509Certificates,
            String s) throws CertificateException {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] x509Certificates,
            String s) throws CertificateException {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return null;
        }
    }
}
