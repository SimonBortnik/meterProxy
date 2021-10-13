const http = require('http')
const httpProxy = require('http-proxy')
const mqtt = require('mqtt')

const MQTT_PI = 'http://192.168.1.8:1883'
const TARGET = {
  host: 'localhost',
  port: 9090,
  ws: true
}

//
// Proxy
//

// Create proxy server
const proxy = httpProxy.createProxyServer({ target: TARGET })
const server = http.createServer((req, res) => {
  proxy.web(req, res)
})

// Facilitate upgrade to WS
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head)
})

// Cherry-pick information from proxyRes and send them to meterMaster
proxy.on('proxyRes', (proxyRes, req, res) => {
  let body = []
  proxyRes.on('data', (chunk) => {
    body.push(chunk)
  })
  proxyRes.on('end', () => {
    body = Buffer.concat(body).toString()
    res.end(body)
    if (client.connected === true) {
      const transactionInfo = {
        statusCode: proxyRes.statusCode,
        statusMessage: proxyRes.statusMessage,
        headers: proxyRes.headers,
        url: req.url
      }
      if (body.length > 0) {
        transactionInfo.body = body
      }
      client.publish('httpRequest', JSON.stringify(transactionInfo))
    }
  })
})

// Send data from WS to meterMaster
proxy.on('open', (proxySocket) => {
  proxySocket.on('data', (data) => {
    client.publish('websocket', data)
  })
})

// Log information on startup
console.log('listening on port 8000')
server.listen(8000)

//
// Mosquitto
//

// Connect to MQTT
const client = mqtt.connect(MQTT_PI, { clientId: 'proxy' })
client.on('connect', () => {
  if (client.connected === true) {
    console.log('connected')
  }
})
client.on('error', (error) => {
  console.log("Can't connect" + error)
})
