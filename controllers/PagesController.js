const fs = require("fs");
const Fuse = require('fuse.js');
const mail = require('../services/SendMail')
const helper = require('../services/helper')
const newslatterFILE = 'common/newslatterList.txt';
const blogListFILE = 'common/blogList.txt';

exports.home = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date()).slice(0, 6);

  res.render('index', { blogList});
};

exports.blogList = async (req, res) => {
  const options = {
    keys: [
      { name: "title", weight: 0.8 },
      { name: "section", weight: 0.4 },
    ],
    includeScore: true,
    threshold: 0.4, // (0 = dokładne, 1 = bardzo luźne)
    findAllMatches: true,
    useExtendedSearch: true,
  };

  const q = req.query.q || '';
  const category = req.query.category || '';
  const sort = req.query.sort || req.query.q ? 'best' : 'newest';

  const data = fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogListAll = JSON.parse(data).filter(x => x.active && new Date(x.publishDate) < new Date());

  const fuse = new Fuse(blogListAll, options);
  let blogList = blogListAll
  // Szukanie po tytule (lub możesz dodać też opis / content)
  if (q) {
   blogList = fuse.search(q).map(({ item }) => item);
  }
  // Filtrowanie po kategorii
  if (category) {
    blogList = blogList.filter(post => post.section === category);
  }

  // Sortowanie
  if (sort === 'newest') {
    blogList.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  } else if (sort === 'oldest') {
    blogList.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
  } else if (sort === 'best') {
    // blogList.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Zbierz unikalne kategorie (np. do selecta)
  const allData = JSON.parse(data).filter(x => x.active && new Date(x.publishDate) < new Date());
  const categories = [...new Set(allData.map(post => post.section))];
 console.log(allData, categories, blogList, 'data')
  res.render('blog', {
    blogList,
    list: true,      // pokaże przycisk "ZOBACZ WIĘCEJ"
    q,
    category,
    sort,
    categories,
  });
  // const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  // const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());

  // res.render('blog', { blogList, list: true});
};

exports.policy = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date()).slice(0, 6);
  res.render('policy', { blogList});
};
exports.blog = async (req, res) => {
  const data = await fs.readFileSync(blogListFILE, { encoding: 'utf8' });
  const blogListAll = JSON.parse(data)

  const blogList = blogListAll.filter(x => x.active).filter(d => new Date(d.publishDate) < new Date()).slice(0, 6);
  const post = blogListAll.find(post => post.slug == req.params.slug);
  if (!post) {
    return res.status(404).render('error', { message: 'Wpisu nie znleziono', status: 404 });
  }
  post.publishDate = helper.formatDate(post.publishDate);
  return res.render('blog/'+req.params.slug.replace('.html', ''), { blogList, post });
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
    const { email } = req.body;
    const emailFormated = email.toLowerCase()
    // Walidacja
    if (!email) {
      return res.status(400).send('Wszystkie pola są wymagane.');
    }

    const entry = {
      email: emailFormated,
      consent: true,
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
       mail.sendCustomMail('Sign in newslatter', emailFormated.replace('@', '.'), 'slawek.lenczner@gmail.com')

      // Można tu dodać redirect albo komunikat
      res.send('Dziękujemy za zapis! Sprawdź swoją skrzynkę, aby potwierdzić subskrypcję.');
    });
}
