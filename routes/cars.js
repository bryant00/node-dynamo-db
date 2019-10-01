var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();

router.get("/", function(req, res) {
  var params = {
    TableName: "Cars",
    ProjectionExpression:
      "#id, #name, #type, #manufacturer, #fuel_type, #description",
    ExpressionAttributeNames: {
      "#id": "id",
      "#name": "name",
      "#type": "type",
      "#manufacturer": "manufacturer",
      "#fuel_type": "fuel_type",
      "#description": "description"
    }
  };
  docClient.scan(params, onScan);
  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      res.send(data);
      // data.Items.forEach(function(car) {
      //   console.log(car.id, car.type, car.name);
      // });
      if (typeof data.LastEvaluatedKey != "undefined") {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
});

router.put("/", function(req, res, next) {
  const car = req.body;
  var params = {
    TableName: "Cars",
    Item: {
      id: car.id,
      type: car.type,
      name: car.name,
      manufacturer: car.manufacturer,
      fuel_type: car.fuel_type,
      description: car.description
    }
  };
  docClient.put(params, function(err, data) {
    if (err) {
      res.status(402).send(JSON.stringify(err, null, 2));
    } else {
      res.status(200).send(data);
    }
  });
});

router.get("/:id", function(req, res) {
  var carID = parseInt(req.params.id);
  var params = {
    TableName: "Cars",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": carID
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      res.send(data.Items);
      data.Items.forEach(function(car) {
        console.log(car.id, car.name, car.type);
      });
    }
  });
});

module.exports = router;
