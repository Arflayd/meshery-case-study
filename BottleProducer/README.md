# Bottle producer

Microservice that produces bottles, uses gRPC for communication.

### Environmental variables
* `SERVER_PORT` - gRPC server port, default `8080`
* `BASE_PRODUCTION_TIME_MS` - base (minimum) time for producing a bottle, default `1000`
* `MAX_PRODUCTION_DELAY_MS` - upper bound for additional random production time, default `500`
* `PRODUCTION_FAIL_PROBABILITY` - probability that a production request will throw an exception, default `0.01`

### gRPC model
[Proto file](./src/main/proto/BottleProducer.proto)