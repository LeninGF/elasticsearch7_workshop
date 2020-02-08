import http.client
import requests
from datetime import datetime
import pandas
import numpy
import glob
import json
import time
import tqdm
import csv
import os
from tqdm import tqdm


def write_data_to_json(dict, path, json_file_name):
    filename = os.path.join(path, json_file_name)
    if os.path.isfile(filename):
        with open(filename, "r") as read_json:
            data = json.load(read_json)
            data.update(dict)
            read_json.close()
        with open(filename, "w") as write_file:
            json.dump(data, write_file, indent=2)
            # print('{} file written to {}'.format(json_file_name, path))
    else:
        # File does not exist so create it
        with open(filename, "w") as write_file:
            json.dump(dict, write_file, indent=2)
            # print('{} file written to {}'.format(json_file_name, path))


"""single user cars dataset"""

# variables
# input_folder = "processed_data"
# batch_size = 10 # per user
# update_rate = 5 # in seconds


# conn = http.client.HTTPSConnection("www.httpbin.org")
# headers = {"Content-type": "application/json"}


# names = glob.glob(f"{input_folder}/*.csv")
# names.sort()


# print("Select file number:")
# for i, name in enumerate(names):
#	print(i, name)

# i = input()
# if i not in range(len(names)):
#	i = 0

# data = pandas.read_csv(names[i], chunksize = batch_size)


# while True:
#	for batch in data:
#		batch_json = json.dumps(batch.to_dict("list"))
#		conn.request("POST", "/post", batch_json, headers)
#		response = conn.getresponse()
#		print(response.read().decode())
#		time.sleep(update_rate)


"""multiple users cars dataset"""

##### variables
input_folder = "processed_data"
# number_of_samples = 21229  # 21229 is the number of rows of the smallest file
number_of_samples = 20000
number_of_users = 4
batch_size = 10
update_rate = 5
headers = {"Content-type": "application/json"}

names = glob.glob(f"{input_folder}/*.csv")
names.sort()

names = names[:number_of_users]

data = []

for i in range(len(names)):
    reader = pandas.read_csv(names[i])
    data.append(reader)

cont = 0
while cont < 10:
    for i in tqdm(range(0, number_of_samples, batch_size)):
        batch = {}  # pandas.DataFrame()
        batch_arr = []
        for j in range(len(names)):  # discrinate by user
            readings = data[j][i: i + batch_size].to_dict("records")
            batch = {"timestamp": datetime.timestamp(datetime.now()), "userId": j, "sensorData": readings}
            batch_arr.append({"timestamp": datetime.timestamp(datetime.now()), "userId": j, "sensorData": readings})
            batch_json = json.dumps(batch_arr)
            # temp = json.loads(str(batch))
            write_data_to_json(batch, './json_files', 'new_20k_sensor_data_user_' + str(j) + '.json')
        response = requests.post("http://httpbin.org/post", data=batch_json, headers=headers)
        print(response.text)
        time.sleep(update_rate)
    cont += 1
"""used cars"""

##### variables
# input_folder = "used_cars"
#
#
#
# names = glob.glob(f"{input_folder}/**/*.csv", recursive = True)
# names.sort()


"""youtube dataset"""

####### variables
# input_folder = "youtube_new"
# batch_size = 10
# update_rate = 5 # in seconds


# conn = http.client.HTTPSConnection("www.httpbin.org")
# headers = {"Content-type": "application/json"}


# names = glob.glob(f"{input_folder}/*.csv")
# names.sort()

# print("Select file number:")
# for i, name in enumerate(names):
#	print(i, name)

# i = input()
# if i.isdigit() == True:
#	if int(i) in range(len(names)):
#		i = int(i)
#	else:
#		i = 0
# else:
#	i = 0

# data = pandas.read_csv(names[i], chunksize = batch_size)


# while True:
#	for batch in data:
#		response = requests.post("http://localhost:3030/sensor-data/add", json = batch.to_dict("list"), headers = headers)
#		print(response.text)
#		time.sleep(update_rate)


"""youtube dataset"""

####### variables
# input_folder = "youtube_new"
# batch_size = 10
# update_rate = 5 # in seconds


# conn = http.client.HTTPSConnection("www.httpbin.org")
# headers = {"Content-type": "application/json"}


# names = glob.glob(f"{input_folder}/*.csv")
# names.sort()

# print("Select file number:")
# for i, name in enumerate(names):
#	print(i, name)

# i = input()
# if i not in range(len(names)):
#	i = 0

# data = pandas.read_csv(names[i], chunksize = batch_size)


# while True:
#	for batch in data:
#		batch_json = json.dumps(batch.to_dict("list"))
#		conn.request("POST", "/post", batch_json, headers)
#		response = conn.getresponse()
#		print(response.read().decode())
#		time.sleep(update_rate)


# """timestamp"""

###### variables
# input_folder = "processed_data"


# names = glob.glob(f"{input_folder}/*.csv")
# names.sort()


# delta = datetime.timedelta(milliseconds = 10)


# for i in tqdm.tqdm(range(len(names))):
#	dt = datetime.datetime(2001, 9, 11)
#	df = pandas.read_csv(names[i])
#	df = df.drop("Time (in seconds)", 1)
#	
#	stamps = numpy.zeros((df.shape[0], 1))
#	for j in range(df.shape[0]):
#		stamps[j] = dt.replace(tzinfo = datetime.timezone.utc).timestamp()
#		dt += delta
#	
#	df.insert(0, "Timestamp", stamps)
#	df.to_csv(names[i], index = 0)
