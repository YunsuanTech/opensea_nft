const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { createAvatar } = require('@dicebear/avatars');
const style = require('@dicebear/avatars-bottts-sprites');

const {
  width,
  height,
  description,
  baseImageUri,
  startEditionFrom,
  endEditionAt,
} = require("./input/config.js");
const console = require("console");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
var metadataList = [];
var attributesList = [];

const saveImage = (_editionCount) => {
  let svg = createAvatar(style, { seed: _editionCount.toString() });
  fs.writeFileSync(
    `./output/${_editionCount}.svg`,
    Buffer.from(svg)
  );
};

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `#${_edition}`,
    description: description,
    image: `${baseImageUri}/${_edition}.svg`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const writeMetaData = (_data) => {
  fs.writeFileSync("./output/_metadata.json", _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.json`,
    JSON.stringify(metadataList.find((meta) => meta.edition == _editionCount))
  );
};

const startCreating = async () => {
  writeMetaData("");
  let editionCount = startEditionFrom;
  while (editionCount <= endEditionAt) {
        ctx.clearRect(0, 0, width, height);
        // drawBackground();
        saveImage(editionCount);
        addMetadata(editionCount);
        saveMetaDataSingleFile(editionCount);
        console.log(
          `Created edition: ${editionCount}`
        );
      editionCount++;
  }
  writeMetaData(JSON.stringify(metadataList));
};

startCreating();
