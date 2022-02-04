const http = require("http");
const https = require('https');
const PORT = process.env.PORT || 8080;

/*
  Remove all spaces from the title and make the first word lowercase
  Replace spaces in main with underscores
  Replace keys in dataObj with the values in dataArray
  Decode urlEncoded
  Return the number of words in wordCount
  Return a status of 200 on success
  Perform a GET request to https://cerberus-backend.dev.gigabit.io/gigabit/test and return it
 */



function randomNum() {
    return new Promise((resolve, reject) => {
        try {
            https.get('https://cerberus-backend.dev.gigabit.io/gigabit/test', (resp) => {
                let data = "";
                resp.on("data", (chunk) => {
                    data += chunk.toString();
                });
                resp.on("end", () => {
                    resolve(data);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function setNewArray(dataObj, arrayVals) {

    let newObj = {};

    for (i = 0; i < arrayVals.length; i++) {
        newObj[arrayVals[i]] = dataObj[i];
    }
    return (newObj);
}

const server = http.createServer(async (req, res) => {
    if (req.url === "/test" && req.method === "POST") {

        let testData = await getReqData(req);
        let clientData = JSON.parse(testData);
        let dataObjVals = (Object.values(clientData.dataObj));
        let dataArray = clientData.dataArray;

        // create a new object to return
        let apiData = {};

        apiData = {
            // Remove all spaces from the title and make the first word lowercase
            "title" : capitalizeFirstLetter(clientData.title),

            // Replace spaces in main with underscores
            "main" : underscoreSpace(clientData.main),

            // Replace keys in dataObj with the values in dataArray
            "arrayObj" : setNewArray(dataObjVals, dataArray),

            // Decode urlEncoded
            "urlDecode" : decodeURI(clientData.urlEncoded),

            // Return the number of words in wordCount
            "wordCount" : clientData.wordCount.split(' ').length,

            // Perform a GET request to https://cerberus-backend.dev.gigabit.io/gigabit/test and return it
            "randomNumber" : await randomNum(),
        };

        function capitalizeFirstLetter(string) {
            let newTitle = string.charAt(0).toLowerCase()+ string.slice(1);
            let noSpace = newTitle.replace(/\s+/g, '');
            return noSpace;
        }

        function underscoreSpace(string) {
            return string.replace(/\s+/g, '_');
        }

        //   Return a status of 200 on success
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(apiData));
    }

    // Route error handling
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

