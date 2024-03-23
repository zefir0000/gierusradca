
exports.home = async (req, res) => {

  res.render('index');
};
exports.policy = async (req, res) => {

  res.render('policy');
};
exports.blog = async (req, res) => {
  console.log(req.params)
  res.render('blog/'+req.params.slug.replace('.html', ''));
};
