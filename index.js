var unirest = require('unirest');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/oil', (req2, res2) => {
    unirest('POST', 'https://orapiweb1.pttor.com/api/oilprice/search')
        .headers({
            'Content-Type': 'application/json',
        })

        .send(JSON.stringify({
            "provinceId": Number(req2.body["provinceId"]),
            "districtId": null,
            "year": Number(req2.body["year"]),
            "month": Number(req2.body["month"]),
            "pageSize": 1,
            "pageIndex": 0
        }))

        // customizing response body
        .end(function (res) {
            let result = {};

            if (res.error) throw new Error(res.error);

            raw = JSON.parse(res.raw_body);

            const totalRecords = raw["totalRecords"];
            if(totalRecords > 0) {
                const success = raw["success"];
                const message = raw["message"];
                const data = raw["data"][0];

                let year = data["year"];
                let month = data["month"];
                let day = data["day"];
                let price = data["price"];

                let date = data["priceDate"];

                let province = data["province"];
                let district = data["district"];
                let priceData = data["priceData"];
                
                result = {
                    "success": success,
                    "message": message,
                    "data": {
                        "date": date,
                        "year": year,
                        "month": month,
                        "day": day,
                        "province": province,
                        "district": district,
                        "priceData": JSON.parse(priceData),
                    }
                }
            } else {
                result = {
                    "success": false,
                    "message": "No data found",
                    "data": {}
                }
            }

            res2.send(result);
        });
})

app.listen(1213);