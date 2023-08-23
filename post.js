const fs   = require('fs');
const https = require('https');
const jwt  = require('jsonwebtoken'); // npm i jsonwebtoken
// You get privateKey, apiKeyId and issuerId from your Apple App Store Connect account
const privateKey = fs.readFileSync("") // this is the file you can only download once and should treat like a real, very precious key.
const apiKeyId = "";
const issuerId = "";

let now = Math.round((new Date()).getTime() / 1000); // Notice the /1000
let nowPlus20 = now + 1199 // 1200 === 20 minutes

let payload = {
    "iss": issuerId,
    "exp": nowPlus20,
    "aud": "appstoreconnect-v1"
}

let signOptions = {
    "algorithm": "ES256",
    header : {
        "alg": "ES256",
        "kid": apiKeyId,
        "typ": "JWT"
    }
};

let token = jwt.sign(payload, privateKey, signOptions);
var postData = JSON.stringify({
    "data": {
        "type": "appStoreVersionLocalizations",
        "id": 'daac39dd-8ab1-4a6f-bbb9-b079c42e9c12',
        "attributes": {
        //   "locale": "de-DE",
        //   "description": "Go wild and discover trails, parks and off-the-beaten-track terrain with Forest Explorer. Whether you’re bushwalking in the outback or looking for a quick local hike, Forest Explorer has thousands of trails and destinations from around the globe to explore.",
        //   "keywords": "hiking, trails, backcountry, parks, path, terrain, forest",
        //   "marketingUrl": "http://www.apple.com/forestexplorer",
        //   "promotionalText": "Get Forest Explorer free for a limited time.",
        //   "supportUrl": "https://support.apple.com",
          "whatsNew": "This is a test whatsNew message"
        },

        // "relationships": {
        //   "appStoreVersion": {
        //     "data": {
        //       "type": "appStoreVersionLocalizations",
        //       "id": 'daac39dd-8ab1-4a6f-bbb9-b079c42e9c12'
        //     }
        //   }
        // }
      }

    });

let postOptions = {
    host: 'api.appstoreconnect.apple.com',
    path: 'https://api.appstoreconnect.apple.com/v1/appStoreVersionLocalizations/daac39dd-8ab1-4a6f-bbb9-b079c42e9c12',
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
};

let req = https.request(postOptions, function(res) {
    console.log('status: ' + res.statusCode);
    console.log('headers: '  + JSON.stringify(res.headers));

    res.setEncoding('UTF8');
    res.on('data', function(chunk) {
        console.log('BODY: ' + chunk);
    })
})

req.on('error', function(e) {
    console.log('Error: ' + e.message);
})
req.write(postData);
req.end();

