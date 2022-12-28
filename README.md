# hel_citybike_backend

Backend for importing data from hsl city bike trips into local MongoDB database and getting them for backend.

## Deployment

Clone the project using

```bash
  cd /path/to/working/directory
  git clone https://github.com/tiitustelke/hel_citybike_backend.git
```

Create a .env file with following lines:

```text
  #csv data to be imported
  DATA_URLS=["https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv","https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv","https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"]
  #optional, default port is 3000:
  PORT=3001
```

Build Docker containers using

```bash
  docker build --tag bike-backend .
```

## API Reference

#### Import all data from API urls to DB

```http
  GET /import/all
```

#### Get n items

```http
  GET /data/trips?item_count=${item_count}&start_id={start_id}
```

| Parameter | Description                                 |
| :-------- | :--------------------------------------------|
| `item_count` |  **Required**. How many trips are fetch |
| `start_id` | Last _id of previous request for pagination |