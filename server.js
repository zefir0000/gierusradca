require('dotenv').config();

const app = require('./app');

app.set('port', 8333);

const server = app.listen(app.get('port'), () => {
    console.info(`Listening on ${ server.address().port }`);
});
