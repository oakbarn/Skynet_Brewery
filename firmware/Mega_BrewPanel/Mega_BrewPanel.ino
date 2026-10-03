// Mega_BrewPanel - Arduino Mega 2560 firmware for Brew Panel (docs/DEVICE_PROTOCOL.md)
// MIT License Granted - Copyright (c) OakBarn Brewery 2026
// Libraries (Arduino Library Manager): OneWire, DallasTemperature
// Starter sketch: set the pin lists below for this Mega.

#include <OneWire.h>
#include <DallasTemperature.h>

const char* DEVICE_NAME = "MEGA1";
const char* FIRMWARE = "0.1";

// Link to the server: Serial = USB cable. Use Serial1 (pins 18/19) when an ESP32 bridge is wired in.
#define LINK Serial

// ---- your pins ----
const uint8_t OUTPUT_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 22, 23, 24, 25};
const uint8_t INPUT_PINS[]  = {30, 31, 32, 33};          // switches / float sensors (to GND, internal pull-up)
const uint8_t ANALOG_PINS[] = {A0};                      // analog inputs to report, e.g. {A0, A1}
const uint8_t ONEWIRE_PIN = 40;                          // all DS18B20 probes on one bus, 4.7k pull-up to 5V
const bool RELAY_ACTIVE_LOW = true;                      // most relay boards switch ON with LOW
const unsigned long WATCHDOG_MS = 10000;                 // no message for 10 s -> all outputs OFF

const uint8_t N_OUT = sizeof(OUTPUT_PINS), N_IN = sizeof(INPUT_PINS), N_AN = sizeof(ANALOG_PINS);
OneWire oneWire(ONEWIRE_PIN);
DallasTemperature probes(&oneWire);
int lastIn[N_IN > 0 ? N_IN : 1];
unsigned long lastRx = 0, lastReport = 0, lastTemp = 0;
bool tempRequested = false, watchdogTripped = false;
String line;

bool isOutput(int pin) { for (uint8_t i = 0; i < N_OUT; i++) if (OUTPUT_PINS[i] == pin) return true; return false; }

void writeOut(int pin, bool on) { digitalWrite(pin, (on ^ RELAY_ACTIVE_LOW) ? HIGH : LOW); }

void allOff() { for (uint8_t i = 0; i < N_OUT; i++) writeOut(OUTPUT_PINS[i], false); }

void reportInputs() {
  for (uint8_t i = 0; i < N_IN; i++) { int v = digitalRead(INPUT_PINS[i]) == LOW ? 1 : 0; lastIn[i] = v; LINK.print("DI "); LINK.print(INPUT_PINS[i]); LINK.print(' '); LINK.println(v); }
  for (uint8_t i = 0; i < N_AN; i++) { LINK.print("A "); LINK.print(ANALOG_PINS[i]); LINK.print(' '); LINK.println(analogRead(ANALOG_PINS[i])); }
}

void handle(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;
  lastRx = millis();
  if (watchdogTripped) { watchdogTripped = false; LINK.println("ERR watchdog cleared"); }
  if (cmd == "PING") return;
  if (cmd == "HELLO") { LINK.print("HELLO "); LINK.print(DEVICE_NAME); LINK.print(' '); LINK.println(FIRMWARE); reportInputs(); return; }
  if (cmd.startsWith("DO ")) {
    int sp = cmd.indexOf(' ', 3);
    int pin = cmd.substring(3, sp).toInt(); int v = cmd.substring(sp + 1).toInt();
    if (!isOutput(pin)) { LINK.print("ERR pin "); LINK.print(pin); LINK.println(" is not in OUTPUT_PINS"); return; }
    writeOut(pin, v == 1);
    LINK.print("DO "); LINK.print(pin); LINK.print(' '); LINK.println(v == 1 ? 1 : 0);
    return;
  }
  LINK.print("ERR unknown command: "); LINK.println(cmd);
}

void sendTemps() {
  DeviceAddress a;
  uint8_t n = probes.getDeviceCount();
  for (uint8_t i = 0; i < n; i++) {
    if (!probes.getAddress(a, i)) continue;
    float f = probes.getTempF(a);
    if (f < -100) continue;                               // disconnected probe
    LINK.print("T ");
    for (uint8_t b = 0; b < 8; b++) { if (a[b] < 16) LINK.print('0'); LINK.print(a[b], HEX); }
    LINK.print(' '); LINK.println(f, 2);
  }
}

void setup() {
  for (uint8_t i = 0; i < N_OUT; i++) { pinMode(OUTPUT_PINS[i], OUTPUT); writeOut(OUTPUT_PINS[i], false); }
  for (uint8_t i = 0; i < N_IN; i++) { pinMode(INPUT_PINS[i], INPUT_PULLUP); lastIn[i] = -1; }
  LINK.begin(115200);
  probes.begin();
  probes.setWaitForConversion(false);                     // do not block while probes convert
  lastRx = millis();
}

void loop() {
  while (LINK.available()) {
    char c = LINK.read();
    if (c == '\n') { handle(line); line = ""; }
    else if (c != '\r' && line.length() < 80) line += c;
  }
  unsigned long now = millis();
  if (!watchdogTripped && now - lastRx > WATCHDOG_MS) { allOff(); watchdogTripped = true; LINK.println("ERR watchdog: no messages, all outputs OFF"); }
  for (uint8_t i = 0; i < N_IN; i++) {
    int v = digitalRead(INPUT_PINS[i]) == LOW ? 1 : 0;
    if (v != lastIn[i]) { lastIn[i] = v; LINK.print("DI "); LINK.print(INPUT_PINS[i]); LINK.print(' '); LINK.println(v); }
  }
  if (now - lastReport > 5000) { lastReport = now; reportInputs(); }
  if (!tempRequested && now - lastTemp > 2000) { probes.requestTemperatures(); tempRequested = true; lastTemp = now; }
  if (tempRequested && now - lastTemp > 800) { sendTemps(); tempRequested = false; }
}
