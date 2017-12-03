**Description**
Do you have many places to visit but don’t know how to plan your trip? Do you want to save travel distance? Or time? Lets go gives you the ability to plan your optimal trip and you can optimize it by duration or time.

The program uses a set of Google Maps API and some clever algorithm to find you your optimal trip along with directions and a map so that you should only worry about getting yourself in a car and enjoy the trip.

**Requirements:**
Python 3.5
A Google Maps API key

In order to use the Google Maps Distance Matrix API which is required to find distance between places in the server side application, you need to first set a Google Maps API key with Distance Matrix API.

To do this, please run “export MAPS_API_KEY=your_api_key” for Mac and “set MAPS_API_KEY=your_api_key” in your terminal or Command Prompt window.
Here, your_api_key should be substituted with your actual Google Maps API key.

The website needs to be hosted through your computer (via terminal) as the flask configuration does not work properly with cs50 IDE.
Please note that the following modules need to installed:
Flask module
urllib.request
json
requests
itertools

Most of the modules come with python but you may need to install Flask.
To do that:
	First install pip (if not installed already) by running “python get-pip.py” in your terminal
	Then install Flask using “pip install Flask”

To run the project:
Inside your terminal, cd to inside project and then run “application.py”.
Load http://0.0.0.0:2525/compute on your web browser.

The website has a few pages which have information about the project.
The actual tour solving is implemented in the /compute path of the website which can be accessed by putting that path into the web address or clicking on the Compute link at the top of the web page.

**Compute**
The /compute page essentially has a form with fields where you put in your preferences.
Two fields are absolutely necessary to be filled: the starting place and either “Use starting position as final destination” toggle or final destination address.
You can also select up to eight places you would like to visit during the tour in between the start and end places.
The form is set to optimize by distance by default but you can choose to optimize by duration by selecting it.

Please note the following while using the form:
The form only submits when all the address fields show green messages saying “Place Found”. If “Use starting position as final destination” was selected, the final destination field won’t show any message and rather takes on whatever message the starting place field shows.
On submitting the form, if any unrecognized address was entered, the form does not submit and instead points you to the field with the unrecognized address.
While entering place, please select an address from the lists of options displayed. The form does not recognize the address if it is not selected from the options displayed.
If you entered a correct address also displayed in the options but the form doesn’t show the green success message, please delete some part of the address and select the appropriate address from the options.
Most importantly, only enter places that are possible to be visited by driving. Since the program currently optimizes a driving tour, it cannot compute the tour for places inaccessible to one another by driving.

**Computed**
If all the required fields were entered as per requirements, the page will be redirected to /computed where the results will be displaced.
The result is displayed in three parts: Tour, Directions, Map.
Tour displays the order in which to travel to the places you entered. It is the fastest tour if optimized by duration and shortest if optimized by distance. It also gives an approximation for the total duration/duration for the tour.
Directions gives you the directions for traveling between pairs of consecutive places in the tour with approximate distance and duration for the leg.

The /computed page is accessible only via form submission. Otherwise, it redirects the user to the /compute page.

The website will ultimately have three other pages- an index page which will have information about the project, a page which explains the workings of the program and another on the traveling salesman problem. They are however, currently unavailable.

All the pages have links to CS50, Creative Tim and Google Maps API.
I used the elements from the Material Kit template from Creative Tim with some personal modifications to create the design for my web pages.
The icons are from google’s Material icons library. 
Google Maps API allows the place address autocomplete and some other backend works needed for the program.









