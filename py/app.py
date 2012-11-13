from bottle import route, run

# Import URL Parse/Scraper
import urllib
from lxml import etree
from lxml import html

# @route("/<url:path>")
# def index(url):
  # return "Your url is " + url

@route('/')
def home():
	return "Welcome to Peter's Development Server!"

@route('/<id>', method='GET')
def hello(id):
	id = id
	id = "http://mp3skull.com/mp3/" + id + ".html"
	#http://asian-central.com:8080/gorillaz%20feeling%20good
	#http://asian-central.com:8080/
	
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
	
	song = songs[1]
	# tested = str(exists(song))
	
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
				body { width: 320px; font-family: "Myriad Pro", "Helvetica", "Arial"; background: black; color: white; font-size: 10px; }
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