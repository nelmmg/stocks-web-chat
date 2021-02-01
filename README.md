# Stock chat with React JS, FireBase and Google Authentication

Live demo:
https://web-chat-a4d83.web.app/

WebApp to chat with your InvestmentGroup about the stocks you hold.
Realtime chat (based in WhatsApp) with added stock information as current market position and latest news.

FireBase used to store stock chat and authentication manager.

Finnhub has a free plan limitation of 60request per minute, you might find some HTTP 429 being returned.

WebApp built for non commercial purposes.

TODO list, by order:

- Add shorters position;
- Create API Service Layer (Angular style);
- Create Db Service Layer (Angular style);
- Apply a cache first option for finnhub requests - due to excessive requests for free plan;
- Add RealTime Graphs;
- Add responsiveness;

To setup the app in your local machine, set the .env file with the following:

REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_DATABASE_URL=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
REACT_APP_FIREBASE_MEASUREMENT_ID= ""
REACT_APP_FINNHUB_KEY=""

Finnhub used for market data:
https://finnhub.io/docs/api/introduction

Base layout from WebDeveloperGuide & CleverProgrammers:
https://github.com/WebDeveloperGuide/whatsapp-clone-react
https://github.com/CleverProgrammers

CleverProgrammers WhatsAppClone video:
https://youtu.be/pUxrDcITyjg
