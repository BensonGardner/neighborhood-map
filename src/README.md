# Little Tokyo, L.A. is Fun

This app gives you a quick look at some fun places in a vibrant neighborhood in Los Angeles, CA.

It was created as a project in a Udacity nanodegree program.

## APIs

The project accesses Google Maps and Flickr through their public APIs.

### More on those
(https://developers.google.com/maps/documentation/)
(https://www.flickr.com/services/api/)

## Architecture
The app uses Knockout.js to organize elements outside the map.

Following Knockout practices, code is organized into a data model, a view model, and the HTML view itself.

Separately, all map-related code is contained within the map control.

## Features and functions
The input box filters the map markers and their corresponding list entries (in the green section).

Clicking on a marker or list entry will bring up an infowindow with some recent Flickr photos (up to 4, if available).

## Credit where due
Some of the patterns in the Google Maps related code came from the Udacity Frontend Developer Nanodegree coursework.

A small few of the details of configuring the Flickr request are owed to a Stack Overflow post which I consulted along the way.