/**************************************************************************/
/*
	Lectura de tarjetas ISO14443A con un AID específico mediante la placa PN532
	Envia el AID a un endpoint para determinar si se prende un led verde o rojo,
	indicando si se autoriza el acceso.
*/
/**************************************************************************/
//Comunicacion con la placa mediante "High Speed UART" (HSU)
#include <PN532_HSU.h>
#include <PN532.h>
//Cosas para manejar peticiones HTTP, osea, IoT
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>

//En el Arduino Nano ESP32 los pines Rx y Tx corresponden al serial 0
PN532_HSU pn532hsu(Serial0);
PN532 nfc(pn532hsu);

WiFiMulti wifiMulti;

//tabla de IDs de usuarios permitidos en modo local
#define USERID_LEN 4
uint8_t Users[]={
        0xDE, 0xAD, 0xCA, 0xFE,  
        0xc0, 0xc0, 0xb0, 0xb0,
		0xBE, 0xBE, 0x20, 0x99
};

//funcion de ayuda para encender las luces RGB
void rgb(bool R, bool G, bool B)
{
	//invertidos para arduino nano
	digitalWrite(LED_RED, !R);
	digitalWrite(LED_GREEN, !G);
	digitalWrite(LED_BLUE, !B);
}

void loadingscreen()
{
	for(int i=0; i<5; i++)
	{
		rgb(1,1,0);
		delay(50);
		rgb(0,0,0);
		delay(50);
	}
}

//Comparar bytes con la tabla de usuarios local
bool checkUser( uint8_t userId[USERID_LEN] )
{
	Serial.print("checkUser: ");
	//usamos la funcion de ayuda para imrpimir los bytes del userId
	nfc.PrintHex(userId, USERID_LEN);
	//para conteos se prefieren los numeros cardinales, representados con size_t
	const size_t userCount = sizeof(Users)/USERID_LEN;
	//para cada usuario...
	for(size_t u=0; u<userCount; u++)
	{
		//accedemos a los bytes de cada userID haciendo un offset
		//apuntador const para evitar romperlo
		const uint8_t* user = &Users[u * USERID_LEN];
		//comparamos los bytes, memcmp da 0 cuando todos los bytes son iguales
		if (memcmp( userId, user, USERID_LEN )==0  )
		{
			return true;
		}
	}
	return false;
}

//Enviar el ID escaneado al endpoint del sistema 
//idealmente, deberia ser HTTPS pero configurarlo aqui requiere mucho codigo
//asi que el servidor está configurado para aceptar esta peticion en HTTP
const char* ENDPOINT = "http://monsterballgo.com/app-access/api/scanner";
bool checkUserHTTP(uint32_t userId)
{
	HTTPClient http;
	http.setTimeout(5000);
	String url = String(ENDPOINT)+"?id="+String(userId) + "&token=code37";
	if (!http.begin(url)) {
		Serial.println("HTTP begin() fallo");
		return false;
	}
	int code = http.GET();
	if (code != HTTP_CODE_OK) {
		Serial.printf("HTTP code: %d\n", code);
		http.end();
		return false;
	}
	String res = http.getString();
	res.trim();//remover CRLF
	Serial.print("respuesta del server: ");
	Serial.println(res);
	http.end();
	return res.equalsIgnoreCase("si");
}

void setup(void) 
{
	pinMode(LED_BUILTIN, OUTPUT);
	pinMode(LED_RED, OUTPUT);
	pinMode(LED_GREEN, OUTPUT);
	pinMode(LED_BLUE, OUTPUT);
	Serial.begin(115200);
	loadingscreen();
	//esperar a que se conecte el serial para continuar. usado en pruebas
	//rgb(1,1,1);
	//Serial.begin(115200);
	//while(!Serial){;}
	//rgb(0,0,0);
	Serial.print("Conexion serial lista, inicializando lector NFC...\n");

	#if defined(ARDUINO_ARCH_ESP32)
	Serial.print("ARDUINO_ARCH_ESP32\n");
	#endif	

	//enviar comandos a la placa PN532 para inicializarla
	Serial0.begin(115200);
	//ahora el wakeup
	Serial0.write(0x55);
	Serial0.write(0x55);
	Serial0.write(0);
	Serial0.write(0);
	Serial0.write(0);
	if(Serial0.available())
	{
		Serial.println("Dump serial1 buffer: ");
	}
	while(Serial0.available())
	{
		uint8_t ret = Serial0.read();
        Serial.print(' '); Serial.print((ret>>4)&0x0F, HEX); Serial.print(ret&0x0F, HEX);
	}
	
	uint32_t versiondata = nfc.getFirmwareVersion();
	if (! versiondata) {
		Serial.println("PN532 no encontrada");
		rgb(true, false, false);while (1);
	}
	// Got ok data, print it out!
	Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
	Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
	Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
	
	// configure board to read RFID tags
	nfc.SAMConfig();
	Serial.println("Esperando ISO14443A Card ...");

	//Agregar redes wifi
	wifiMulti.addAP("OpenWRT", "Chocolate2099");
	wifiMulti.addAP("LaSalleWifi", "");
}


void loop(void) 
{
	uint8_t success;
	uint8_t response[255];
	uint8_t responseLength;

	//configurar el wifi
	if((wifiMulti.run() == WL_CONNECTED)) 
	{
		success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, response, &responseLength);
		if (success) {
			Serial.println("Found a device!");
			Serial.println("nfc.readPassiveTargetID: ");
			Serial.print("responseLength: "); Serial.println(responseLength);
			Serial.print("response: ");
			nfc.PrintHex(response, (uint32_t)responseLength);
			Serial.print("InListedTag:"); Serial.println(nfc.getInListedTag());
			delay(100);
			// Establecemos el AID para que Android sepa que app debe responder a esta peticion
			// AID: F0 12 34 56 78 el mismo que se establece en apduservice.xml
			// Structura: CLA INS P1 P2 Lc [DATA] Length
			uint8_t selectApp[] = { 
			0x00, 0xA4, 0x04, 0x00, 0x05, 
			0xF0, 0x12, 0x34, 0x56, 0x78, 0x00
			};
			uint8_t relayResponse[64];
			uint8_t relayResponseLength = 64;
			success = nfc.inDataExchange(selectApp, sizeof(selectApp), relayResponse, &relayResponseLength);
			if (success) {
				Serial.print("Respuesta del Android: ");
				nfc.PrintHex(relayResponse, relayResponseLength);

				// si la respuesta termina en 0x90 0x00, significa que hubo exito en la peticion
				if (relayResponse[relayResponseLength-2] == 0x90) 
				{
					Serial.println("EXITO en la transaccion de datos");
					//ahora toca leer el payload y comprobar si es un usuario autorizado
					uint8_t userId[4];
					//forma ultra bajo nivel para copiar n bytes
					memcpy(userId , relayResponse, 4);
					//if ( relayResponseLength>=6 &&  checkUser (userId ) ) 
					//forma local temporal de pruebas para coincidir con los bytes DEADCAFE y DEADCODE que enviaa la app de muestra
					uint32_t id;
					if(userId[3]== 0xFE)  id = 3004; //npc envia DEADCAFE
					else if(userId[3]== 0xDE)  id = 111; //changuito envia DEADCODE
					else //enviar directos los 4 bytes como un uint32
					{
						memcpy( &id, userId,4 );
					}
					Serial.print("id:::");
					Serial.println(id);
					if( checkUserHTTP(id) )
					{
						Serial.println("AUTORIZADO");
						rgb(0,1,0);
						delay(500); 
						rgb(0,0,0);
					}
					else
					{
						Serial.println("NO AUTORIZO");
						rgb(1,0,0);
						delay(500);
						rgb(0,0,0);
					}
				}
			} else //no fue una transaccion APDU exitosa, entonces asumir que es una tarjeta física
			{
				//nfc.PrintHex(response, responseLength);
				//el id de la tarjeta son los ultimos 4 bytes de response
				//para probar asignamos una tarjeta a un ID hardcoded
				uint32_t id;
				//Serial.println(response[responseLength-4], HEX);
				if(response[responseLength-4]== 0x46)  id = 3004; //tarjeta blanca ok
				else if(response[responseLength-4]== 0xF9)  id = 111; //tag azul es changuito NO AUTORIZO
				else //convertir el id a entero usando otra forma de copiar bytes
				{
					uint8_t *p = &response[responseLength-4];
					id = ((uint32_t)p[0]<<24) |
						((uint32_t)p[1]<<16) |
						((uint32_t)p[2]<<8) |
						((uint32_t)p[3]);

					Serial.print("id de tarjeta: ");
					Serial.println(id);

				}
				if( checkUserHTTP(id) )
					{
						Serial.println("AUTORIZADO");
						rgb(0,1,0);
						delay(500); 
						rgb(0,0,0);
					}
					else
					{
						Serial.println("NO AUTORIZO");
						rgb(1,0,0);
						delay(500);
						rgb(0,0,0);
					}
			}
			delay(1000);
		}
	}
	else //If wifi...
	{
		rgb(0,1,1);
		//esperar 1 seg e intentar de nuevo
		delay(1000);
		rgb(0,0,0);
	}
}
