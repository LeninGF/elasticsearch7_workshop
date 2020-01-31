DELETE _all

PUT pets_db
{
  "mappings": {
    "properties": {
      "name":{
        "type":"text"
      },
      "cats":{
        "type": "nested",
        "properties": {
          "name":{
            "type":"text"
          },
          "colors":{
            "type":"integer"
          },
          "breed":{
            "type":"text"
          }
        }
      }
    }
  }
}


POST pets_db/_doc/1
{
  "name":"Lenno",
  "cats":[
    {
      "colors":1,
      "name": "keiko",
      "breed":"persian"
    },
    {
      "colors":2,
      "name": "fifi",
      "breed":"blue russian"
    },
    {
      "colors":3,
      "name": "safi",
      "breed":"tangarine"
    }
    ]
}

POST pets_db/_doc/2
{
  "name":"Eleni",
  "cats":[
    {
      "colors":4,
      "name": "keiko2",
      "breed":"persian black"
    },
    {
      "colors":5,
      "name": "fifi2",
      "breed":"black russian"
    },
    {
      "colors":6,
      "name": "safi2",
      "breed":"nice kitty"
    }
    ]
}


GET pets_db/_doc/2

POST pets_db/_doc/1/_update
{
  "script":{
    "source": "ctx._source.cats.add(params.cat)",
    "params":{
      "cat":{
        "colors":8,
        "name": "roberta maria 56",
        "breed": "alaguena"
      }
    }
  }
}

POST pets_db/_doc/2/_update
{
  "script":{
    "source": "ctx._source.cats.add(params.cat)",
    "params":{
      "cat":{
        "colors":9,
        "name": "roberta maria 756",
        "breed": "alaguena"
      }
    }
  }
}