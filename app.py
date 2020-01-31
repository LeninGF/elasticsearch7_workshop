from flask import Flask, request
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk


es = Elasticsearch(hosts='localhost:9200')
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/create_index', methods=['GET', 'POST'])
def create():
    index_name = request.args.get('index_name')
    body = request.get_json()

    try:
        resp = es.indices.create(index=index_name, body=body)
    except:
        resp = {'response': 'no index created'}
    return resp


@app.route('/index_single', methods=['GET', 'POST'])
def insert():
    index_name = request.args.get('index_name')
    # doc_type = request.args.get('doc_type') # deprecated in version 7 and above
    id_number = request.args.get('id_number')
    body = request.get_json()
    try:
        resp = es.index(index=index_name, id=id_number, body=body)
    except:
        resp = {'response': 'unable to index data in {}'.format(index_name)}
    return resp


@app.route('/index_bulk', methods=['POST'])
def index_with_bulk():
    index_name = request.args.get('index_name')
    body = request.get_json()
    batch_size = request.args.get('batch_size')
    actions = []
    resp = {'response': 'we have a problem', 'batch': batch_size}

    for i, row in enumerate(body):
        actions.append({"_op_type": "index",
                        "_index": index_name,
                        "_id": i,
                        "_source": row})
        # if len(actions) == batch_size:
        result = bulk(es, actions=actions)
            # actions = []

        resp = {'response': result[0], 'batch': batch_size}

    return resp


@app.route('/read', methods=['GET', 'POST'])
def read():
    index_name = request.args.get('index_name')
    # doc_type = request.args.get('doc_type')
    id_number = request.args.get('id_number')
    try:
        resp = es.get(index=index_name, id=id_number)
    except:
        resp = {'response': 'unable to read id={} from index={}'.format(id_number, index_name)}
    return resp


if __name__ == '__main__':
    app.run(debug=True, port=7000)
