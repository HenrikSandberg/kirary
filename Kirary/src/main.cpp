#include <Arduino.h>
#include <analogWrite.h>
#include <NTPClient.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <SPI.h>
#include <FirebaseESP32.h>

// FIREBASE SETUP
#define FIREBASE_HOST "kirary-fad13.firebaseio.com" 
#define FIREBASE_AUTH "OC47waZR7yjVfACbypdakuotyxwinkNLfqkGnV0I"

// WI-FI CONNECTION
const char* ssid =  "Student"; // "HenriksNyeNettverk";
const char* pass =  "Kristiania1914"; //"G4rNAU6HwwuXXaDXwbEKovLGzhbq6Tq"; 

WiFiClient espClient;
FirebaseData firebaseData;

// DEFINE NTP CLIENT TO GET TIME
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

// PINS
const int motor_pin = 18;
const int temprature_pin = 34;
const int moister_pin = 39;
const int light_pin = 35;
const int water_storeage_pin = 33;

// VARIABLES
double celcius = 0.00;
int moister_levle = 0;
long last_log = 0l;
int water_tank_reading = 0;
const int MAX_MOISTER = 4095;

int status = WL_IDLE_STATUS;
String DEVICE_ID = "LM3429";
String path = "/devide/" + DEVICE_ID;

const int num_readings = 10;
int readings[num_readings];
int read_index = 0;
int total = 0;
int average_light = 0;

// DECLEARD FUNCTIONS
void connect_to_wifi();
void read_temprature();
void read_moister();
void water_plant();
bool should_plant_get_water();
void set_up_firebase();
void set_up_time();
void update_logs(String log_nam, String data);
void check_for_upload_logs();
void update_light();
void update_water_tank();

void setup()
{
  Serial.begin(9600);
  connect_to_wifi();
  set_up_firebase();
  set_up_time();

  for (int thisReading = 0; thisReading < num_readings; thisReading++) {
    readings[thisReading] = 0;
  }
}

/* update_light(); */
void loop()
{
  read_moister();
  read_temprature();
  update_water_tank();

  water_plant();

  check_for_upload_logs();
  delay(1000);
}

// FUNCTION BODIES

// Initialize a NTPClient to get time
// Set offset time in seconds to adjust for your timezone, for example:
// GMT +1 = 3600
// GMT +8 = 28800
// GMT -1 = -3600
// GMT 0 = 0
void set_up_time()
{
  timeClient.begin();
  timeClient.setTimeOffset(3600);
}

void set_up_firebase()
{
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000*15); //Minute 1000 * 60
  
  //Size and its write timeout e.g. tiny (1s), small (10s), medium (30s) and large (60s).
  Firebase.setwriteSizeLimit(firebaseData, "small");
}

void connect_to_wifi()
{
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(5000);
  }
  
  Serial.println("Wi-fi is now connected");
}

void update_light()
{
  const int last_reading = average_light;

  total = total - readings[read_index];
  readings[read_index] = analogRead(light_pin);
  total = total + readings[read_index];
  read_index = read_index + 1;

  if (read_index >= num_readings) 
  {
    read_index = 0;
  }

  average_light = total / num_readings;

  if (average_light > last_reading + 50)
  {
    Firebase.setInt(firebaseData, path + "/light", average_light);
  } 
  else if (average_light < last_reading - 50)
  {
    Firebase.setInt(firebaseData, path + "/light", average_light);
  }
}

bool should_plant_get_water()
{
  if (Firebase.getBool(firebaseData, path + "/watering"))
  {
    return firebaseData.boolData();
  }
  return false;
}

void update_water_tank()
{
  int measure = 0;
  const int number_of_rounds = 100;

  for (int i = 0; i < number_of_rounds; i++)
  {
    measure += analogRead(water_storeage_pin);
    delay(10);
  }

  const int read_water = measure / number_of_rounds;

  if (read_water > water_tank_reading + 50)
  {
    water_tank_reading = read_water;
    Firebase.setInt(firebaseData, path + "/water_storeage", water_tank_reading);
  } 
  else if (read_water < water_tank_reading - 50)
  {
    water_tank_reading = read_water;
    Firebase.setInt(firebaseData, path + "/water_storeage", water_tank_reading);
  }
}

void water_plant()
{
  if (should_plant_get_water())
  {
    analogWrite(motor_pin, 255);
    delay(5000);
  }
  analogWrite(motor_pin, 0);
}

void check_for_upload_logs()
{
  timeClient.update();
  long current_time = timeClient.getEpochTime()/(60*60);

  if (current_time > last_log)
  {
    update_logs("moister_log", moister_levle);
    update_logs("celcius_log", celcius);
    //update_logs("light_log", average_light);

    last_log = current_time;
  }
}

void update_logs(String log_nam, int data)
{
  String log_key = String(timeClient.getFormattedDate());
  Firebase.setInt(firebaseData, path + "/"+log_nam+"/"+log_key, data);
}

void read_moister()
{
  int moister_reading = analogRead(moister_pin);
  moister_reading = MAX_MOISTER - moister_reading;
  
  if (moister_reading > moister_levle + 50) 
  {
    moister_levle = moister_reading;
    Firebase.setInt(firebaseData, path + "/moister", moister_levle);
  } 
  else if (moister_reading < moister_levle - 50) 
  {
    moister_levle = moister_reading;
    Firebase.setInt(firebaseData, path + "/moister", moister_levle);
  }
}

void read_temprature()
{
  double measure = 0.00;
  const int number_of_rounds = 100;

  for (int i = 0; i < number_of_rounds; i++)
  {
    measure += (analogRead(temprature_pin) / 4.9);
    delay(10);
  }

  measure = measure / number_of_rounds;
  Serial.println(measure);

  if (celcius == 0.0)
  {
    celcius = measure;
    Firebase.setDouble(firebaseData, path +"/temprature", celcius);
  }
  else if (measure > celcius + 0.5)
  {
    celcius = measure;
    Firebase.setDouble(firebaseData, path +"/temprature", celcius);
  }
  else if (measure < celcius - 0.5)
  {
    celcius = measure;
    Firebase.setDouble(firebaseData, path +"/temprature", celcius);
  }

}