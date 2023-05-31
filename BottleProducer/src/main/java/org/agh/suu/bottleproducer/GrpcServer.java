package org.agh.suu.bottleproducer;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class GrpcServer {

    @Value("${server.port}")
    private int port;
    @Value("${producer.base-production-time-ms}")
    private int baseProductionTimeMs;
    @Value("${producer.max-production-delay-ms}")
    private int maxProductionDelayMs;
    @Value("${producer.production-fail-probability}")
    private double productionFailProbability;

    @EventListener(ApplicationReadyEvent.class)
    public void startServer() throws IOException, InterruptedException {

        log.info("Starting gRPC server");

        BottleProducer bottleProducer = new BottleProducer(
                baseProductionTimeMs,
                maxProductionDelayMs,
                productionFailProbability
        );

        Server server = ServerBuilder
                .forPort(port)
                .addService(bottleProducer).build();

        server.start();

        log.info("Server started on port {}", port);
        server.awaitTermination();
    }
}
