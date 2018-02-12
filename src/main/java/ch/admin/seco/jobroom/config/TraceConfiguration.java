package ch.admin.seco.jobroom.config;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.boot.actuate.trace.Trace;
import org.springframework.boot.actuate.trace.TraceRepository;
import org.springframework.boot.actuate.web.trace.HttpTraceRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TraceConfiguration {

    @Bean
    public TraceRepository traceRepository(HttpTraceRepository httpTraceRepository) {
        return new TraceRepository() {

            @Override
            public List<Trace> findAll() {
                return Collections.emptyList();
            }

            @Override
            public void add(Map<String, Object> traceInfo) {
            }
        };
    }
}
