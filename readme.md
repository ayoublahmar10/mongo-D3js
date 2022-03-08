# Data visualization framework with Docker

Our application presents GAMES data provided by the site: https://data.world/sumitrock/video-games-sales?fbclid=IwAR1cRZfkIzdW3L48FVYhmZPK_ s0Y-pxGqKPwvN6Y4b9aa8o0U9uUBF_k64c
We were able to recover this data in json form (/data/games.json), and import it into our mongo database
using the command:
docker exec -i docker-mongomongo1sh − c′mongoimport − ddbgames − cgames
− −authenticationDatabaseadmin −uroot −pexample′ < games.json

## Setup

- build the `graphql` container:

        $ cd graphql
        $ rm -fr node_modules/
        $ docker build -t graphql .

- start the graphql/mongo container stack

        $cd..
        $ docker-compose -f stack.yml up -d

- access the application: Open the `ui/index.html` page with the browser

## Axes of development

### A first axis concerns the development of `graphQL` queries.

- disable the `graphQL` container from the Docker stack
- determine the IP address of the `Mongo` container

        $ docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' docker-framework_mongo_1
        172.18.0.3

- write this address hard in the resolver `graphql/resolvers.js`

        const url = 'mongodb://root:example@172.18.0.3:27017';

- perform query development by modifying schema, resolvers and using *playground*

- when the development of the `graphQL` connector is stable, modify the IP address of the `Mongo` container in the resolver:

        const url = 'mongodb://root:example@mongodb:27017';

- then build the container:

        $ docker build -t graphql .

- you can now embed it in the stack

### The second axis concerns the development of .HTML pages

We use `D3.js` to visualize the data obtained by `graphQL`:

        d3.json("http://localhost:4000/?query={artists(mini:50){artist artistname count}}").then(drawArtists)

## Resources

- a good course on D3.js: <http://using-d3js.com/index.html>

## Data structure

- we start from an extraction of games from <https://musicbrainz.org/doc/MusicBrainz_Database> 
- we transform the data to obtain the following elements:
```
    {
      "artist": 879067,
      "artistname": "sergei prokofiev",
      "track": 12239831,
      "title": "piano concerto",
      "instrument": "piano",
      "number": 3,
      "tone": "c",
      "mode": "major",
      "opus": 26,
      "share": 3,
      "indication": "allegro ma non troppo"
    },
```

- we insert this data in the `Mongo` container:

        jq -c .titles[] titlesWithInstrument.json | grep tone | docker exec -i docker-framework_mongo_1 sh -c 'mongoimport -d clasik -c titles --authenticationDatabase admin -u root -p example'

- create the artists' collection
```
db.titles.aggregate([
    {
        $group:{
            _id:{
                artist:"$artist",
                artistname:"$artistname"
            },
            count:{
                $sum: 1
            }
        }
    },
    {
        $project:{
            artist:"$_id.artist",
            artistname:"$_id.artistname",
            count:1,
            _id:0
        }
    },
    {
        $out:"artists"
    }
])
```
- create the collection of tones:
```
db.titles.aggregate([
    {
        $group:{
            _id:{
                tonality:"$tonality",
                mode:"$mode"
            },
            count:{
                $sum: 1
            }
        }
    },
    {
        $project:{
            tonality:"$_id.tonality",
            mode:"$_id.mode",
            count:1,
            _id:0
        }
    },
    {
        $out:"tones"
    }
])
```
- create the collection of instruments:
```
db.titles.aggregate([
    {
        $group:{
            _id:{
                instrument:"$instrument"
            },
            count:{
                $sum: 1
            }
        }
    },
    {
        $project:{
            instrument:"$_id.instrument",
            count:1,
            _id:0
        }
    },
    {
        $out:"instruments"
    }
])
```