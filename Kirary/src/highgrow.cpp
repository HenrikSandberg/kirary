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
const char* ssid =  "Student";
const char* pass =  "Kristiania1914";

WiFiClient espClient;
FirebaseData firebaseData;

// DEFINE NTP CLIENT TO GET TIME
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

const int MAX_MOISTER = 3195;
const int SOILPIN = 32;
int moister_levle = 0;
long last_log = 0l;

int status = WL_IDLE_STATUS;
String DEVICE_ID = "LM3429";
String path = "/devide/" + DEVICE_ID;

// DECLEARD FUNCTIONS
void connect_to_wifi();
void read_moister();
void set_up_firebase();
void set_up_time();
void check_for_upload_logs();
void update_logs(String log_nam, String data);

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
  check_for_upload_logs();
  delay(1000);
}

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

void update_logs(String log_nam, int data)
{
  String log_key = String(timeClient.getFormattedDate());
  Firebase.setInt(firebaseData, path + "/"+log_nam+"/"+log_key, data);
}

void read_moister()
{
    int measure = 0.00;
    const int number_of_rounds = 100;

    for (int i = 0; i < number_of_rounds; i++)
    {
        measure += analogRead(SOILPIN);
        delay(10);
    }

    int moister_reading = measure / number_of_rounds;
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

void check_for_upload_logs()
{
  timeClient.update();
  long current_time = timeClient.getEpochTime()/(60*60);

  if (current_time > last_log)
  {
    update_logs("moister_log", moister_levle);
    last_log = current_time;
  }
}