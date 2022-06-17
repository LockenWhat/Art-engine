/*const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path")
const basePath = process.cwd();
const fs = require("fs");
//'${basePath}/build/images'
fs.readdirSync(`${basePath}/build/images`).forEach(file => {
    const formData = new FormData();
    const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
    formData.append("file", fileStream); 
    let url = 'https://api.nftport.xyz/v0/files';

let options = {
  method: 'PATH',
  headers: {
    Authorization: 'adc415b5-ea40-40d9-83ac-c039d1f6e291',
  },
  body: formData
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => {
      const fileName = path.parse(json.file_name).name;
      let rawdata = fs.readFileSync(`${basePath}/build/json/${fileName}`);
      let metaData = JSON.parse(rawdata);

      metaData.image = json.ipfs_url;

      fs.writeFileSync(
          `${basePath}/build/json/${fileName}`,
      JSON.stringify(metaData, null, 2)
       );

      console.log(`So um I am not so sure but uhhh I did some work, to say it formally - ${json.file_name} uploaded & ${fileName} updated brother!`)
  })
  .catch((err) => console.error('error:' + err));
})*/














const FormData = require("form-data");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const { RateLimit } = require('async-sema');
const { fetchWithRetry } = require(`${basePath}/utils/functions/fetchWithRetry.js`);

const { LIMIT } = require(`${basePath}/src/config.js`);
const _limit = RateLimit(LIMIT);

const allMetadata = [];
const regex = new RegExp("^([0-9]+).png");


async function main() {
  console.log("Starting upload of images...");
  const files = fs.readdirSync(`${basePath}/build/images`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });
  for (const file of files) {
    try {
      if (regex.test(file)) {
        const fileName = path.parse(file).name;
        let jsonFile = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
        let metaData = JSON.parse(jsonFile);

        if(!metaData.file_url.includes('https://')) {
          await _limit()
          const url = "https://api.nftport.xyz/v0/files";
          const formData = new FormData();
          const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
          formData.append("file", fileStream);
          const options = {
            method: "POST",
            headers: {
              Authorization: 'adc415b5-ea40-40d9-83ac-c039d1f6e291',
            },
            body: formData,
          };
          const response = await fetchWithRetry(url, options);
          metaData.file_url = response.ipfs_url;
          metaData.image = response.ipfs_url;

          fs.writeFileSync(
            `${basePath}/build/json/${fileName}`,
            JSON.stringify(metaData, null, 2)
          );
          console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
        } else {
          console.log(`${fileName} already uploaded.`);
        }

        allMetadata.push(metaData);
      }
    } catch (error) {
      console.log(`Catch: ${error}`);
    }
  }

  fs.writeFileSync(
    `${basePath}/build/json/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

main();