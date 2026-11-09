// ESP32_Hydrometer - hears Bluetooth hydrometers (Tilt, Tilt Pro, Tilt Pro Mini, RAPT Pill) and sends what it heard to Skynet
// MIT License Granted - Copyright (c) OakBarn Brewery 2026
// Skynet Rule 6.25, Help 170. Put any ESP32 near the fermenters (a Tilt's Bluetooth reaches a few meters through a steel fermenter,
// more through plastic or glass). It listens for 5 seconds, then sends every Tilt and RAPT Pill advert it heard to the Brain:
//   POST http://BRAIN_HOST:BRAIN_PORT/api/hydrometer/bluetooth   { "from": NAME, "ads": [{ "address", "rssi", "mfg": { "76": "hex" } }] }
// The Brain reads the adverts itself (public/hydrometer.js), so this sketch never needs to change when a kind is added.
// Arduino IDE: Tools > Board > ESP32 Dev Module (any ESP32 with Bluetooth; not the ESP32-S2). Tools > Partition Scheme > Huge APP
// (Bluetooth and Wi-Fi together need the room). Set the five settings below, then Upload.

#include <WiFi.h>
#include <HTTPClient.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <map>

const char* WIFI_SSID  = "YourWiFi";
const char* WIFI_PASS  = "YourPassword";
const char* BRAIN_HOST = "192.168.1.50";   // the Brain's address on your network (the computer or Pi that runs Skynet)
const uint16_t BRAIN_PORT = 8080;          // Skynet's port (shown in the address bar, after the colon)
const char* API_KEY    = "";               // only needed when the Brain is not on your own network (Menu > Settings > API key)
const char* NAME       = "ESP32 Hydrometer";

const int SCAN_SECONDS = 5;
struct Heard { int rssi; String mfg; };
std::map<String, Heard> heard;              // newest advert of each Tilt or RAPT Pill, by Bluetooth address

static String hex2(uint8_t b) { const char* h = "0123456789abcdef"; String s; s += h[b >> 4]; s += h[b & 15]; return s; }

class Listener : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice dev) override {
    if (!dev.haveManufacturerData()) return;
    auto md = dev.getManufacturerData();     // the company number (2 bytes, low byte first), then its data
    if (md.length() < 4) return;
    uint16_t company = (uint8_t)md[0] | ((uint8_t)md[1] << 8);
    bool tilt = company == 76 && md.length() >= 25 && (uint8_t)md[2] == 0x02 && (uint8_t)md[3] == 0x15 && (uint8_t)md[4] == 0xa4 && (uint8_t)md[5] == 0x95 && (uint8_t)md[6] == 0xbb;
    bool rapt = company == 16722 && md.length() == 25;
    if (!tilt && !rapt) return;
    String data;
    for (size_t i = 2; i < md.length(); i++) data += hex2((uint8_t)md[i]);
    String key = dev.getAddress().toString().c_str();
    heard[key] = { dev.getRSSI(), String(company) + ":" + data };
  }
};

BLEScan* scan;

void wifiUp() {
  if (WiFi.status() == WL_CONNECTED) return;
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) { delay(500); Serial.print('.'); }
  if (WiFi.status() == WL_CONNECTED) { Serial.print("\nESP32 Hydrometer at "); Serial.println(WiFi.localIP()); }
}

void sendHeard() {
  if (heard.empty()) return;
  wifiUp();
  if (WiFi.status() != WL_CONNECTED) return;      // keep them for the next try
  String body = String("{\"from\":\"") + NAME + "\",\"ads\":[";
  bool first = true;
  for (auto& h : heard) {
    int colon = h.second.mfg.indexOf(':');
    body += first ? "" : ",";
    body += "{\"address\":\"" + h.first + "\",\"rssi\":" + String(h.second.rssi) + ",\"mfg\":{\"" + h.second.mfg.substring(0, colon) + "\":\"" + h.second.mfg.substring(colon + 1) + "\"}}";
    first = false;
  }
  body += "]}";
  String url = String("http://") + BRAIN_HOST + ":" + BRAIN_PORT + "/api/hydrometer/bluetooth";
  if (strlen(API_KEY)) url += String("?key=") + API_KEY;
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  Serial.printf("Sent %d to Skynet: %d %s\n", (int)heard.size(), code, code > 0 ? http.getString().c_str() : http.errorToString(code).c_str());
  http.end();
  if (code > 0) heard.clear();
}

void setup() {
  Serial.begin(115200);
  wifiUp();
  BLEDevice::init("");
  scan = BLEDevice::getScan();
  scan->setAdvertisedDeviceCallbacks(new Listener(), true);      // true: every advert, not only the first from each
  scan->setActiveScan(false);                                    // just listen
  scan->setInterval(100);
  scan->setWindow(99);
}

void loop() {
  scan->start(SCAN_SECONDS, false);
  scan->clearResults();
  sendHeard();
}
