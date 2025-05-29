const fs = require("fs");

exports.home = async (req, res) => {
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  console.log()
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());

  res.render('index', { blogList});
};
exports.policy = async (req, res) => {
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());;
  res.render('policy', { blogList});
};
exports.blog = async (req, res) => {
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  const blogList = JSON.parse(data).filter(x => x.active).filter(d => new Date(d.publishDate) < new Date());;
  console.log(req.params)
  res.render('blog/'+req.params.slug.replace('.html', ''), { blogList});
};
