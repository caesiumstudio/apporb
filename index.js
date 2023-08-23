const fs = require('fs');
const https = require('https');
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
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
    "algorithm": "ES256", // you must use this algorythm, not jsonwebtoken's default
    header: {
        "alg": "ES256",
        "kid": apiKeyId,
        "typ": "JWT"
    }
};

let token = jwt.sign(payload, privateKey, signOptions);
// console.log('@token: ', token);


let getOptions = {
    host: 'api.appstoreconnect.apple.com',
    // path: '/v1/apps',
    // path: '/v1/apps/6452400407',
    // path: '/v1/apps/6452400407/relationships/appStoreVersions',

    // path: '/v1/apps/6452400407/appStoreVersions',
    // path: '/v1/apps/6452400407/appInfos',
    // path: '/v1/apps/6451088024/customerReviews',
    path: '/v1/appStoreVersions/02e7a41a-427a-4f5d-a3c7-a230d75acffc/appStoreVersionLocalizations',
    // path: '/v1/appInfos/89573e9d-0ea7-4c56-b472-3b654622d9fd/relationships/appInfoLocalizations',
    // path: '/v1/appStoreVersionLocalizations/89573e9d-0ea7-4c56-b472-3b654622d9fd',
    // path: '/v1/appInfos/bcc4a360-0ce3-485f-9de9-eb8095503a90/relationships/appInfoLocalizations',
    // path: '/v1/apps/6451088024/relationships/appInfos',
    method: 'GET',
    headers: {
        'Accept': 'application/a-gzip, application/json',
        'Authorization': 'Bearer ' + token
    }
};

function makeReq(_fun) {
    let req = https.request(getOptions, function (res) {
        res.setEncoding('UTF8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            // _fun(chunk);
        })
    })

    req.on('error', function (e) {
        console.log('Error: ' + e.message);
    })
    req.end();
}

makeReq(_filterData);
function _filterData(chunk) {
    // console.log(JSON.parse(chunk).data);
        console.log(JSON.parse(chunk).data[1]);
    // return;
    const url = JSON.parse(chunk).data[1].relationships.appInfoLocalizations.links.self;
    getOptions.path = getPath(url);
    console.log('New path: ' + getOptions.path);

    makeReq(_appInfoLocalizations)
}

function _appInfoLocalizations(data) {
    data = JSON.parse(data);
    const url = data.links.self;
    getOptions.path = getPath(url);
    console.log('New path: ' + getOptions.path);

    makeReq((d) => {
        console.log(d);
    })
}


function getPath(url) {
    return url.replace('https://api.appstoreconnect.apple.com', '');
}