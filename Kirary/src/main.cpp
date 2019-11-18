#include <Arduino.h>
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

int status = WL_IDLE_STATUS;
String DEVICE_ID = "LM3299";
String path = "/devide/";

void connect_to_wifi();

void setup()
{
  Serial.begin(9600);

  while (!Serial);
  SPI.begin();

  connect_to_wifi();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  //tiny, small, medium, large and unlimited.
  //Size and its write timeout e.g. tiny (1s), small (10s), medium (30s) and large (60s).
  Firebase.setwriteSizeLimit(firebaseData, "tiny");

  for (int i = 0; i < 10; i++) {
    Firebase.setDouble(firebaseData, path + DEVICE_ID +"/Double/Data" + (i + 1), i*10.00);
    delay(5000);
  }
}

void loop()
{

}

//((i + 1) * 10) + 0.123456789

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


//MARK: - Code for the future
//int pinOut = 10;

//Kode for turning on and off water pump
/*
digitalWrite(pinOut, HIGH);
delay(5000);
digitalWrite(pinOut, LOW);
delay(5000);
*/

//Kode for reading from the moister sensor
/*
int val;
val = analogRead(0);
Serial.println(val);
delay(1000);
*/