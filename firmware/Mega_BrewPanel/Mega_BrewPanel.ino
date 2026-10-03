// Mega_BrewPanel - Arduino Mega 2560 firmware for Brew Panel (docs/DEVICE_PROTOCOL.md)
// MIT License Granted - Copyright (c) OakBarn Brewery 2026
// Libraries (Arduino Library Manager): OneWire, DallasTemperature
//   + Adafruit MAX31865 when USE_RTD is 1, Adafruit MAX31856 when USE_TC is 1, Adafruit MAX31855 when USE_TC is 2,
//     Adafruit ADS1X15 when USE_ADS1115 is 1
// Written for an Arduino Mega 2560. Uno / Nano work with smaller pin lists (flow meters on pins 2 and 3 only).
// Starter sketch: set the pin lists below for this Mega. Only pins in these lists can be used.
// Sensor settings that live on the chip (thermocouple type, RTD wires, input pull-up) are sent by the
// server with CFG lines, so you set them in the panel, not here.

#define USE_RTD 0                                        // 1 = PT100 / PT1000 probes on MAX31865 boards
#define USE_TC  0                                        // 1 = thermocouples on MAX31856 boards (K, J, T ...), 2 = MAX31855 boards (K only)
#define USE_ADS1115 0                                    // 1 = ADS1115 16-bit analog board on I2C (SDA 20, SCL 21), address 0x48

#include <OneWire.h>
#include <DallasTemperature.h>
#if USE_RTD
#include <Adafruit_MAX31865.h>
#endif
#if USE_TC == 1
#include <Adafruit_MAX31856.h>
#elif USE_TC == 2
#include <Adafruit_MAX31855.h>
#endif
#if USE_ADS1115
#include <Adafruit_ADS1X15.h>
#endif

const char* DEVICE_NAME = "MEGA1";
const char* FIRMWARE = "0.2";

// Link to the server: Serial = USB cable. Use Serial1 (pins 18/19) when an ESP32 bridge is wired in.
#define LINK Serial

// ---- your pins ----
const uint8_t OUTPUT_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 22, 23, 24, 25};
const uint8_t INPUT_PINS[]  = {30, 31, 32, 33};          // switches / float sensors (to GND, internal pull-up)
const uint8_t ANALOG_PINS[] = {A0};                      // analog inputs (sensors 0-5V, 4-20mA via 250 ohm, NTC, pH), e.g. {A0, A1}; reported as 0 = A0
const uint8_t PWM_PINS[]    = {44, 45, 46};              // PWM outputs 0-100 % (pump speed, SSR power), not also in OUTPUT_PINS
const uint8_t AO_PINS[]     = {};                        // analog outputs: a PWM pin into a PWM-to-0-10V or 4-20mA module, e.g. {13}
const uint8_t FLOW_PINS[]   = {};                        // pulse flow meters, interrupt pins only: 2, 3, 18, 19, 20, 21 (max 6)
const uint8_t RTD_CS_PINS[] = {};                        // MAX31865 chip-select pins (PT100 / PT1000), SPI on 50/51/52, e.g. {48}
const uint8_t TC_CS_PINS[]  = {};                        // MAX31856 / MAX31855 chip-select pins (thermocouples), SPI on 50/51/52, e.g. {49}
const uint8_t ADS_CHANNELS[] = {0, 1, 2, 3};             // ADS1115 channels to report (only when USE_ADS1115 is 1)
const uint8_t ONEWIRE_PIN = 40;                          // all DS18B20 probes on one bus, 4.7k pull-up to 5V
const bool RELAY_ACTIVE_LOW = true;                      // most relay boards switch ON with LOW
const unsigned long WATCHDOG_MS = 10000;                 // no message for 10 s -> all outputs OFF

const uint8_t N_OUT = sizeof(OUTPUT_PINS), N_IN = sizeof(INPUT_PINS), N_AN = sizeof(ANALOG_PINS), N_PWM = sizeof(PWM_PINS), N_AO = sizeof(AO_PINS);
const uint8_t N_FLOW = sizeof(FLOW_PINS) > 6 ? 6 : sizeof(FLOW_PINS), N_RTD = sizeof(RTD_CS_PINS), N_TC = sizeof(TC_CS_PINS);
OneWire oneWire(ONEWIRE_PIN);
DallasTemperature probes(&oneWire);
#if USE_RTD
Adafruit_MAX31865* rtd[N_RTD > 0 ? N_RTD : 1];
#endif
#if USE_TC == 1
Adafruit_MAX31856* tc[N_TC > 0 ? N_TC : 1];
#elif USE_TC == 2
Adafruit_MAX31855* tc[N_TC > 0 ? N_TC : 1];
#endif
#if USE_ADS1115
Adafruit_ADS1115 ads;
#endif
int lastIn[N_IN > 0 ? N_IN : 1];
volatile unsigned long pulses[6];
void f0() { pulses[0]++; } void f1() { pulses[1]++; } void f2() { pulses[2]++; } void f3() { pulses[3]++; } void f4() { pulses[4]++; } void f5() { pulses[5]++; }
void (*const FLOW_ISR[6])() = {f0, f1, f2, f3, f4, f5};
unsigned long lastRx = 0, lastReport = 0, lastTemp = 0, lastFast = 0;
bool tempRequested = false, watchdogTripped = false;
String line;

int indexOf(const uint8_t* pins, uint8_t n, int pin) { for (uint8_t i = 0; i < n; i++) if (pins[i] == pin) return i; return -1; }
bool isOutput(int pin) { return indexOf(OUTPUT_PINS, N_OUT, pin) >= 0; }

void writeOut(int pin, bool on) { digitalWrite(pin, (on ^ RELAY_ACTIVE_LOW) ? HIGH : LOW); }

void allOff() {
  for (uint8_t i = 0; i < N_OUT; i++) writeOut(OUTPUT_PINS[i], false);
  for (uint8_t i = 0; i < N_PWM; i++) analogWrite(PWM_PINS[i], 0);
  for (uint8_t i = 0; i < N_AO; i++) analogWrite(AO_PINS[i], 0);
}

void say(const char* cmd, int pin, long v) { LINK.print(cmd); LINK.print(' '); LINK.print(pin); LINK.print(' '); LINK.println(v); }

void reportInputs() {
  for (uint8_t i = 0; i < N_IN; i++) { int v = digitalRead(INPUT_PINS[i]) == LOW ? 1 : 0; lastIn[i] = v; say("DI", INPUT_PINS[i], v); }
}

// Every second: analog inputs, flow meter pulse counts, RTD and thermocouple readings
void reportFast() {
  for (uint8_t i = 0; i < N_AN; i++) say("A", ANALOG_PINS[i] - A0, analogRead(ANALOG_PINS[i]));
  for (uint8_t i = 0; i < N_FLOW; i++) { noInterrupts(); unsigned long c = pulses[i]; interrupts(); say("P", FLOW_PINS[i], c); }
#if USE_RTD
  for (uint8_t i = 0; i < N_RTD; i++) {
    uint16_t raw = rtd[i]->readRTD();
    if (rtd[i]->readFault()) { rtd[i]->clearFault(); LINK.print("RTD "); LINK.print(RTD_CS_PINS[i]); LINK.println(" NAN"); }
    else say("RTD", RTD_CS_PINS[i], raw);
  }
#endif
#if USE_TC == 1
  for (uint8_t i = 0; i < N_TC; i++) {
    float c = tc[i]->readThermocoupleTemperature();
    LINK.print("TC "); LINK.print(TC_CS_PINS[i]); LINK.print(' ');
    if (tc[i]->readFault()) LINK.println("NAN"); else LINK.println(c, 2);
  }
#elif USE_TC == 2
  for (uint8_t i = 0; i < N_TC; i++) {
    double c = tc[i]->readCelsius();                     // NAN when the probe is open or shorted
    LINK.print("TC "); LINK.print(TC_CS_PINS[i]); LINK.print(' ');
    if (isnan(c)) LINK.println("NAN"); else LINK.println(c, 2);
  }
#endif
#if USE_ADS1115
  for (uint8_t i = 0; i < sizeof(ADS_CHANNELS); i++) say("ADS", ADS_CHANNELS[i], ads.readADC_SingleEnded(ADS_CHANNELS[i]));
#endif
}

// CFG <kind> <pin> <setting>: sensor settings sent by the server after HELLO
void configure(String kind, int pin, String v) {
  int i;
  if (kind == "DI" && (i = indexOf(INPUT_PINS, N_IN, pin)) >= 0) { pinMode(pin, v == "NOPULL" ? INPUT : INPUT_PULLUP); return; }
#if USE_RTD
  if (kind == "RTD" && (i = indexOf(RTD_CS_PINS, N_RTD, pin)) >= 0) { rtd[i]->begin(v == "4" ? MAX31865_4WIRE : v == "2" ? MAX31865_2WIRE : MAX31865_3WIRE); return; }
#endif
#if USE_TC == 2
  if (kind == "TC" && (i = indexOf(TC_CS_PINS, N_TC, pin)) >= 0) { if (!(v == "K")) LINK.println("ERR MAX31855 boards are type K only"); return; }
#endif
#if USE_TC == 1
  if (kind == "TC" && (i = indexOf(TC_CS_PINS, N_TC, pin)) >= 0) {
    const char* names = "KJTNERSB";
    const max31856_thermocoupletype_t types[] = {MAX31856_TCTYPE_K, MAX31856_TCTYPE_J, MAX31856_TCTYPE_T, MAX31856_TCTYPE_N, MAX31856_TCTYPE_E, MAX31856_TCTYPE_R, MAX31856_TCTYPE_S, MAX31856_TCTYPE_B};
    const char* at = strchr(names, v.charAt(0));
    if (at && v.length() == 1) { tc[i]->setThermocoupleType(types[at - names]); return; }
  }
#endif
  LINK.print("ERR CFG "); LINK.print(kind); LINK.print(' '); LINK.print(pin); LINK.println(": pin not in this sketch's lists (or USE_RTD / USE_TC is off)");
}

void handle(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;
  lastRx = millis();
  if (watchdogTripped) { watchdogTripped = false; LINK.println("ERR watchdog cleared"); }
  if (cmd == "PING") return;
  if (cmd == "HELLO") { LINK.print("HELLO "); LINK.print(DEVICE_NAME); LINK.print(' '); LINK.println(FIRMWARE); reportInputs(); reportFast(); return; }
  if (cmd.startsWith("DO ")) {
    int sp = cmd.indexOf(' ', 3);
    int pin = cmd.substring(3, sp).toInt(); int v = cmd.substring(sp + 1).toInt();
    if (!isOutput(pin)) { LINK.print("ERR pin "); LINK.print(pin); LINK.println(" is not in OUTPUT_PINS"); return; }
    writeOut(pin, v == 1);
    LINK.print("DO "); LINK.print(pin); LINK.print(' '); LINK.println(v == 1 ? 1 : 0);
    return;
  }
  int s1 = cmd.indexOf(' '), s2 = cmd.indexOf(' ', s1 + 1);
  String op = cmd.substring(0, s1);
  if (op == "PWM" || op == "AO") {                        // PWM <pin> <0-255>,  AO <pin> <0-1000>
    int pin = cmd.substring(s1 + 1, s2).toInt(); long v = cmd.substring(s2 + 1).toInt();
    bool pwm = op == "PWM";
    if (indexOf(pwm ? PWM_PINS : AO_PINS, pwm ? N_PWM : N_AO, pin) < 0) { LINK.print("ERR pin "); LINK.print(pin); LINK.println(pwm ? " is not in PWM_PINS" : " is not in AO_PINS"); return; }
    v = constrain(v, 0, pwm ? 255 : 1000);
    analogWrite(pin, pwm ? v : v * 255 / 1000);
    say(pwm ? "PWM" : "AO", pin, v);
    return;
  }
  if (op == "CFG") {                                     // CFG <DI|RTD|TC> <pin> <setting>
    int s3 = cmd.indexOf(' ', s2 + 1);
    configure(cmd.substring(s1 + 1, s2), cmd.substring(s2 + 1, s3).toInt(), cmd.substring(s3 + 1));
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
  for (uint8_t i = 0; i < N_PWM; i++) { pinMode(PWM_PINS[i], OUTPUT); analogWrite(PWM_PINS[i], 0); }
  for (uint8_t i = 0; i < N_AO; i++) { pinMode(AO_PINS[i], OUTPUT); analogWrite(AO_PINS[i], 0); }
  for (uint8_t i = 0; i < N_FLOW; i++) { pinMode(FLOW_PINS[i], INPUT_PULLUP); attachInterrupt(digitalPinToInterrupt(FLOW_PINS[i]), FLOW_ISR[i], FALLING); }
#if USE_RTD
  for (uint8_t i = 0; i < N_RTD; i++) { rtd[i] = new Adafruit_MAX31865(RTD_CS_PINS[i]); rtd[i]->begin(MAX31865_3WIRE); }
#endif
#if USE_TC == 2
  for (uint8_t i = 0; i < N_TC; i++) { tc[i] = new Adafruit_MAX31855(TC_CS_PINS[i]); tc[i]->begin(); }
#endif
#if USE_ADS1115
  ads.setGain(GAIN_TWOTHIRDS);                           // 0-6.144 V range, so 5 V sensors fit
  if (!ads.begin()) LINK.println("ERR ADS1115 not found on I2C");
#endif
#if USE_TC == 1
  for (uint8_t i = 0; i < N_TC; i++) { tc[i] = new Adafruit_MAX31856(TC_CS_PINS[i]); tc[i]->begin(); tc[i]->setThermocoupleType(MAX31856_TCTYPE_K); tc[i]->setConversionMode(MAX31856_CONTINUOUS); }
#endif
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
  if (now - lastFast > 1000) { lastFast = now; reportFast(); }
  if (!tempRequested && now - lastTemp > 2000) { probes.requestTemperatures(); tempRequested = true; lastTemp = now; }
  if (tempRequested && now - lastTemp > 800) { sendTemps(); tempRequested = false; }
}
