from bottle import route, run
import random

# Import URL Parse/Scraper
import urllib
import urllib2
from lxml import etree
from lxml import html

# @route("/<url:path>")
# def index(url):
  # return "Your url is " + url

# def checker(url):
	# url = url
	# usock = urllib2.urlopen(url)
	# size = usock.info().get('Content-Length')
	# if size is None:
		# size = 0
	# size = float(size)
	# size = size / 1024.0
	# size = size / 1024.0
	# return str(size)
	
def checker(url):
	try:
		f = urllib2.urlopen(url)
		if "Content-Length" in f.headers:
			size = int(f.headers["Content-Length"])
		else:
			size = len(f.read());
		return str(size)
	except urllib2.HTTPError, error:
		size = error.read()
		return str(size)

@route('/')
def home():
	return "<div></div>"

@route('/<id>', method='GET')
def hello(id):
	id = id
	id = "http://mp3skull.com/mp3/" + id + ".html"
	#http://asian-central.com:8080/gorillaz%20feeling%20good
	
	#from lxml import html
	#source = html.parse("http://mp3skull.com/mp3/feel%20good.html")
	
	source = html.parse(id)
	songs = source.xpath("//a[starts-with(text(),'Download')]/@href")
	#names = source.xpath("//a[starts-with(text(),'Download')]/text()")
	#song_names = source.xpath("//div[@id='right_song']/div/b/text()")
	#song_info = source.xpath("//div[@class='left']/text()")
	
	#return '<audio><a href="' + i + '">' + i + '</a></audio>'
	
	# for i in songs:
		# print i
		# return i
	
	song = songs[random.randrange(0, 10)]
	
	# song = "http://promodj.com/source/3635769/Gorillaz_Feel_Good_Inc_1_1_EasyTech_Club.mp3"
	
	blacklist = ['audiopoisk.com','promodj.com']
	
	if 'promodj.com' in song:
		song = songs[random.randrange(10, 20)]

	if 'audiopoisk.com' in song:
		song = songs[random.randrange(10, 20)]

	if '4shared.com' in song:
		song = songs[random.randrange(10, 20)]

	if checker(song) < 3145728:
		song = songs[random.randrange(0, 20)]	
		
	# tested = str(exists(song))
	
	# if checker(song) == 0:
		# song = songs[2]
	
	# if tested == False:
		# song = songs[2]
	
			#<title> """ + song_names[1].replace("mp3","").title() + """ </title>
	
	return """
			<html>
			<head>
			<title></title>
			
			<meta name="viewport" content="width=320">
			<link rel="shortcut icon" href="favicon3.png">
			<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
			<style type="text/css">
				body { width: 320px; font-family: "Myriad Pro", "Helvetica", "Arial"; background: transparent; color: white; font-size: 10px; }
			</style>
			
			</head>
			
			<body>
			<audio autoplay='autoplay' controls='controls'>
			<source src='""" + song + """' type="audio/mpeg">
			Your browser does not support the audio element.
			</audio>
			""" + "<div>" + "<br></div></body></html>"
			# + song_names[1].replace("mp3","").title().encode("utf-8")
			# + str(exists(songs[1]))+ str(exists(songs[2]))+ str(exists(songs[3]))
			# <br><audio controls='controls'>
			  # <source src='""" + songs[2] + """' type="audio/mpeg">
			# Your browser does not support the audio element.
			# </audio>
			# <br><audio controls='controls'>
			  # <source src='""" + songs[3] + """' type="audio/mpeg">
			# Your browser does not support the audio element.
			# </audio>
	
	#return id


	
run(host='74.124.200.46', port=8080, debug=True)