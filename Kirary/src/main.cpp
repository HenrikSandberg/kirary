#include <Arduino.h>
#include <analogWrite.h>
#include <NTPClient.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <SPI.h>
#include <FirebaseESP32.h>

// Firebase setup
#define FIREBASE_HOST "kirary-fad13.firebaseio.com" 
#define FIREBASE_AUTH "OC47waZR7yjVfACbypdakuotyxwinkNLfqkGnV0I"

//Wi-Fi connection
const char* ssid = "HenriksNyeNettverk"; //"Student";
const char* pass = "G4rNAU6HwwuXXaDXwbEKovLGzhbq6Tq"; //"Kristiania1914"; 

WiFiClient espClient;
FirebaseData firebaseData;
FirebaseJson json;

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

//PINS
const int motor_pin = 18;
const int temprature_pin = 34;
const int moister_pin = 39;

double celcius = 0.00;
int moister_levle = 0;
long last_log = 0l;

int status = WL_IDLE_STATUS;
String DEVICE_ID = "LM3299";
String path = "/devide/";

//Decleared functions
void connect_to_wifi();
void push_temprature(double indata);
void update_temprature();
void read_moister();
void water_plant();
void should_plant_get_water();
void set_up_firebase();
void set_up_time();
void update_logs(String log_nam, String data);
void check_for_upload_logs();

void setup()
{
  Serial.begin(9600);
  
  connect_to_wifi();
  set_up_firebase();
  set_up_time();
}


void loop()
{
  read_moister();
  should_plant_get_water();
  update_temprature();
  check_for_upload_logs();
  delay(100);
}

void set_up_time()
{
  // Initialize a NTPClient to get time
  timeClient.begin();
  
  // Set offset time in seconds to adjust for your timezone, for example:
  // GMT +1 = 3600
  // GMT +8 = 28800
  // GMT -1 = -3600
  // GMT 0 = 0
  timeClient.setTimeOffset(3600);
}

void set_up_firebase()
{
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  
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
    delay(10000);
  }
  
  Serial.println("Wi-fi is now connected");
}

void should_plant_get_water()
{
  if (moister_levle >= 3000)
  {
    water_plant();
    Firebase.setBool(firebaseData, path + DEVICE_ID +"/watering", true);
  }
  else
  {
    Firebase.setBool(firebaseData, path + DEVICE_ID +"/watering", false);
  } 
}

void water_plant()
{
  analogWrite(motor_pin, 255);
  delay(5000);
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
    
    //TODO: Add sunlight
    //update_logs("moister_levle", String(moister_levle));

    last_log = current_time;
  }
}

void update_logs(String log_nam, int data)
{
  String log_key = timeClient.getFormattedDate();
  //json.clear().add(log_key, data);
  //Firebase.pushJSON(firebaseData, path + DEVICE_ID + "/" + log_nam, json);
  Firebase.setInt(firebaseData, path + DEVICE_ID +"/"+log_nam+"/"+log_key, data);
}

void read_moister()
{
  int val = analogRead(moister_pin);
  Serial.print(val);
  Serial.println(" moister");
  if (val > moister_levle + 10) 
  {
    moister_levle = val;
    Firebase.setInt(firebaseData, path + DEVICE_ID +"/moister", moister_levle);
  } 
  else if (val < moister_levle - 10) 
  {
    moister_levle = val;
    Firebase.setInt(firebaseData, path + DEVICE_ID +"/moister", moister_levle);
  }
}

void update_temprature()
{
  double measure = 0.00;
  int number_of_rounds = 100;

  for (int i = 0; i < number_of_rounds; i++)
  {
    measure += (analogRead(temprature_pin) / 4.9);
    delay(10);
  }

  measure = measure / number_of_rounds;

  if (celcius == 0.0)
    push_temprature(measure);
  else if ((measure > celcius + 1.0) && (measure < celcius + 2.0))
    push_temprature(measure);
  else if ((measure < celcius - 1.0) && (measure > celcius - 2.0))
    push_temprature(measure);
}

void push_temprature(double indata)
{
  celcius = indata;
  Serial.print(celcius);
  Serial.println("°C");
  Firebase.setDouble(firebaseData, path + DEVICE_ID +"/temprature", celcius);
}