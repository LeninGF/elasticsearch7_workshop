# Este script busca indexar los datos del taller en estilo nested object
# Se plantea dos usuarios: Efra y Lenno
# Cada usuario tiene medidas de sus sensores que se indexan como childs


# Borrando todas las bases

DELETE _all

# Creando una base de datos taller_nes 

PUT taller_nes
{
  "settings": {
    "number_of_replicas": 0,
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "user_name":{
        "type": "text"
      },
      "user_code":{
        "type": "keyword"
      },
      "user_time_stamp":{
        "type": "date", 
        "format": "epoch_millis"
      },
      "sensor":{
        "type": "nested",
        "properties": {
          "sensor_code":{
            "type": "keyword"
          },
          "Timestamp": {
            "type":"date",
            "format":"epoch_millis"
          },
          "Vehicle's speed (in m/s)": {"type": "float"},
          "Shift number (0 = intermediate position)": {"type": "float"},
          "Engine Load (% of max power)": {"type":"float"},
          "Total Acceleration (m/s^2)": {"type": "float"},
          "Engine RPM": {"type": "float"}
        }
      }
    }
  }
}

PUT taller_nes
{
  "settings": {
    "number_of_replicas": 0,
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "user_name":{
        "type": "text"
      },
      "user_code":{
        "type": "keyword"
      },
      "user_time_stamp":{
        "type": "date", 
        "format": "epoch_millis"
      },
      "sensor":{
        "type": "nested"
        
      }
    }
  }
}

# Ingresando usuarios; aparentemente tiene que incializar con datos en el sensor; no puede estar vacío.

POST taller_nes/_doc/1
{
  "user_name":"Efra",
  "user_code": 123,
  "user_time_stamp": 1580488444.05,
  "sensor":[
    {
      "sensor_code": 1,
      "Timestamp": 1000166400.5,
      "Vehicle's speed (in m/s)": 0.055034000000000007,
      "Shift number (0 = intermediate position)": 0.0,
      "Engine Load (% of max power)": -1.0,
      "Total Acceleration (m/s^2)": 0.020479,
      "Engine RPM": 608.63
    },
    {
      "sensor_code": 2,
      "Timestamp": 1000166400.51,
      "Vehicle's speed (in m/s)": 0.056112999999999996,
      "Shift number (0 = intermediate position)": 0.0,
      "Engine Load (% of max power)": -1.0,
      "Total Acceleration (m/s^2)": 0.007929899999999998,
      "Engine RPM": 623.47
    }]
}

POST taller_nes/_doc/2
{
  "user_name": "Lenno",
  "user_code": 456,
  "user_time_stamp": 1000166400.5,
  "sensor":{
    "sensor_code": 1,
    "Timestamp": 1000166400.53,
    "Vehicle's speed (in m/s)": 0.060233,
    "Shift number (0 = intermediate position)": 0.0,
    "Engine Load (% of max power)": -1.0,
    "Total Acceleration (m/s^2)": -0.009987200000000002,
    "Engine RPM": 653.14
  }
}


# Ingresar mas datos a Efra
POST taller_nes/_doc/2/_update
{
  "script":{
    "source": "ctx._source.sensor.add(params.data)",
    "params": {
      "data":{
        "sensor_code":3,
        "Timestamp":  1580488444.05,
         "Vehicle's speed (in m/s)": -6.6663,
         "Shift number (0 = intermediate position)": -6.60,
         "Engine Load (% of max power)": -6.6,
         "Total Acceleration (m/s^2)": -66666.6,
         "Engine RPM": 6600} 
    }
  }
}