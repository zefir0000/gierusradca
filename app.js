const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
const errorsHandler = require('./middlewares/errors');
const routes = require('./routes/index');
const admin = require('./routes/admin');
const helper = require('./services/helper');
const app = express();
const redirect = require('./middlewares/redirect')
const cron = require('node-cron');
const sendMail = require('./services/SendMail');

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(redirect)
app.use('/',  routes);
app.use('/admin', admin);
// cron.schedule('30 12 * * *', async () => {
cron.schedule('* 12 * * *', async () => {
  const blogListFILE = 'common/blogList.txt';
  const today = new Date().toISOString().split('T')[0];
  console.log('🕒 CRON uruchomiony:', new Date().toISOString());
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());
  for (const blog of blogList) {
      if(blog.publishDate == today) {
        const subscribers = await helper.loadSubscribers();

        for (const user of subscribers) {
          try {
            if(user.confirmed) {
              await sendMail.sendNewsMail(user.email,
                {
                  title: 'Zapoznaj się z najnowszym wpisem na Kancelaria Radcy Prawnego Kamila Gierus-Lenczner',
                  blog,
                }
              );
              console.log(`✔️ Wysłano do: ${user.email}`);
            }
          } catch (err) {
            console.error(`❌ Błąd przy ${user.email}:`, err.message);
          }
        }
      }
  }

});
app.use(errorsHandler.notFound);
app.use(errorsHandler.catchErrors);

module.exports = app;
