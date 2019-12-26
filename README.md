# Ginkgoch Map Server
This is a map server template that could help you to build robust and customize map service quickly with Ginkgoch map library ([Ginkgoch Map for NodeJS](https://github.com/ginkgoch/node-map/blob/develop/README.md) is a map library written by NodeJS with full functional features on GIS application development).

![Demo Overview](https://github.com/ginkgoch/map-server-ui/blob/develop/docs/images/map-overview.png)

## Features
This is a project template with RESTful APIs as:
* Load a data as a source on a map
* Read all features from a specific GIS data
* Read all features as a table from a specific GIS data
* Spatial query on a data source including intersection, etc.
* Customize the themes of a source
    * Basic for area, line, POI and labels
    * Advanced themes for value based styling
* Map object serialize/de-serialize into a JSON string for storage
* A XYZ server is built-in with your own data source and customized themes.
* More... (a complete API document is WIP)

## Run the server

### Manually build
```
# clone the repo
git clone https://github.com/ginkgoch/node-map-server.git

# install dependencies
yarn

# start server
yarn serve
```

### Run with Docker
We provide the docker images on [docker hub](hub.docker.com) for OPs team. Developers can also use it to quickly run this service quickly.

#### Prerequisite
* Docker
* Docker compose

#### Launch server and ui demo with `docker compose`
Docker compose is the easiest way to launch this server as well as a UI interface.
```bash
curl -o docker-compose.yml https://gist.github.com/ginkgoch/5b3bc8c9e081a9389d78daa2ba4622b0/raw/fc6a5985ea83b127f093d91b8ab4df8cebc14ebf/map-server-docker-compose.yml && docker-compose up
```

Once it launches, type `http://localhost:8080` in browser to try this demo.

#### Launch server with `docker` only
```bash
docker run --name map-server -p 3000:3000 -d ginkgoch/map-server
```

#### Launch server with `docker` and mounte a physical data path
```bash
docker run --name map-server -p 3000:3000 -v "/Users/ginkgoch/Downloads/Africa_SHP/:/root/map-server/data/" -d ginkgoch/map-server
```

## FAQ

### What is the difference to the other GIS components?
The entire project including UI, server and its dependencies libraries are all written by NodeJS. If you already knew JavaScript, I hope you this could bring you a brand new experience to build a full functional GIS application with one programming language. 

### Why do I need a customized thematic map?
When you ask this question, I assume that you already have the experience to build map apps on browser with `OpenLayers`, `Google Map` or `Leaflet` etc. This might satisfy your requirement already. But when you have a GIS data (e.g. SHP file, Postgre or even CSV) that contains more precise vectors, or more properties on the records, or analyze on a region (e.g. find some records with some special condition in a random drawn area), it might be a headache to implement with the existing client based libraries. Because the 3rd party client libraries only provides restricted predefined query functions, styles etc. functions. In this case, setup a custom map server is a good choice and become a solution to extend your map application more. With your own server, you can also interact with the 3rd party client map libraries to provide better UX for applications.

### Why NodeJS?
#### One programming langue for frontend and backend
JavaScript is one of the most popular programming language in the world currently. It is also the required skills for UI developers. On the other hand, many small teams, groups, organizations or kickstart companies requires full stack developers, so JavaScript will be the most important skill in this part.

In the GIS region, we know there are many famous client MAP libraries like `OpenLayers`, `Leaflet` or `Google` etc. It is pretty easy to build a browser based map view for your websites or web-apps. But if you want to setup your own map server cluster, you might need to learn to use `C#`, `JAVA`, cloud etc. This is not too many complete GIS solution with JavaScript.

When I play around with NodeJS which allows me to build more interesting application on server side with JavaScript, so this project launches.

#### Thread safe
It is well-known that NodeJS runs in `single thread` and `event-loop`. I used to use many other GIS component with `C#` and `JAVA`, it has a bad experience to build high performance service. We need to consider the mutex lock on resource reading/appending in multi-thread.

With NodeJS' single thread mode, you don't need to consider the thread safe issue; instead, we can focus more on the concrete business of your application.

#### I'm worry about the performance building in NodeJS
Technically, NodeJS runs with V8 engine with single thread and I/O non-blocking mode, it seems has worse performance than the other techs, such as JAVA. But in the real world with high CPU performance, the gap becomes less and less. 

It really depends on the scenario of your application. For example:
1. For CPU-intensive calculating, like huge amount number calculation, zero I/O processing, definitely, `JAVA` or `C#` will be a best choice.
2. For IO-intensive process, like reading/writing files, NodeJS will be 3.4X better performance. (https://github.com/johnrjenson/JavaVsNode)

I don't think the application is a pure I/O or CPU intensive application, but for the balanced workload application, I would say the performance will be about the same. 

One more thing I think the worsest thing for node is the memory restriction (e.g. 1G in 64-bit system). We need to either reduce the memory usage or manually expand the memory.

#### Mature JavaScript Echo-System
JavaScript has a great echo-system for full-stack technology. It is allow to build cross-platform website, service, desktop or even mobile applications. `Ginkgoch` will also provide those solutions on this cross-platform, various categories of GIS applications. (PS. it is now supported website, webserivce, desktop; and mobile is in my backlog).