const fs = require("fs");
const mail = require('../services/SendMail')
const helper = require('../services/helper')
const newslatterFILE = 'common/newslatterList.txt';
const blogListFILE = 'common/blogList.txt';

exports.home = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());

  res.render('index', { blogList});
};
exports.policy = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());
  res.render('policy', { blogList});
};
exports.blog = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());
  console.log(req.params)
  const post = blogList.find(post => post.slug === req.params.slug);
  console.log(post)
  if (post) {
    post.publishDate = helper.formatDate(post.publishDate);
  } else {
    post.publishDate = ''
  }
  res.render('blog/'+req.params.slug.replace('.html', ''), { blogList, post });
};

exports.confirmMail = async (req, res) => {
  const confirm = await helper.verifyConfirmationToken(req.query.tid)
  const confirmed = confirm ? await helper.confirmSubscriber(confirm.email) : null

  res.render('confirm-mail');
};

exports.unsubscribe = async (req, res) => {
  const confirm = await helper.verifyConfirmationToken(req.query.tid)
  const unsubscribe = confirm ? await helper.unsubscribe(confirm.email) : null

  res.render('unsubscribe');
};

exports.signNewslater = async (req, res) => {
    const { email, consent } = req.body;
    const emailFormated = email.toLowerCase()
    // Walidacja
    if (!email || !consent) {
      return res.status(400).send('Wszystkie pola są wymagane.');
    }

    const entry = {
      email: emailFormated,
      consent: consent === 'on',
      confirmed: false,
      timestamp: new Date().toISOString()
    };
    const subscribers = helper.loadSubscribers()
    if(subscribers.some((item) => item.email == emailFormated)) {
      mail.sendConfirmMail(emailFormated, {})
      return res.send('Dziękujemy za zapis! Sprawdź swoją skrzynkę, aby potwierdzić subskrypcję.');

    }
    // Zapis do pliku (każdy wpis jako osobna linia JSON)
    fs.appendFile(newslatterFILE, JSON.stringify(entry) + '\n', (err) => {
      if (err) {
        console.error('Błąd zapisu:', err);
        return res.status(500).send('Wystąpił błąd serwera.');
      }
       mail.sendConfirmMail(emailFormated, {})
      // Można tu dodać redirect albo komunikat
      res.send('Dziękujemy za zapis! Sprawdź swoją skrzynkę, aby potwierdzić subskrypcję.');
    });
}