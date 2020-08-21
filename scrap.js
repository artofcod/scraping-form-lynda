const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');

const dirPath = '/home/ola/co download';
const vgmUrl = 'https://www.lynda.com/Node-js-tutorials/Collect-POST-data/5016733/2214616-4.html?autoplay=true';

const checkBackSlash = (path) => {
  const wordlen = path.length;
  const lastChar = path.substr(wordlen - 1, wordlen);
  return lastChar;
};

function addbackslash(path) {
  return (checkBackSlash(path) !== '/') ? `${path}/` : '';
}

// eslint-disable-next-line consistent-return
const creatingCourseFolder = () => got(vgmUrl).then((res) => {
  const $ = cheerio.load(res.body);
  const courseName = $('.default-title')[0].attribs['data-course'];

  // Adding backslash "/" if not present in given url
  // Then addingthe course name as folder and a backslash after that
  const FolderCreationPath = `${addbackslash(dirPath) + courseName}/`;

  // Creating the folder
  if (courseName != null) {
    if (!fs.existsSync(FolderCreationPath)) {
      fs.mkdirSync(FolderCreationPath);
      console.log('course folder created  (:');
      return FolderCreationPath;
    }
    console.log(FolderCreationPath, ` \n folder is already persent in that path And
     puting subfolders into that folder   ): \n\n`);
    return FolderCreationPath;
  }
});

(async () => {
  const courseFolder = await creatingCourseFolder();
  console.log('creating Child folders ....... \n\n');
  got(vgmUrl).then((response) => {
    const $ = cheerio.load(response.body);
    $('.course-toc h4.ga').each((i, link) => {
      let childFolderNanme = link.children[0].data;

      if (i === 0) {
        childFolderNanme = `0. ${childFolderNanme}`;
      }

      if (!fs.existsSync(courseFolder + childFolderNanme)) {
        fs.mkdirSync(courseFolder + childFolderNanme);
      }

      console.log(i, ' => ', childFolderNanme, '\n');
    });
    console.log('\n\nfolder created ... \n\n');
  }).catch((err) => {
    console.log(err);
  });
})();
