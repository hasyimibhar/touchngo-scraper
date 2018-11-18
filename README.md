# touchngo-scraper

touchngo-scraper is basically a headless browser which scrapes Touch n Go data from https://tngportal.touchngo.com.my/tngPortal. The headless browser sits behind a HTTP server, which transforms the scraped data into JSON.

## Usage

### Docker

Start the server:

```sh
$ docker run -it -d --rm \
    -p 3000:3000 \
    hasyimibhar/touchngo-scraper
```

Query transactions:

```sh
$ export TOUCHNGO_AUTH=$(echo "username:password" | tr -d '\n' | base64)
$ curl -X GET \
  'http://localhost:3000/transactions?card_serial_number=XXXXXXX&from=2018-09-01&to=2018-09-30' \
  -H 'Authorization: Basic $TOUCHNGO_AUTH'
```
