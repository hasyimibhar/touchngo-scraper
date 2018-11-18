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

Sample response:

```json
[
    {
        "number": "62572",
        "timestamp": "17/11/2018 12:38:52",
        "posted_date": "17/11/2018",
        "type": "Usage",
        "entry_location": "KAJANG",
        "entry_sp": "04_PLUS",
        "exit_location": "PERSIMPANGAN PUTRA MAHKOTA",
        "exit_sp": "04_PLUS",
        "reload_location": null,
        "amount": "2.10",
        "balance": "45.34",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62573",
        "timestamp": "11/11/2018 14:42:40",
        "posted_date": "12/11/2018",
        "type": "Usage",
        "entry_location": "SUNWAY",
        "entry_sp": "12_LITRAK",
        "exit_location": "SUNWAY",
        "exit_sp": "12_LITRAK",
        "reload_location": null,
        "amount": "2.10",
        "balance": "47.44",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62574",
        "timestamp": "11/11/2018 12:31:29",
        "posted_date": "11/11/2018",
        "type": "Usage",
        "entry_location": "DAMANSARA",
        "entry_sp": "08_SPRINT",
        "exit_location": "DAMANSARA",
        "exit_sp": "08_SPRINT",
        "reload_location": null,
        "amount": "2.00",
        "balance": "49.54",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62576",
        "timestamp": "10/11/2018 14:47:31",
        "posted_date": "11/11/2018",
        "type": "Usage",
        "entry_location": "SERI KEMBANGAN INTERCHANGE",
        "entry_sp": "84_MAJU EXPRESSWAY SDN BHD",
        "exit_location": "SERI KEMBANGAN INTERCHANGE",
        "exit_sp": "84_MAJU EXPRESSWAY SDN BHD",
        "reload_location": null,
        "amount": "2.20",
        "balance": "53.54",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62575",
        "timestamp": "10/11/2018 14:47:27",
        "posted_date": "11/11/2018",
        "type": "Usage",
        "entry_location": "MEX SALAK SOUTH",
        "entry_sp": "84_MAJU EXPRESSWAY SDN BHD",
        "exit_location": "MEX SALAK SOUTH",
        "exit_sp": "84_MAJU EXPRESSWAY SDN BHD",
        "reload_location": null,
        "amount": "2.00",
        "balance": "51.54",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62577",
        "timestamp": "10/11/2018 14:33:48",
        "posted_date": "11/11/2018",
        "type": "Reload",
        "entry_location": "PLAZA SERI KEMBANGAN 02",
        "entry_sp": "203509_A06",
        "exit_location": "PLAZA SERI KEMBANGAN 02",
        "exit_sp": "203509_A06",
        "reload_location": "PLAZA SERI KEMBANGAN 02",
        "amount": "50.00",
        "balance": "55.74",
        "class": "0",
        "tag_number": "00000000"
    },
    {
        "number": "62578",
        "timestamp": "06/11/2018 22:33:46",
        "posted_date": "07/11/2018",
        "type": "Usage",
        "entry_location": "PERSIMPANGAN PUTRA MAHKOTA",
        "entry_sp": "04_PLUS",
        "exit_location": "KAJANG",
        "exit_sp": "04_PLUS",
        "reload_location": null,
        "amount": "2.10",
        "balance": "5.74",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62579",
        "timestamp": "06/11/2018 19:48:43",
        "posted_date": "07/11/2018",
        "type": "Usage",
        "entry_location": "SERDANG",
        "entry_sp": "04_PLUS",
        "exit_location": "PERSIMPANGAN PUTRA MAHKOTA",
        "exit_sp": "04_PLUS",
        "reload_location": null,
        "amount": "2.40",
        "balance": "7.84",
        "class": "1",
        "tag_number": "00000000"
    },
    {
        "number": "62580",
        "timestamp": "05/11/2018 20:21:38",
        "posted_date": "06/11/2018",
        "type": "Usage",
        "entry_location": "KAJANG",
        "entry_sp": "04_PLUS",
        "exit_location": "PERSIMPANGAN PUTRA MAHKOTA",
        "exit_sp": "04_PLUS",
        "reload_location": null,
        "amount": "2.10",
        "balance": "10.24",
        "class": "1",
        "tag_number": "00000000"
    }
]
```
