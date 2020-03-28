import * as aws from "aws-sdk";
import {PutRecordInput} from "aws-sdk/clients/kinesis";
import kinesisConstant from "./kinesisConstants";
import _ from 'lodash';


const obj = require('./data.json'); // test data

const kinesis: AWS.Kinesis = new aws.Kinesis({
    apiVersion: kinesisConstant.API_VERSION,
    region: kinesisConstant.REGION,
});



(async (): Promise<string | void> => {
    /* 
    / 
    FILTER obj

    */

    const paramData: string = JSON.stringify(obj);

    // Create the Amazon Kinesis record
    const params: PutRecordInput = {
        Data: paramData,
        PartitionKey: kinesisConstant.PARTITION_KEY,
        StreamName: kinesisConstant.STREAM_NAME,
    };

    await kinesis.putRecord(params, (err, data) => {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log("SequenceNumber: ", data.SequenceNumber); // successful response
    });
})();
