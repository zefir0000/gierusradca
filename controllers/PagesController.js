
exports.home = async (req, res) => {

  res.render('index');
};
exports.blog = async (req, res) => {
  console.log(req.params)
  res.render('blog/'+req.params.slug.replace('.html', ''));
};

