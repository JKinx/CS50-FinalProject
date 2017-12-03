from flask import Flask, flash, redirect, render_template, request, session, url_for
from urllib.request import urlopen
import json
import requests
import itertools
import os

# Get place names, distance/time adjacency matrix
def get_info(places, number, optimizeBy):

    # Call google maps distance API to get distances/duration between pairs of places
    results = requests.get(places,auth=('user', 'pass')).json()

    # Check if correct data was received from the API call
    if results["status"] == "OK":
        place_names =[]
        
        distance_matrix = [[0 for x in range(number)] for y in range(number)]
        

        for row in range(number):
            place_names.append(results["destination_addresses"][row])
            for col in range(number):

                # return None if no distance/duration found for pair of places
                if results["rows"][row]["elements"][col]["status"] != "OK":
                    return "No Connection", None

                distance_matrix[row][col] = results["rows"][row]["elements"][col][optimizeBy]["value"]
                
        return distance_matrix, place_names
    else: 
        return None, None

# Solve the TSP for the given adjacency matrix and return best combination with total distance/duration
def tsp_rec_solve(d,place_names,end, optimizeBy):

    # Function to solve TSP dynamically
    def rec_tsp_solve(c, ts):
        assert c not in ts
        if ts:
            return min((d[lc][c] + rec_tsp_solve(lc, ts - set([lc]))[0], lc)
                       for lc in ts)
        else:
            return (d[0][c], 0)
 
    # Solve TSP and find correct order
    best_tour = []
    c = end
    cs = set(range(1, len(d)))-set([c])
    while True:
        l, lc = rec_tsp_solve(c, cs)
        if lc == 0:
            break
        best_tour.append(lc)
        c = lc
        cs = cs - set([lc])
 
    best_tour = tuple(reversed(best_tour))
    
    # use the best_tour tuple to get necessary information in appropriate format
    # stores a list of place indexes in the best_tour order: Used to calculate total distance/duration
    best_combo = []
    # stores a list of place names in the best_tour order: Used to calculate total distance/duration
    best_route = []
    # store the waypoints in best_tour order
    waypoints = []


    best_route.append(place_names[0])
    best_combo.append(0)

    for i in range(len(best_tour)):
            waypoints.append(place_names[best_tour[i]])
            best_route.append(place_names[best_tour[i]])
            best_combo.append(best_tour[i])
        
    best_route.append(place_names[end])
    best_combo.append(end)

    # calculate total distance/duration for the best tour
    total_distance = 0

    for i in range (1,len(best_combo)):
        total_distance += d[best_combo[i-1]][best_combo[i]]

    # convert total diatance/duration to appropriate string format and store in total
    if optimizeBy == "distance":
        total = format(total_distance* 0.000621371, '.2f') + "miles"
    else:
        hours = total_distance // 3600
        if hours == 0:
            no_hours = ""
        elif hours == 1:
            no_hours = "1 hour"
        else:
            no_hours = str(hours) + " hours"

        mins = int(round((total_distance - hours * 3600)/60,0))
        if mins == 0:
            no_mins = " 0 min"
        elif mins== 1:
            no_mins = " 1 min"
        else:
            no_mins = " " + str(mins) + " mins"

        total = no_hours  + no_mins

    return best_route, waypoints, total

# renders computed.html with parameters
# c_value -s 0 when c not precent- Start and end places are the same. 1 otherwise
def render_computed(c_value):

    # url for distance matrix API call (Incomplete)
    places = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial"

    key = os.environ.get("MAPS_API_KEY")

    # number of waypoints
    waypoints = request.form.get("waypoints")

    # value to optimze by - distance or duration
    optimizeBy= request.form.get("optimizeBy")

    # intialize place id holder array
    place_ids = [None for x in range(int(waypoints) + 1 + c_value)]

    # insert the place ids
    place_ids[0] = "place_id:" + request.form.get("0")

    if c_value == 1:
        place_ids[1] = "place_id:" + request.form.get("c")

    for i in range(1, int(waypoints)+1):
        place_ids[i + c_value ] = "place_id:" + request.form.get(str(i))

    # join place ids with | and attach them to the API request url
    place_param = "|".join(place_ids)
    places = places + "&key=" + key + "&origins=" + place_param + "&destinations=" + place_param

    # obtain adjacency matrix and list of place names
    distance_matrix, place_names = get_info(places,int(waypoints) + 1 + c_value, optimizeBy)
    
    # render apology page for incorrect request
    if distance_matrix == None:
        message = '<div class="alert alert-danger"><div class="container-fluid"><div class="alert-icon"><i class="material-icons">warning</i></div><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="material-icons">clear</i></span></button>Your process could not processed at the moment. Please try again after some time.</div></div>'
        flash(message)
        return redirect(url_for("compute"))

    if distance_matrix == "No Connection":
        message = '<div class="alert alert-warning"><div class="container-fluid"><div class="alert-icon"><i class="material-icons">warning</i></div><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="material-icons">clear</i></span></button>Please only enter places that can be visited by driving from one another.</div></div>'
        flash(message)
        return redirect(url_for("compute"))

    # obtain best tour, waypoints and total distance/duration to pass while rendering page
    best_tour, waypoints, total_distance = tsp_rec_solve(distance_matrix, place_names,0 + c_value, optimizeBy)

    # True if optimized by duration, else False
    if optimizeBy == "distance":
        duration = False
    else:
        duration = True
    
    # render page
    return render_template("computed.html", tour = best_tour,distance = total_distance , start = place_names[0], end = place_names[c_value], waypoints = waypoints,duration = duration) 


