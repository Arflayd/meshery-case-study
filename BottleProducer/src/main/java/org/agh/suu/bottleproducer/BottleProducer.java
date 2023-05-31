package org.agh.suu.bottleproducer;

import com.google.protobuf.Timestamp;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.agh.suu.proto.Bottle;
import org.agh.suu.proto.BottleProduceRequest;
import org.agh.suu.proto.BottleProducerServiceGrpc.BottleProducerServiceImplBase;

import java.time.Instant;
import java.util.Random;
import java.util.UUID;

@Slf4j
public class BottleProducer extends BottleProducerServiceImplBase {

    private final int baseProductionTimeMs;
    private final int maxProductionDelayMs;
    private final double productionFailProbability;

    public BottleProducer(int baseProductionTimeMs, int maxProductionDelayMs, double productionFailProbability) {
        this.baseProductionTimeMs = baseProductionTimeMs;
        this.maxProductionDelayMs = maxProductionDelayMs;
        this.productionFailProbability = productionFailProbability;
    }

    @Override
    public void produceBottle(BottleProduceRequest request, StreamObserver<Bottle> responseObserver) {

        log.info("Received request {}", request.getRequestId());

        try {
            Thread.sleep(baseProductionTimeMs + new Random().nextInt(maxProductionDelayMs));
        } catch (InterruptedException e) {
            log.error("Producer was interrupted during request {}", request.getRequestId());
            throw new RuntimeException("Producer was interrupted");
        }

        if (new Random().nextDouble() < productionFailProbability) {
            log.error("Production failed unexpectedly for request {}", request.getRequestId());
            throw new RuntimeException("Production failed unexpectedly");
        }

        Bottle bottle = Bottle.newBuilder()
                .setRequestId(request.getRequestId())
                .setTimestamp(Timestamp.newBuilder().setSeconds(Instant.now().getEpochSecond()).build())
                .setBottleSerialNumber(UUID.randomUUID().toString())
                .build();

        log.info("Production completed for request {}", request.getRequestId());

        responseObserver.onNext(bottle);
        responseObserver.onCompleted();
    }
}
