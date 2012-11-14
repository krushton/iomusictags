import json, math, urllib, urllib2
from collections import OrderedDict


nodes = []
links = []

def call_api(url, params):
    data = urllib.urlencode(params)
    req = urllib2.Request(url, data)
    # Returns a Python dict of the JSON
    return json.loads(urllib2.urlopen(req).read())

def get_similar_tags(tag):
	tags = []
	params = {"method" : "tag.getsimilar", "format" : "json", "tag" : tag, "api_key" : api_key}
	similarity_data = call_api(url, params)
	return similarity_data['similartags']['tag']

def find_index(list, name):
	for i in range(0, len(list)):
		if (list[i]['name'] == name):
			return i
		return -1

def get_sim_score(aTags, bTags):
	simscore = 0
	for a in aTags:
		for b in bTags:
			if a['name'] == b['name']:
				simscore = simscore + 2

	return simscore

def calculate_similarity(startPoint):
     if startPoint == len(nodes)-1:
         return
     else:
     	node = nodes[startPoint]
     	atags = get_similar_tags(node['name'])
        for i in range(startPoint+1,len(nodes)):
         	btags = get_similar_tags(nodes[i]['name'])
         	similarity = get_sim_score(atags, btags)
         	links.append({"source": startPoint, "target": i, "value": similarity })
        calculate_similarity(startPoint+1)


url = "http://ws.audioscrobbler.com/2.0/?"
api_key = "392f7fd530902126a2bc75e9acf5adad"

f = open('toptags.json')
d = json.load(f)

index = 1
for tag in d['toptags']['tag']:
	if index <= 50:
		nodes.append({"name" : tag['name'], "freq": int( int(tag["count"])/10000)})
		index = index + 1
w = open('fewer.json', 'w')

calculate_similarity(0)


complete = { "nodes": nodes, "links": links}
w.write(json.dumps(complete))