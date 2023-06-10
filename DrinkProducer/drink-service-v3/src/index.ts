
import winston from 'winston';
import { Server, ServerCredentials, ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';

import { DrinkApiService, IDrinkApiServer } from '../../proto/drink/drink_grpc_pb';

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Drink } from '../../proto/drink/drink_pb';
import { createHash } from 'crypto';

const drink_types = ["orange juice", "apple juice", "tea", "coffee",
 "cola","milk","water","lemonade", "mineral water", "sparkling water" ]

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ]
});

const additionalWork = (min, max) => {
  const iterations = Math.random() * (max - min) + min;

  for( let i = 0 ; i < iterations; i++) 
    Buffer.from(createHash('sha256').update(`bacon${i}`).digest('hex')).toString('base64');
}

const exampleServer : IDrinkApiServer  = {

  getDrink(
    call: grpc.ServerUnaryCall<Empty, Drink>,
    callback: grpc.sendUnaryData<Drink>
  ) {
    const drink = new Drink();
    drink.setTaste(drink_types[Math.floor(Math.random() * 10)]);

    additionalWork(250,500);
    if(Math.random() < 0.15){
      const error = new Error("Drink service error!");
      callback(error,null);
    }
    callback(null,drink);
    
  }
  
};

(async () => {
  const server = new Server();
  server.addService(  DrinkApiService,  exampleServer)
  server.bindAsync('0.0.0.0:3001', ServerCredentials.createInsecure(), (err) => {
      if (err) console.log(err);
      server.start();
      logger.log('info', `gRPC server started on port 3001`);
  });
})()
