// Mega_BrewPanel - Arduino Mega 2560 firmware for Brew Panel (docs/DEVICE_PROTOCOL.md)
// MIT License Granted - Copyright (c) OakBarn Brewery 2026
// Libraries (Arduino Library Manager): OneWire, DallasTemperature
//   + Adafruit MAX31865 when USE_RTD is 1, Adafruit MAX31856 when USE_TC is 1, Adafruit MAX31855 when USE_TC is 2,
//     Adafruit ADS1X15 when USE_ADS1115 is 1, HX711 (by Bogdan Necula) when USE_HX711 is 1,
//     AccelStepper (by Mike McCauley) when USE_STEPPER is 1
// Written for an Arduino Mega 2560. Uno / Nano work with smaller pin lists (flow meters on pins 2 and 3 only).
// Starter sketch: set the pin lists below for this Mega. Only pins in these lists can be used.
// Sensor settings that live on the chip (thermocouple type, RTD wires, input pull-up) are sent by the
// server with CFG lines, so you set them in the panel, not here.

#define USE_RTD 0                                        // 1 = PT100 / PT1000 probes on MAX31865 boards
#define USE_TC  0                                        // 1 = thermocouples on MAX31856 boards (K, J, T ...), 2 = MAX31855 boards (K only)
#define USE_ADS1115 0                                    // 1 = ADS1115 16-bit analog board on I2C (SDA 20, SCL 21), address 0x48
#define USE_HX711 0                                      // 1 = load cells (vessel scales) on HX711 boards
#define USE_STEPPER 0                                    // 1 = stepper motors (A4988 / DRV8825 / TMC / TB6600 driver, or ULN2003 board); set up in the panel

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
#if USE_HX711
#include <HX711.h>
#endif
#if USE_STEPPER
#include <AccelStepper.h>
#endif

const char* DEVICE_NAME = "MEGA1";
const char* FIRMWARE = "0.3";

// Link to the server:
//   USB cable:      USE_ETHERNET 0 and LINK Serial (the default)
//   ESP32 bridge:   USE_ETHERNET 0 and LINK Serial1 (pins 18/19)
//   Ethernet:       USE_ETHERNET 1 with a W5500 or W5100 Ethernet shield. The panel connects to IP_ADDR on TCP port 4100.
//                   The shield uses pins 10 (chip select), 4 (SD card) and SPI 50/51/52, so pins 4 and 10 cannot be outputs.
#define USE_ETHERNET 0
#if USE_ETHERNET
#include <SPI.h>
#include <Ethernet.h>
byte MAC_ADDR[] = {0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0x01};  // any MAC, but unique on your network
IPAddress IP_ADDR(192, 168, 1, 60);                      // fixed address; add it on the panel's Devices page as "Board on Ethernet"
EthernetServer netServer(4100);
EthernetClient netClient;
#define LINK netClient
#else
#define LINK Serial
#endif

// ---- your pins ----   (analog pins can be listed as A0-A15; in the panel they are A0-A15 or BruControl's 54-69)
const uint8_t OUTPUT_PINS[] = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 22, 23, 24, 25};
const uint8_t INPUT_PINS[]  = {30, 31, 32, 33};          // switches / float sensors (to GND, internal pull-up)
const uint8_t ANALOG_PINS[] = {A0};                      // analog inputs (sensors 0-5V, 4-20mA via 250 ohm, NTC, pH), e.g. {A0, A1}; reported as 0 = A0
const uint8_t PWM_PINS[]    = {44, 45, 46};              // PWM outputs 0-100 % (pump speed, SSR power), not also in OUTPUT_PINS
const uint8_t AO_PINS[]     = {};                        // analog outputs: a PWM pin into a PWM-to-0-10V or 4-20mA module, e.g. {13}
const uint8_t FLOW_PINS[]   = {};                        // pulse flow meters, interrupt pins only: 2, 3, 18, 19, 20, 21 (max 6)
const uint8_t RTD_CS_PINS[] = {};                        // MAX31865 chip-select pins (PT100 / PT1000), SPI on 50/51/52, e.g. {48}
const uint8_t TC_CS_PINS[]  = {};                        // MAX31856 / MAX31855 chip-select pins (thermocouples), SPI on 50/51/52, e.g. {49}
const uint8_t ADS_CHANNELS[] = {0, 1, 2, 3};             // ADS1115 channels to report (only when USE_ADS1115 is 1)
const uint8_t HX711_DT_PINS[]  = {};                     // HX711 boards: data (DT) pins, e.g. {26, 28}; the panel names a scale by these
const uint8_t HX711_SCK_PINS[] = {};                     // and their clock (SCK) pins, same order, e.g. {27, 29}
const uint8_t STEPPER_PINS[]  = {};                     // every pin a stepper uses (STEP, DIR, ENABLE or IN1-IN4, home switch), e.g. {40, 41, 42, 43}; not also in other lists
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
const uint8_t N_HX = sizeof(HX711_DT_PINS);
#if USE_HX711
HX711 hx[N_HX > 0 ? N_HX : 1];
long hxSum[N_HX > 0 ? N_HX : 1]; uint8_t hxN[N_HX > 0 ? N_HX : 1];
#endif
const uint8_t N_STP = sizeof(STEPPER_PINS);
#if USE_STEPPER
// A stepper is set up by the panel (CFG STEP / STEP4 / HOME) and named by its STEP pin (IN1 for 4-pin boards).
// The board makes the steps, speeds up and slows down, and stops on the home switch; it reports
// SP <step pin> <position in steps> <moving 0|1> <homed 0|1>  every 0.2 s while moving and every second when still.
const uint8_t MAX_STEPPERS = 4;
struct Motor { AccelStepper* m; int id, homePin, homeDir; bool homeHigh, hold, on, homed, wasMoving; uint8_t mode; long maxTravel, homePos; unsigned long lastReport; };   // mode 0 = go / idle, 1 = run, 2 = homing
Motor motor[MAX_STEPPERS]; uint8_t nMotor = 0;
#endif
int lastIn[N_IN > 0 ? N_IN : 1], candIn[N_IN > 0 ? N_IN : 1];
unsigned long candSince[N_IN > 0 ? N_IN : 1]; unsigned int debounceMs[N_IN > 0 ? N_IN : 1];   // an input must hold a new level this long (ms) before it is reported
volatile unsigned long pulses[6];
void f0() { pulses[0]++; } void f1() { pulses[1]++; } void f2() { pulses[2]++; } void f3() { pulses[3]++; } void f4() { pulses[4]++; } void f5() { pulses[5]++; }
void (*const FLOW_ISR[6])() = {f0, f1, f2, f3, f4, f5};
unsigned long lastRx = 0, lastReport = 0, lastTemp = 0, lastFast = 0;
bool tempRequested = false, watchdogTripped = false;
String line;

int indexOf(const uint8_t* pins, uint8_t n, int pin) { for (uint8_t i = 0; i < n; i++) if (pins[i] == pin) return i; return -1; }
bool isOutput(int pin) {
#if USE_ETHERNET
  if (pin == 10 || pin == 4) return false;               // used by the Ethernet shield
#endif
  return indexOf(OUTPUT_PINS, N_OUT, pin) >= 0;
}

void writeOut(int pin, bool on) { digitalWrite(pin, (on ^ RELAY_ACTIVE_LOW) ? HIGH : LOW); }

#if USE_STEPPER
void halt(Motor& m) { m.m->setCurrentPosition(m.m->currentPosition()); m.mode = 0; }   // stop this instant (no slowing down)
#endif

void allOff() {
#if USE_STEPPER
  for (uint8_t i = 0; i < nMotor; i++) halt(motor[i]);
#endif
  for (uint8_t i = 0; i < N_OUT; i++) if (isOutput(OUTPUT_PINS[i])) writeOut(OUTPUT_PINS[i], false);
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
#if USE_HX711
  for (uint8_t i = 0; i < N_HX; i++) if (hxN[i]) { say("W", HX711_DT_PINS[i], hxSum[i] / hxN[i]); hxSum[i] = 0; hxN[i] = 0; }   // average since last report
#endif
#if USE_ADS1115
  for (uint8_t i = 0; i < sizeof(ADS_CHANNELS); i++) say("ADS", ADS_CHANNELS[i], ads.readADC_SingleEnded(ADS_CHANNELS[i]));
#endif
}

// n-th number (from 0) in a line of numbers separated by spaces
long argN(const String& s, uint8_t n) { int at = 0; for (uint8_t i = 0; i < n; i++) { at = s.indexOf(' ', at); if (at < 0) return 0; at++; } return s.substring(at).toInt(); }

#if USE_STEPPER
bool stepperPin(long p) { return p < 0 || indexOf(STEPPER_PINS, N_STP, p) >= 0; }
int findMotor(int id) { for (uint8_t i = 0; i < nMotor; i++) if (motor[i].id == id) return i; return -1; }
void reportMotor(Motor& m) {
  LINK.print("SP "); LINK.print(m.id); LINK.print(' '); LINK.print(m.m->currentPosition()); LINK.print(' ');
  LINK.print(m.wasMoving ? 1 : 0); LINK.print(' '); LINK.println(m.homed ? 1 : 0);
  m.lastReport = millis();
}
bool homeHit(Motor& m) { return m.homePin >= 0 && (digitalRead(m.homePin) == HIGH) == m.homeHigh; }

// CFG STEP <step> <dir> <enable|-1> <flags> <max steps/s> <accel> <pulse us>,  CFG STEP4 <in1> <in2> <in3> <in4> <flags> <max> <accel>
// flags: 1 reverse, 2 enable pin HIGH = on, 4 keep powered when stopped, 8 half steps, 16 28BYJ-48 coil order (IN1 IN3 IN2 IN4)
void setupMotor(bool four, int pin, const String& v) {
  long p2 = argN(v, 0), p3 = argN(v, 1), p4 = four ? argN(v, 2) : -1, flags = argN(v, four ? 3 : 2);
  if (!stepperPin(pin) || !stepperPin(p2) || !stepperPin(p3) || !stepperPin(p4)) { LINK.print("ERR stepper "); LINK.print(pin); LINK.println(": a pin is not in STEPPER_PINS"); return; }
  int i = findMotor(pin); long pos = 0;
  if (i < 0) {
    if (nMotor >= MAX_STEPPERS) { LINK.println("ERR too many steppers (MAX_STEPPERS)"); return; }
    i = nMotor++; motor[i].id = pin; motor[i].homePin = -1; motor[i].homeDir = -1; motor[i].homed = false; motor[i].on = true; motor[i].wasMoving = false;
  } else { pos = motor[i].m->currentPosition(); delete motor[i].m; }       // new settings: rebuild, keep the position
  Motor& m = motor[i];
  if (four) {
    long a1 = pin, a2 = (flags & 16) ? p3 : p2, b1 = (flags & 16) ? p2 : p3, b2 = p4;
    if (flags & 1) { long t = a1; a1 = a2; a2 = t; }                       // reverse: swap the ends of one coil
    m.m = new AccelStepper((flags & 8) ? AccelStepper::HALF4WIRE : AccelStepper::FULL4WIRE, a1, a2, b1, b2);
  } else {
    m.m = new AccelStepper(AccelStepper::DRIVER, pin, p2);
    m.m->setPinsInverted(flags & 1, false, !(flags & 2));                   // most drivers: ENABLE LOW = on
    if (p3 >= 0) m.m->setEnablePin(p3);
    m.m->setMinPulseWidth(max(1L, argN(v, 5)));
  }
  m.m->setMaxSpeed(max(1L, argN(v, four ? 4 : 3))); m.m->setAcceleration(max(1L, argN(v, four ? 5 : 4)));
  m.m->setCurrentPosition(pos);
  m.hold = flags & 4; m.mode = 0;
  if (!m.on || !m.hold) m.m->disableOutputs(); else m.m->enableOutputs();
  reportMotor(m);
}

// GO <id> <position> <speed>, RUN <id> <speed, - = backward, 0 = stop>, STOP <id>, ZERO <id> <position>, HOME <id> <speed> <max travel> <position at switch>, EN <id> <0|1>
void motorCommand(const String& op, const String& a) {
  int i = findMotor(a.toInt());
  if (i < 0) { LINK.print("ERR stepper "); LINK.print(a.toInt()); LINK.println(" not set up (no CFG STEP)"); return; }
  Motor& m = motor[i];
  if (op == "STOP") { m.mode = 0; m.m->stop(); return; }                      // slows down to a stop
  if (op == "ZERO") { m.m->setCurrentPosition(argN(a, 1)); m.mode = 0; m.homed = true; reportMotor(m); return; }
  if (op == "EN") {
    m.on = argN(a, 1) == 1;
    if (!m.on) { halt(m); m.m->disableOutputs(); } else if (m.hold) m.m->enableOutputs();
    reportMotor(m); return;
  }
  if (!m.on) { LINK.print("ERR stepper "); LINK.print(m.id); LINK.println(" is turned off"); return; }
  long v = argN(a, op == "GO" ? 2 : 1);
  if (op == "RUN" && v == 0) { m.m->stop(); return; }
  if (op == "HOME" && m.homePin < 0) { LINK.print("ERR stepper "); LINK.print(m.id); LINK.println(": no home switch set"); LINK.print("SH "); LINK.print(m.id); LINK.println(" 0"); return; }
  m.m->enableOutputs();
  m.m->setMaxSpeed(max(1L, labs(v)));
  if (op == "GO") { m.mode = 0; m.m->moveTo(argN(a, 1)); }
  else if (op == "RUN") { m.mode = 1; m.m->moveTo(m.m->currentPosition() + (v > 0 ? 100000000L : -100000000L)); }
  else if (op == "HOME") { m.mode = 2; m.homed = false; m.maxTravel = argN(a, 2); m.homePos = argN(a, 3); m.m->moveTo(m.m->currentPosition() + (v > 0 ? m.maxTravel : -m.maxTravel)); }
}

// Every pass of loop(): step the motors, stop on the home switch, report
void runMotors() {
  unsigned long now = millis();
  for (uint8_t i = 0; i < nMotor; i++) {
    Motor& m = motor[i];
    bool moving = m.m->distanceToGo() != 0;
    if (moving && homeHit(m)) {
      if (m.mode == 2) { halt(m); m.m->setCurrentPosition(m.homePos); m.homed = true; LINK.print("SH "); LINK.print(m.id); LINK.println(" 1"); moving = false; }
      else if ((m.m->distanceToGo() > 0 ? 1 : -1) == m.homeDir) { halt(m); LINK.print("ERR stepper "); LINK.print(m.id); LINK.println(" stopped at its home switch"); moving = false; }
    }
    if (moving) m.m->run();
    else if (m.wasMoving) {                                // just stopped
      if (m.mode == 2) { LINK.print("ERR stepper "); LINK.print(m.id); LINK.println(": home switch not found"); LINK.print("SH "); LINK.print(m.id); LINK.println(" 0"); }
      m.mode = 0;
      if (!m.hold) m.m->disableOutputs();
    }
    if (moving != m.wasMoving || now - m.lastReport >= (moving ? 200UL : 1000UL)) { m.wasMoving = moving; reportMotor(m); }
  }
}
#endif

// CFG <kind> <pin> <setting>: sensor settings sent by the server after HELLO
void configure(String kind, int pin, String v) {
  int i;
#if USE_STEPPER
  if (kind == "STEP" || kind == "STEP4") { setupMotor(kind == "STEP4", pin, v); return; }
  if (kind == "HOME" && (i = findMotor(pin)) >= 0) {        // CFG HOME <step pin> <switch pin> <flags: 1 = switch reads HIGH when hit, 2 = switch at the + end>
    long hp = argN(v, 0), f = argN(v, 1);
    if (!stepperPin(hp) || hp < 0) { LINK.print("ERR home switch pin "); LINK.print(hp); LINK.println(" is not in STEPPER_PINS"); return; }
    motor[i].homePin = hp; motor[i].homeHigh = f & 1; motor[i].homeDir = (f & 2) ? 1 : -1;
    pinMode(hp, INPUT_PULLUP);
    return;
  }
#endif
  if (kind == "DI" && (i = indexOf(INPUT_PINS, N_IN, pin)) >= 0) {   // CFG DI <pin> <PULLUP|NOPULL> [debounce ms]
    int sp = v.indexOf(' ');
    pinMode(pin, v.substring(0, sp < 0 ? v.length() : sp) == "NOPULL" ? INPUT : INPUT_PULLUP);
    if (sp > 0) debounceMs[i] = constrain(v.substring(sp + 1).toInt(), 0, 5000);
    return;
  }
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
#if USE_STEPPER
  if (op == "GO" || op == "RUN" || op == "STOP" || op == "ZERO" || op == "HOME" || op == "EN") { motorCommand(op, cmd.substring(s1 + 1)); return; }
#endif
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
  for (uint8_t i = 0; i < N_OUT; i++) if (isOutput(OUTPUT_PINS[i])) { pinMode(OUTPUT_PINS[i], OUTPUT); writeOut(OUTPUT_PINS[i], false); }
  for (uint8_t i = 0; i < N_IN; i++) { pinMode(INPUT_PINS[i], INPUT_PULLUP); lastIn[i] = -1; candIn[i] = -1; debounceMs[i] = 20; }
  for (uint8_t i = 0; i < N_PWM; i++) { pinMode(PWM_PINS[i], OUTPUT); analogWrite(PWM_PINS[i], 0); }
  for (uint8_t i = 0; i < N_AO; i++) { pinMode(AO_PINS[i], OUTPUT); analogWrite(AO_PINS[i], 0); }
  for (uint8_t i = 0; i < N_FLOW; i++) { pinMode(FLOW_PINS[i], INPUT_PULLUP); attachInterrupt(digitalPinToInterrupt(FLOW_PINS[i]), FLOW_ISR[i], FALLING); }
#if USE_RTD
  for (uint8_t i = 0; i < N_RTD; i++) { rtd[i] = new Adafruit_MAX31865(RTD_CS_PINS[i]); rtd[i]->begin(MAX31865_3WIRE); }
#endif
#if USE_TC == 2
  for (uint8_t i = 0; i < N_TC; i++) { tc[i] = new Adafruit_MAX31855(TC_CS_PINS[i]); tc[i]->begin(); }
#endif
#if USE_HX711
  for (uint8_t i = 0; i < N_HX; i++) hx[i].begin(HX711_DT_PINS[i], HX711_SCK_PINS[i]);
#endif
#if USE_ADS1115
  ads.setGain(GAIN_TWOTHIRDS);                           // 0-6.144 V range, so 5 V sensors fit
  if (!ads.begin()) LINK.println("ERR ADS1115 not found on I2C");
#endif
#if USE_TC == 1
  for (uint8_t i = 0; i < N_TC; i++) { tc[i] = new Adafruit_MAX31856(TC_CS_PINS[i]); tc[i]->begin(); tc[i]->setThermocoupleType(MAX31856_TCTYPE_K); tc[i]->setConversionMode(MAX31856_CONTINUOUS); }
#endif
#if USE_ETHERNET
  Ethernet.init(10);
  Ethernet.begin(MAC_ADDR, IP_ADDR);
  netServer.begin();
#else
  LINK.begin(115200);
#endif
  probes.begin();
  probes.setWaitForConversion(false);                     // do not block while probes convert
  lastRx = millis();
}

void loop() {
#if USE_ETHERNET
  if (!netClient || !netClient.connected()) {            // the panel (re)connects; newest connection wins
    EthernetClient c = netServer.accept();
    if (c) { netClient.stop(); netClient = c; line = ""; }
  }
#endif
  while (LINK.available()) {
    char c = LINK.read();
    if (c == '\n') { handle(line); line = ""; }
    else if (c != '\r' && line.length() < 80) line += c;
  }
  unsigned long now = millis();
  if (!watchdogTripped && now - lastRx > WATCHDOG_MS) { allOff(); watchdogTripped = true; LINK.println("ERR watchdog: no messages, all outputs OFF"); }
  for (uint8_t i = 0; i < N_IN; i++) {
    int v = digitalRead(INPUT_PINS[i]) == LOW ? 1 : 0;
    if (v != candIn[i]) { candIn[i] = v; candSince[i] = now; }                     // debounce: wait until the level holds
    else if (v != lastIn[i] && now - candSince[i] >= debounceMs[i]) { lastIn[i] = v; say("DI", INPUT_PINS[i], v); }
  }
  if (now - lastReport > 5000) { lastReport = now; reportInputs(); }
#if USE_STEPPER
  runMotors();
#endif
#if USE_HX711
  for (uint8_t i = 0; i < N_HX; i++) if (hx[i].is_ready()) { hxSum[i] += hx[i].read(); hxN[i]++; }   // about 10 readings a second, never waits
#endif
  if (now - lastFast > 1000) { lastFast = now; reportFast(); }
  if (!tempRequested && now - lastTemp > 2000) { probes.requestTemperatures(); tempRequested = true; lastTemp = now; }
  if (tempRequested && now - lastTemp > 800) { sendTemps(); tempRequested = false; }
}
