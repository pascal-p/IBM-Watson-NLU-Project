const express = require('express');
const app = new express();
const dotenv = require('dotenv');

dotenv.config();

const getNLUInstance = () => {
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  console.log(`api_url ${api_url}`);

  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });

  console.log(`naturalLanguageUnderstanding obj: ${naturalLanguageUnderstanding}`);

  return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());


const nLUIns = getNLUInstance();


// Endpoints
app.get("/", (req, res) => {
  res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
  const analyzeParams = {
    url: req.query.url,
    features: {
      emotion: {document: true}
    }
  };

  nLUIns.analyze(analyzeParams)
    .then(resp => {
      return res.send(JSON.stringify(resp.result.emotion.document.emotion, null, 2));
    })
    .catch(error => {
      console.log("error in resp: ", error);
      return res.status(500).send({ success: false, message: "There was an error" });
    });
});

app.get("/url/sentiment", (req, res) => {
  const analyzeParams = {
    url: req.query.url,
    features: {
      sentiment: {document: true}
    }
  };

  nLUIns.analyze(analyzeParams)
    .then(resp => {
      /*
        result: {
          usage: { text_units: 1, text_characters: 329, features: 1 },
          sentiment: { document: [Object] },
          retrieved_url: 'https://www.reactenlightenment.com/react-jsx/5.6.html',
          language: 'en'
        }
      */
      return res.send(JSON.stringify(resp.result.sentiment.document.label, null, 2));
    })
    .catch(error => {
      console.log("error in resp: ", error);
      return res.status(500).send({ success: false, message: "There was an error" });
    });
});

app.get("/text/emotion", (req, res) => {
  const analyzeParams = {
    text: req.query.text,
    features: {
      emotion: {document: true}
    }
  };

  nLUIns.analyze(analyzeParams)
    .then(resp => {
      /*
        emotion1 received: TO be or not to be // analyzeParams: [object Object]
        resp:  {
          usage: { text_units: 1, text_characters: 18, features: 1 },
          language: 'en',
          emotion: { document: { emotion: [Object] } }
        }
      */
      return res.send(JSON.stringify(resp.result.emotion.document.emotion, null, 2));
    })
    .catch(error => {
      console.log("error in resp: ", error)
      return res.status(500).send({ success: false, message: "There was an error" })
    });
});

app.get("/text/sentiment", (req, res) => {
  const analyzeParams = {
    text: req.query.text,
    features: {
      sentiment:{document: true}
    }
  };

  nLUIns.analyze(analyzeParams)
    .then(resp => {
      /*
        {
          status: 200,
          statusText: 'OK',
          headers: {
            server: 'watson-gateway',
            'content-length': '203',
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-cache, no-store',
            'x-dp-watson-tran-id': '0c86d0a0-f4bc-43c5-b8ae-7cc0cbb4e2d0, 0c86d0a0-f4bc-43c5-b8ae-7cc0cbb4e2d0',
            'content-security-policy': "default-src 'none'",
            pragma: 'no-cache',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'x-xss-protection': '1; mode=block',
            'strict-transport-security': 'max-age=31536000; includeSubDomains;',
            'x-request-id': '0c86d0a0-f4bc-43c5-b8ae-7cc0cbb4e2d0',
            'x-global-transaction-id': '0c86d0a0-f4bc-43c5-b8ae-7cc0cbb4e2d0',
            'x-edgeconnect-midmile-rtt': '179',
            'x-edgeconnect-origin-mex-latency': '506',
            date: 'Mon, 31 May 2021 00:53:13 GMT',
            connection: 'close'
          },
          result: {
            usage: { text_units: 1, text_characters: 43, features: 1 },
            sentiment: { document: [Object] },
            language: 'en'
          }
        }

        resp.result.sentiment.document == { score: 0.986083, label: 'positive' }
      */
      return res.send(JSON.stringify(resp.result.sentiment.document.label, null, 2));
    })
    .catch(err => {
      console.log("error in resp: ", error)
      return res.status(500).send({ success: false, message: "There was an error" })
    });
});


// Launch
let server = app.listen(8080, () => {
  console.log('Listening', server.address().port)
})
