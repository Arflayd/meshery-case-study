

import winston from 'winston';
import * as grpc from '@grpc/grpc-js';
import {
    BottleProducerServiceClient as BottleApiClient
} from '../../proto/bottle/bottle_grpc_pb';

import { 
    DrinkApiClient
} from '../../proto/drink/drink_grpc_pb';
import { BottleProduceRequest } from '../../proto/bottle/bottle_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

(() => {
    const bottleClient = new BottleApiClient('bottles:3002', grpc.credentials.createInsecure() );
    const drinkClient = new DrinkApiClient('drinks:3001', grpc.credentials.createInsecure() );
    const express = require('express')
    const app = express()
    const port = 3000

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.Console(),
        ]
      });

    const getBottle = async () => {
        return new Promise( (resolve, reject) => {
            const bottleProduceRequest = new BottleProduceRequest();
            bottleClient.produceBottle(bottleProduceRequest, (error, message) => {
                if (error) {
                    logger.log('error',"getBottle")
                    reject(error)
                }
                logger.log('info', message)
                resolve(message);
            });
        })
    }

    const getDrink = async () => {
        return new Promise( (resolve, reject) => {
            drinkClient.getDrink( new Empty() , (error, message) => {
                if (error) {
                    reject(error)
                }
                logger.log('info', message)
                resolve(message);
            });
        })
    }
    
    app.use(express.json())
    app.post('/api', async (req, res) => {
        let number = req.body.number;
        if (!number) {
            number = 10;
        }

        let fail = 0;

        for (let i = 0; i < number; i++) {
            try {
                await getDrink();
            } catch (err) {
                logger.log('error', 'getDrink' + err)
                fail += 1;
            }

            try {
                await getBottle();
            } catch (err) {
                logger.log('error',  'getBottle' + err)
                fail += 1;
            }
        }

        res.send({
            succes: number - fail,
            fail
        })
    })
    
    app.listen(port, () => {
        logger.log('info', `HTTP server started on port 3000`);
    })
})()
