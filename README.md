# hel_citybike_backend

Backend for importing data from hsl city bike trips into local MongoDB database and getting them for frontend.

## Frontend
Under development
https://github.com/tiitustelke/hel_citybike_app

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Deployment

Make sure you have installed latest versions of [Node](https://nodejs.org/en/download/), [Docker](https://docs.docker.com/get-docker/) and [Git](https://git-scm.com/downloads)

Clone the project using

```bash
  cd /path/to/working/directory
  git clone https://github.com/tiitustelke/hel_citybike_backend.git
```

Create a .env file to root of project with following lines:

```text
  NODE_ENV=production
  #csv data to be imported
  DATA_URLS=["https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv","https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv","https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"]
  NODE_LOCAL_PORT=3000
  NODE_DOCKER_PORT=3001
  MONGO_LOCAL_PORT=27017
  MONGO_DOCKER_PORT=27018
  TEST=0
```

Build and run Docker containers using

```bash
  npm run start:production
```

## API Reference

#### Import all data from API urls to DB

```http
  POST import/all
```

#### Get n items

```http
  GET /trip/trips?item_count=${item_count}&start_id={start_id}
```

| Parameter | Description                                 |
| :-------- | :--------------------------------------------|
| `item_count` |  **Required**. How many trips are fetch |
| `start_id` | Last _id of previous request for pagination |

#### Add trip

```http
  POST /trip/add
```
| Parameter | Type   | Description                              |
|:----------|:-------|:-----------------------------------------|
| `body`    | `json` | **Required**. The item to be add as JSON |

