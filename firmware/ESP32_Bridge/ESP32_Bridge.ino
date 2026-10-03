// ESP32_Bridge - WiFi bridge between Brew Panel and an Arduino Mega (docs/DEVICE_PROTOCOL.md)
// MIT License Granted - Copyright (c) OakBarn Brewery 2026
// The server connects to this ESP32 on TCP port 4100. Every line is passed to the Mega on Serial2
// and every line from the Mega is passed back, so the Mega runs the same Mega_BrewPanel sketch.
// Wiring: ESP32 GPIO17 (TX2) -> Mega RX1 (pin 19), Mega TX1 (pin 18) -> voltage divider (5V to 3.3V) -> ESP32 GPIO16 (RX2), GND to GND.
// In Mega_BrewPanel set  #define LINK Serial1

#include <WiFi.h>

const char* WIFI_SSID = "YourWiFi";
const char* WIFI_PASS = "YourPassword";
const uint16_t PORT = 4100;

WiFiServer server(PORT);
WiFiClient client;
String fromNet, fromMega;

void setup() {
  Serial.begin(115200);                                  // USB debug
  Serial2.begin(115200, SERIAL_8N1, 16, 17);             // to the Mega
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print('.'); }
  Serial.print("\nBrew Panel bridge at "); Serial.print(WiFi.localIP()); Serial.print(':'); Serial.println(PORT);
  server.begin();
  server.setNoDelay(true);
}

void loop() {
  if (server.hasClient()) {                              // newest connection wins
    if (client && client.connected()) client.stop();
    client = server.available();
    client.setNoDelay(true);
  }
  while (client && client.connected() && client.available()) {
    char c = client.read();
    if (c == '\n') { Serial2.println(fromNet); fromNet = ""; } else if (c != '\r' && fromNet.length() < 100) fromNet += c;
  }
  while (Serial2.available()) {
    char c = Serial2.read();
    if (c == '\n') { if (client && client.connected()) client.println(fromMega); fromMega = ""; } else if (c != '\r' && fromMega.length() < 100) fromMega += c;
  }
  // If WiFi or the server drops, the Mega stops getting PING and turns its outputs off by itself.
}
