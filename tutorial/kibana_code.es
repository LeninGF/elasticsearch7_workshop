DELETE _all
PUT estudiantes_maestria_ki
GET estudiantes_maestria_ki/_settings?pretty

PUT estudiantes_maestria_ki/_settings
{
  "index":{
    "number_of_replicas":2,
    "number_of_shards":2
  }
}

DELETE estudiantes_maestria_ki
DELETE master_candidates_kibana
PUT estudiantes_maestria_ki
{
  "settings": {
    "number_of_replicas": 2,
    "number_of_shards": 2
  }
}

PUT estudiantes_maestria_ki
{
  "mappings": {
    "properties": {
      "nombre": {"type": "text"},
      "apellido": {"type": "text"},
      "cedula_identidad": {"type": "keyword"},
      "email":{"type": "keyword"},
      "edad": {"type": "integer"},
      "fecha_ingreso":{"type": "date", "format": "date"}
    }
  }
}

PUT estudiantes_maestria_ki/_doc/1
{
  "nombre": "Carl",
  "apellido": "Sagan",
  "cedula_identidad": 1234567890,
  "email":"carl.sagan@alien.com",
  "edad": 99,
  "fecha_ingreso":"1934-11-09"
}

POST _bulk
{"index":{"_index": "master_candidates_kibana", "_id":1}}
{ "nombre": "Carl", "apellido": "Sagan", "cedula_identidad": 1234567890, "email":"carl.sagan@alien.com", "profesion": "astrofísica", "libro_escrito": "La diversidad de la ciencia", "edad": 86, "fecha_ingreso":"1934-11-09" }
{"index":{"_index": "master_candidates_kibana", "_id":2}}
{ "nombre": "Richard", "apellido": "Dawkins", "cedula_identidad": 9078563412, "email":"richard.dawkins@nogod.com", "profesion": "astrofísica", "libro_escrito": "el espejismo de dios", "edad": 79, "fecha_ingreso":"1941-03-26"}
{"index":{"_index": "master_candidates_kibana", "_id":3}}
{ "nombre": "Stephen", "apellido": "Hawking", "cedula_identidad": 1234567890, "email":"stephen.hawking@timeisablackhole.com", "profesion": "física teórica", "libro_escrito": "historia del tiempo", "edad": 78, "fecha_ingreso":"1942-01-08"}
{"index":{"_index": "master_candidates_kibana", "_id":4}}
{ "nombre": "Geoffrey", "apellido": "Hinton", "cedula_identidad": 4559879077, "email":"geoffrey.hinton@backpropagationworks.com", "profesion": "machine learning", "libro_escrito": "Artificial Intelligence a Modern Approach", "edad": 73, "fecha_ingreso":"1947-12-06"}
{"index":{"_index": "master_candidates_kibana", "_id":5}}
{"nombre": "Alan","apellido": "Turing", "cedula_identidad": 8803373682, "email":"alan.turing@thisisnpcomplete.com",  "profesion": "matemática", "edad": 108, "fecha_ingreso":"1912-06-23"}

GET master_candidates/_doc/3

POST master_candidates_kibana/_update/5
{
  "doc":{
    "articulo_principal": "Entscheidungsproblem"
  }
}


