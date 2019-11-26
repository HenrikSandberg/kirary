#include <Arduino.h>
#include <analogWrite.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <SPI.h>
#include <FirebaseESP32.h>

// Firebase setup
#define FIREBASE_HOST "kirary-fad13.firebaseio.com" 
#define FIREBASE_AUTH "OC47waZR7yjVfACbypdakuotyxwinkNLfqkGnV0I"

//Wi-Fi connection
const char* ssid = "Student"; //"HenriksNyeNettverk"; //
const char* pass = "Kristiania1914"; //"G4rNAU6HwwuXXaDXwbEKovLGzhbq6Tq"; //

WiFiClient espClient;
FirebaseData firebaseData;

//PINS
const int motor_pin = 18;
const int temprature_pin = 34;
const int moister_pin = 39;

double celcius = 0.00;
int moister_levle = 0;

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

void setup()
{
  Serial.begin(9600);
}


/*
  connect_to_wifi();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  
  //Size and its write timeout e.g. tiny (1s), small (10s), medium (30s) and large (60s).
  Firebase.setwriteSizeLimit(firebaseData, "small");
*/


void loop()
{
  read_moister();
  should_plant_get_water();
}

/*
  update_temprature();
  read_moister();
  delay(1000);
*/

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
  Firebase.setDouble(firebaseData, path + DEVICE_ID +"/temprature", celcius); //TODO: Maybe make history data here
}