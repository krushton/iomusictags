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
	return "Hello World!"

@route('/<id>', method='GET')
def hello(id):
	id = id
	id = "http://mp3skull.com/mp3/" + id + ".html"
	
	source = html.parse(id)
	songs = source.xpath("//a[starts-with(text(),'Download')]/@href")
	names = source.xpath("//a[starts-with(text(),'Download')]/text()")
	
	for i in songs:
		#return '<audio><a href="' + i + '">' + i + '</a></audio>'
		return """<audio autoplay='autoplay' controls='controls'>
				  <source src='""" + i + """' type="audio/mpeg">
				Your browser does not support the audio element.
				</audio>"""
	#return id


	
run(host='74.124.200.46', port=8080, debug=True)