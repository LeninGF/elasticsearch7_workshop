# Para borrar todo
DELETE _all

# crear una base de datos taller_es

PUT taller_es
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
      "time_stamp":{
        "type": "date",
        "format": "epoch_millis"
      },
      "sensor":{
        "properties": {
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
      },
      "relation_type":{
        "type": "join",
        "relations":{
          "user":"sensor"
        }
      }
    }
  }
}

# indexando algunos parent en bulk: no funciona
POST taller_es/_bulk
{"index":{"_id":1}}
{"user":"Efra", "user_code":123, "time_stamp":1580250575.856432, "relation_type":{"name":"user"}}
{"index":{"_id":2}}
{"user":"Lenno", "user_code": 456, "time_stamp":1000166400.5, "relation_type":{"name":"user"}}
# fin no funciona

# Indexando algunos parent directo
PUT taller_es/_doc/1?routing=Efra
{
  "user_name":"Efra",
  "user_code": 123,
  "time_stamp": 1580250575.856432,
  "relation_type":{"name": "user"}
}

PUT taller_es/_doc/2?routing=Lenno
{
  "user_name":"Lenno",
  "user_code": 456,
  "time_stamp": 1000166400.5,
  "relation_type":{"name": "user"}
}

# Cheking the mapping

GET taller_es/_mapping

# Ingresando datos de sensor a user id 1
# Ingresando un dato tipo child 
PUT taller_es/_doc/3?routing=Efra
{
  "sensor":[{"Timestamp": 1000166400.5,
              "Vehicle's speed (in m/s)": 0.055034000000000007,
              "Shift number (0 = intermediate position)": 0.0,
              "Engine Load (% of max power)": -1.0,
              "Total Acceleration (m/s^2)": 0.020479,
              "Engine RPM": 608.63
            },
            {"Timestamp": 1000166400.51,
             "Vehicle's speed (in m/s)": 0.056112999999999996,
            "Shift number (0 = intermediate position)": 0.0,
            "Engine Load (% of max power)": -1.0,
            "Total Acceleration (m/s^2)": 0.007929899999999998,
            "Engine RPM": 623.47
  
            }],
  "relation_type": {
    "name":"sensor",
    "parent": 1
  }
}

PUT taller_es/_doc/4?routing=Lenno
{
  "sensor":{"Timestamp": 1000166400.53,
           "Vehicle's speed (in m/s)": 0.060233,
           "Shift number (0 = intermediate position)": 0.0,
           "Engine Load (% of max power)": -1.0,
           "Total Acceleration (m/s^2)": -0.009987200000000002,
           "Engine RPM": 653.14},
  "relation_type":{
    "name": "sensor",
    "parent": 2
  }
}
  


# probando una busqueda. Este codigo encuentra 
# los hijos de un usuario

GET taller_es/_search
{
  "query": {"has_parent": {
    "parent_type": "user",
    "query": {"match": {
      "user_code": "123"
    }}
  }}
}

# Obteniendo cual es el padre de un hijos

GET taller_es/_search
{
  "query":
  {
    "has_child":
    {
      "type":"sensor",
      "min_children":1, "max_children":10,
      "query":{
        "match_all":{}
      }
    }
  }
}


# Adding data to Lenno
PUT taller_es/_doc/4?routing=Lenno
{# Este script busca indexar los datos del taller en estilo parent child
# Se plantea dos usuarios: Efra y Lenno

# Para borrar todo
DELETE _all

# crear una base de datos taller_es con un  mapping Parent - Child

PUT taller_es
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
      "time_stamp":{
        "type": "date",
        "format": "epoch_millis"
      },
      "sensor":{
        "properties": {
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
      },
      "relation_type":{
        "type": "join",
        "relations":{
          "user":"sensor"
        }
      }
    }
  }
}

# Indexando algunos parent directo
PUT taller_es/_doc/1?routing=Efra
{
  "user_name":"Efra",
  "user_code": 123,
  "time_stamp": 1580250575.856432,
  "relation_type":{"name": "user"}
}

PUT taller_es/_doc/2?routing=Lenno
{
  "user_name":"Lenno",
  "user_code": 456,
  "time_stamp": 1000166400.5,
  "relation_type":{"name": "user"}
}

# Cheking the mapping

GET taller_es/_mapping

# Ingresando datos de sensor a user id 123 en forma bulk, note que se crea
# indices para cada dato. Aparentemente no podemos usar aqui una coleccion
# tipo array sin perder datos  ....append no funciono

# Ingresando un dato tipo child, dato 1
PUT taller_es/_doc/u123-1?routing=Efra
{
  "sensor":{
              "Timestamp": 1000166400.5,
              "Vehicle's speed (in m/s)": 0.055034000000000007,
              "Shift number (0 = intermediate position)": 0.0,
              "Engine Load (% of max power)": -1.0,
              "Total Acceleration (m/s^2)": 0.020479,
              "Engine RPM": 608.63
            
  }, "relation_type":{"name":"sensor", "parent":1}
}

PUT taller_es/_doc/u123-2?routing=Efra
{
  "sensor":{
              "Timestamp": 1000166400.51,
              "Vehicle's speed (in m/s)": 0.056112999999999996,
              "Shift number (0 = intermediate position)": 0.0,
              "Engine Load (% of max power)": -1.0,
              "Total Acceleration (m/s^2)": 0.007929899999999998,
              "Engine RPM": 623.47
            
  }, "relation_type":{"name":"sensor", "parent":1}
}


PUT taller_es/_doc/u456-1?routing=Lenno
{
  "sensor":{"Timestamp": 1000166400.53,
           "Vehicle's speed (in m/s)": 0.060233,
           "Shift number (0 = intermediate position)": 0.0,
           "Engine Load (% of max power)": -1.0,
           "Total Acceleration (m/s^2)": -0.009987200000000002,
           "Engine RPM": 653.14},
  "relation_type":{
    "name": "sensor",
    "parent": 2
  }
}
  


# probando una busqueda. Este codigo encuentra 
# los hijos de un usuario

GET taller_es/_search
{
  "query": {"has_parent": {
    "parent_type": "user",
    "query": {"match": {
      "user_code": "123"
    }}
  }}
}

# Obteniendo cual es el padre de un hijos ... todos los padres

GET taller_es/_search
{
  "query":
  {
    "has_child":
    {
      "type":"sensor",
      "min_children":1, "max_children":10,
      "query":{
        "match_all":{}
      }
    }
  }
}

GET taller_es/_search
{
  "query":
  {
    "has_child":
    {
      "type":"sensor",
      "min_children":1, "max_children":10,
      "query":{
        "match":{"_id":"u123-1"}
      }
    }
  }
}

# Adding data to Lenno
PUT taller_es/_doc/u456-2?routing=Lenno
{
  "sensor":{"Timestamp": 2222222.53,
           "Vehicle's speed (in m/s)": -0.060233,
           "Shift number (0 = intermediate position)": -2.0,
           "Engine Load (% of max power)": -2.0,
           "Total Acceleration (m/s^2)": -9999.2,
           "Engine RPM": 1200},
  "relation_type":{
    "name": "sensor",
    "parent": 2  
  }

}

# Adding data to Efra in Append to existing field

PUT taller_es/_doc/u123-3?routing=Efra
{
  "sensor":{
        "Timestamp": 6666.53,
         "Vehicle's speed (in m/s)": -6.6663,
         "Shift number (0 = intermediate position)": -6.60,
         "Engine Load (% of max power)": -6.6,
         "Total Acceleration (m/s^2)": -66666.6,
         "Engine RPM": 6600}      
    ,
    "relation_type":{
    "name": "sensor",
    "parent": 1
    }
}


  "sensor":{"Timestamp": 2222222.53,
           "Vehicle's speed (in m/s)": -0.060233,
           "Shift number (0 = intermediate position)": -2.0,
           "Engine Load (% of max power)": -2.0,
           "Total Acceleration (m/s^2)": -9999.2,
           "Engine RPM": 1200},
  "relation_type":{
    "name": "sensor",
    "parent": 2  
  }

}

# Adding data to Efra in Append to existing field

POST taller_es/_doc/3?routing=Efra
{
  "script": "ctx._source.sensor += newdata",
  "params":{
    "newdata":{
        "Timestamp": 6666.53,
         "Vehicle's speed (in m/s)": -6.6663,
         "Shift number (0 = intermediate position)": -6.60,
         "Engine Load (% of max power)": -6.6,
         "Total Acceleration (m/s^2)": -66666.6,
         "Engine RPM": 6600}      
    },
    "relation_type":{
    "name": "sensor",
    "parent": 1
    }
}

# porque no funciona bulk
# Este codigo que sigue si funciona:
# Ingresando un dato tipo child 
POST taller_es/_bulk?routing=Efra
{"index":{"_id":"u123-1"}}
{"sensor":{"Timestamp": 1000166400.5},"relation_type":{"name":"sensor", "parent":1}}
{"index":{"_id":"u123-1"}}
{"sensor":{"Vehicle's speed (in m/s)": 0.055034000000000007}, "relation_type":{"name":"sensor", "parent":1}}

# Pero sobrescribe los campos de sensor, aparentemente para mandar todos los datos
# del objeto sensor, estos deben ingresar en una sola linea sino no vale

