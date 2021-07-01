var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var mqtt = require('mqtt');

// Your Channel access token (long-lived) 
const CH_ACCESS_TOKEN = 'VhC7qpsC9Op/QN1MDc61EGAN5Jqiq2fl5RlyzGZjVJr0CnZE7gs2G52HOt9pWPEzFYvY74eRqzC939lWERLSxYZk1uaFMSQpy0v92hjZfVvyFoOX9VzMSAULznGrP5sa5wE+viP8gkG2d939jxiV3QdB04t89/1O/w1cDnyilFU=';

// MQTT Host
var mqtt_host = 'mqtt://soldier.cloudmqtt.com';

// MQTT Topic
var mqtt_topic = '/ESP/LED';

// MQTT Config
var options = {
    port: 10174,
    host: 'mqtt://soldier.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'brdhfcif',
    password: 'gviTCGqRHgB9',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};


app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
  var text = req.body.events[0].message.text.toLowerCase()
  var sender = req.body.events[0].source.userId
  var replyToken = req.body.events[0].replyToken
  console.log(text, sender, replyToken)
  console.log(typeof sender, typeof text)
  // console.log(req.body.events[0])

  if (text === '1' || text === 'เปิด' || text === 'relay1_on') {
    // LED On
    ledOn(sender, text)
  }
  else if (text === '0' || text === 'ปิด' || text === 'relay1_off') {
    // LED Off
    ledOff(sender, text)
  }
  else {
    // Other
    sendText(sender, text);
  }

  res.sendStatus(200)
})

function sendText (sender, text) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'กรุณาพิมพ์ : on | off | เปิด | ปิด เท่านั้น'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}

function inFo (sender, text) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'uid: '+sender
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}


function ledOn (sender, text) {
  var client = mqtt.connect(mqtt_host, options);
  client.on('connect', function() { // When connected
      console.log('MQTT connected');
      // subscribe to a topic
      client.subscribe(mqtt_topic, function() {
          // when a message arrives, do something with it
          client.on('message', function(topic, message, packet) {
              console.log("Received '" + message + "' on '" + topic + "'");
          });
      });
      

      // publish a message to a topic
      client.publish(mqtt_topic, 'relay1_on', function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
      });
      
  });
    

  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'เปิดประตูแล้วครับ'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}

function ledOff (sender, text) {
  var client = mqtt.connect(mqtt_host, options);
  client.on('connect', function() { // When connected
      console.log('MQTT connected');
      // subscribe to a topic
      client.subscribe(mqtt_topic, function() {
          // when a message arrives, do something with it
          client.on('message', function(topic, message, packet) {
              console.log("Received '" + message + "' on '" + topic + "'");
          });
      });
      

      // publish a message to a topic
      client.publish(mqtt_topic, 'relay1_ff', function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
      });
      
  });

  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'ปิดประตูแล้วครับ'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})