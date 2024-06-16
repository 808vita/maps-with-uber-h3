# Leaflet Maps - Leaflet Routing Machine - UberH3 - Service Area Mode :

### Deployed link : [`Live Site`](https://phenomenal-haupia-559541.netlify.app/)

### Deployed docs path: [`Deployed Docs`](https://phenomenal-haupia-559541.netlify.app/docs/index.html)

You can also access docs on local server by navigating to "/docs/index.html"

[Service Area mode (rectangle).webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/b97bc117-7309-4541-9f6f-06107cfa68ec)


## Getting Started
Please run `npm install` to install all project required dependencies.

This project uses Leaflet for maps , Leaflet Routing Machine for routing , H3-js for Uber H3 cells and Geoman for drawing tools.
Additionally Typedoc is used for generating docs.

After installation - run the development server:

```bash

npm run dev
npm run build
npm run start
npm run docs

```

- use `npm run dev` to start the local server.
- use `npm run build` to start the production build files.
- use `npm run start` to start the local server using production build files (run yarn build first!).
- use `npm run docs` to reupdate the typedoc generated docs.

## Modes

# Normal Mode - normal routing with no restrictions

[double click to place markers - use buttons.webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/ba260843-6128-4943-945d-07958cfa1f90)

- Place Markers by double clicking on map 

- On placing marker uber h3 cell data is fetched along with street adress and shown on map - h3 cell polygon gets drawn

- Can place multiple markers - displays tooltip and all marker popups contain marker relevant data
  
- Relevant data includes : Marker address, marker latlng , uber h3 cell index which contains marker along with h3cell center latlng

- After placing at least two markers on map Routing button gets displayed

- Leaflet Routing Machine uses marker latlngs as waypoints and makes network calls to OSRM server

- On sucessfull network request routing plan gets displayed.

- More markers can be added to and rerouted - waypoints and marker data will adjusted automatically

- Clear button - can clear markers , route line and routing plan window


# Service Area Mode (by drawing a rectangle / polygon) - Markers can only placed inside service area

[Service Area mode (rectangle).webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/b97bc117-7309-4541-9f6f-06107cfa68ec)

[service area mode (polygon).webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/30892ec3-52d6-4f42-9f90-9a8c87fdb6cb)


- Define service area bounds by drawing a rectangle or polygon on to the map

[Place , drag ,edit and delete - rectange and polygon .webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/0f5d4dec-9168-451a-aac7-8a3e32c2ed71)


- On placing a rect/polygon ; the boundary data is used for fetch uberh3 cells data

- Uber h3 indices which fit within the polygon boundary is calculated

- Uber h3 indices are then used to generate uber h3 ploygon and gets drawn on the polygon

- NOTE: only user drawn rectange / polygon boundaries are used for enforcing restriction on placing markers

- Uber h3 polygon gets updated everytime service is edited or moved (that is when drawn rect/polygon is edited or moved)

- When service area is active - markers only can be placed within service area boundaries

- Route button gets displayed when at least two markers are placed

- Same as before - routing data is fetched using markers as waypoints

- Same as before - more markers can placed and rerouted

- Clear button - can only clear markers , route line and routing plan

- You can remove service area by using eraser button on bottom left

- Eraser button becomes visible when a service area is drawn but no markers are placed





## Specifics
- Project setup using create-next-app - typescript
- Used Leaflet , Leaflet Routing Machine ,h3-js and Geoman
- Users can place markers by double clicking
- Markers display path information and clicking it displays information such address, latlng , h3 data.
- Users can draw rectangle or polygon on the map
- Rectangle / ploygon can be resized , moved and deleted
- Uber h3 cell data are fetched when markers placed and h3 cell gets drawn
- Uber h3 cell data are also fetched when rect/polygon are placed and h3 polygon gets drawn
- Multiple markers can placed on to the map and routing also works
- Only one rectangle or polygon can be placed on map - one service area 
- When a service area is drawn - mutliple markes can only be placed within service area
- Service area enforces marker placing restrictions
- Routing can be triggered by clicking on Route button (requires at least 2 markers)
- Clear button can be used to remove markers , route line and routing plan
- Eraser button (on bottomleft) should be used to remove a service area.
  # Others
- Nextjs based - generated as a static site
- Typescript codebase
- Codebase documented - makes use of typedoc to generate docs
- Readme & dedicated docs
- File versioning - using git/ github
- Google Cloud Platform (GCP) deployment: Storage Bucket with Load balancer
  
[dedicated docs.webm](https://github.com/808vita/maps-with-uber-h3/assets/97225946/c7f4c0c3-7643-40e4-860c-a76afbc4064a)

