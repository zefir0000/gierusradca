const fs = require("fs");
const helper = require("../services/helper")
exports.newPage = async (req, res) => {
  res.render('admin/addPage', { title: 'Nowa strona' });
};

exports.editPage = async (req, res) => {
  const startTag = '<div style="padding-bottom:3rem">';
  const endTag = '</div></section>';

  const slug = req.params.slug;

  const data = await fs.readFileSync(`views/blog/${slug}.ejs`, { encoding: 'utf8' });
  const title = data.match(/title:\s*"([^"]+)"/)[1];
  const section = data.match(/<h4[^>]*>(.*?)<\/h4>/i)[1];
  const image = data.match(/<img[^>]+src=["'][^"']*\/([^\/"']+\.\w+)["']/i)[1];
  const startIndex = data.indexOf(startTag);

  const endIndex = data.indexOf(endTag);
  const content = startTag !== -1 && endIndex !== -1 ? data.slice(startIndex + startTag.length, endIndex) : data;

  res.render('admin/editPage', { title, section, image, content, slug });
};

exports.manageBlog = async (req, res) => {
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  const blogList = JSON.parse(data);

  res.render('admin/manageBlog',  { data: blogList});
};
exports.update = async (req, res) => {
  let updatedPages = req.body.pages || [];
    updatedPages = Object.values(updatedPages).map(page => ({
      title: page.title,
      section: page.section,
      active: page.active === 'true',
      slug: page.slug,
      image: page.image,
      publishDate: page.publishDate
  }));
    await helper.saveTextFile(`common/blogList.txt`, JSON.stringify(updatedPages));
    res.render('admin/success', { redirectUrl: '/admin/manage-blog' });
};
exports.addPage = async (req, res) => {
  const slug = helper.createSlug(req.body.title)
  const filePath = req.file.path.replace('public', '')
  const modHeader = header
    .replace(/:pageTitle/mg, req.body.title)
    .replace(/:pageSection/mg, req.body.section)

    .replace(/:pageCanonical/mg, slug)
    .replace(/:filePathImage/mg, filePath);

  await helper.saveTextFile(`views/blog/${slug}.ejs`, modHeader + req.body.content + footer);
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  const blogList = JSON.parse(data);

  blogList.push({
    title: req.body.title,
    section: req.body.section,
    active: 'false',
    slug: slug,
    image: filePath,
  })
}
exports.uploadImage = async (req, res) => {
  res.render('admin/addImage');

}
exports.addImage = async (req, res) => {
  const filePath = req.file.path.replace('public', '')
  res.json({ redirectUrl: filePath });
}
exports.updatePage = async (req, res) => {
  const slug = req.body.slug;
  const filePath = '/images/' + req.body.image;
  const modHeader = header
    .replace(/:pageTitle/mg, req.body.title)
    .replace(/:pageSection/mg, req.body.section)

    .replace(/:pageCanonical/mg, slug)
    .replace(/:filePathImage/mg, filePath);

    const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });

    const blogList = JSON.parse(data);
    const existing = blogList.find(post => post.slug === slug);
    existing.image = filePath;

    await helper.saveTextFile(`common/blogList.txt`, JSON.stringify(blogList));
  await helper.saveTextFile(`views/blog/${slug}.ejs`, modHeader + req.body.content + footer);
  res.render('admin/success', { redirectUrl: '/admin/manage-blog' });
}

exports.addPage = async (req, res) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // miesiące od 0
  const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${day}.${month}.${year}`;
  const slug = helper.createSlug(req.body.title)
  const filePath = req.file.path.replace('public', '')
  const modHeader = header
    .replace(/:pageTitle/mg, req.body.title)
    .replace(/:pageSection/mg, req.body.section)

    .replace(/:pageCanonical/mg, slug)
    .replace(/:filePathImage/mg, filePath);
  const publicDate = `<span class="blog-data">opublikowano: ${formattedDate} r.</span><br>`
  await helper.saveTextFile(`views/blog/${slug}.ejs`, modHeader + req.body.content + publicDate + footer);
  const data = await fs.readFileSync('common/blogList.txt', { encoding: 'utf8' });
  const blogList = JSON.parse(data);

  blogList.unshift({
      title: req.body.title,
      section: req.body.section,
      active: 'false',
      slug: slug,
      image: filePath,
  })

  await helper.saveTextFile(`common/blogList.txt`, JSON.stringify(blogList));

  res.json({ redirectUrl: `/blog/${slug}` })
};

const header = `<!DOCTYPE html>
<!--[if IE 8 ]><html class="no-js oldie ie8" lang="pl"> <![endif]-->
<!--[if IE 9 ]><html class="no-js oldie ie9" lang="pl"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!-->
<html class="no-js" lang="pl">
<!--<![endif]-->
<%- include('../../views/components/head.ejs', {
  title: ":pageTitle" }); -%>

  <head>
    <link rel="canonical" href="https://gierusradca.pl/blog/:pageCanonical" />
  </head>

  <body id="top">

    <%- include('../../views/components/headerBlog.ejs'); -%>

      <section id="blog-page">
        <div style="width: 100%; height: 150px; background-color:rgb(1, 20, 54);"></div>
        <div class="blog-section">
          <br>
          <h1 style="color: #000;">:pageTitle</h1>

          <h4 style="color: rgba(0,0,0, 0.658);">:pageSection</h4>
          <div style="text-align: center; margin: 20px; ">
            <img src="..:filePathImage" alt=":pageCanonical">
          </div><div style="padding-bottom:3rem">`;
const footer = `
</div></section>
<%- include('../../views/components/blogList.ejs'); -%>
  <%- include('../../views/components/contact.ejs'); -%>
    <%- include('../../views/components/dependency.ejs'); -%>
</body>
</html>`;