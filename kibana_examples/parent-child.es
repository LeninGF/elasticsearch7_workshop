PUT /music-5_6
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0

  },
  "mappings": {
    "properties": {
      "artist": {"type": "text"},
      "song": {"type": "text"},
      "user":{"type": "keyword"},
      "artist_relations":{
        "type": "join",
        "relations":{
          "artist": "song",
          "song": "user"
        }
      }
    }
  }
}

# Indexing data // Parent
POST /music-5_6/_bulk
{"index":{"_id":1}}
{"name":"John Legend", "artist_relations":{"name":"artist"}}
{"index":{"_id":2}}
{"name":"Ariana Grande", "artist_relations":{"name":"artist"}}

# INdexing data // Childs
POST music-5_6/_doc/3?routing=1
{
  "song":"All of Me", "artist_relations":{"name":"song", "parent":1}

}

POST music-5_6/_doc/4?routing=1
{
  "song":"Beauty and the beast", "artist_relations":{"name":"song", "parent":1}

}

POST music-5_6/_doc/5?routing=1
{
  "song":"Beauty and the beast", "artist_relations":{"name":"song", "parent":2}

}

# Indexin data // Grand Children
# This line is Gabriel likes "All of me" song
POST music-5_6/_bulk?routing=3
{"index":{"_id":"l-1"}}
{"user":"Gabriel", "artist_relations":{"name":"user", "parent":3}}
{"index":{"_id":"l-2"}}
{"user":"Berte", "artist_relations":{"name":"user", "parent":3}}
{"index":{"_id":"l-3"}}
{"user":"Emma", "artist_relations":{"name":"user", "parent":3}}
#Indexing // Grand Children in single fashion
POST music-5_6/_doc/l-4?routing=4
{"user":"Berte", "artist_relations":{"name":"user", "parent":4}}

POST music-5_6/_doc/l-5?routing=5
{"user":"Emma", "artist_relations":{"name":"user", "parent":5}}

# Finding child by parent i.e find songs (child) of an artist (parent)
GET music-5_6/_search
{
  "query": {
    "has_parent": {
      "parent_type": "artist",
      "query": {
        "match": {
          "name": "John Legend"
        }
      }
    }
  }
}

# Find a grandchildren
GET music-5_6/_search
{
  "query": {
    "has_parent": {
      "parent_type": "song",
      "query": {
        "match": {
          "song": "all of me"
        }
      }
    }
  }
}

# Find a parent by a children: this song belongs to ???
GET music-5_6/_search
{
  "query": {
    "has_child": {
      "type": "song",
      "min_children": 1, "max_children": 10,
      "query": {"match_all": {}}
    }
  }
}

# To know relevant chidren that caused the hit use inner_hits
GET music-5_6/_search
{
  "query": {
    "has_child": {
      "type": "song",
      "min_children": 1, "max_children": 10,
      "query": {"match_all": {}},
      "inner_hits": {}
    }
  }
}

# Retrieve a child document
GET music-5_6/_doc/3?routing=1
GET music-5_6/_doc/5
# Updating a child document
POST music-5_6/_update/5?routing=2
{
  "doc":{
    "song": "Beauty and the Beast (2019)"
  }
}
POST music-5_6/_update/4?routing=2
{
  "doc":{
    "song": "Beauty and the Beast (2019)"
  }
}

# Aggregations: how many users like each song? Display user name
GET music-5_6/_search
{
  "query":{"bool":{
  "must":[{"match":{"title":"Beauty and the Beast (2019)"}}],
  "should":[{"has_child":{"type":"like","query":{
    "match_all":{}},"inner_hits":{}}}]}
  },
  "aggs":{"user_likes":{
    "children":{"type":"like"}}}
}