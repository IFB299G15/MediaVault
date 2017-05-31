/**
 * Created by John Board on 12-Apr-17.
 */
import { Files } from "./files.js";
import { Tags } from "../tags/tags.js";

export const deleteFile = new ValidatedMethod({
  name: "Files.methods.delete",
  validate: new SimpleSchema({
    _id: {
      type: String
    }
  }).validator(),
  run: ({_id}) => {
    try {
      Files.remove(_id);
      Tags.remove({fileID: _id});
    } catch (ex){}
  }
});

export const renameFile = new ValidatedMethod({
  name: "Files.methods.rename",
  validate: new SimpleSchema({
    _id: {
      type: String
    },
    newName: {
      type: String
    }
  }).validator(),
  run: ({_id, newName}) => {
    Files.update(_id, {$set: {name: newName}});
  }
});

export const queryFiles = new ValidatedMethod({
  name: "Files.methods.query",
  validate: new SimpleSchema({
    query: {
      type: String,
      defaultValue: ""
    }
  }).validator(),
  run: ({query}) => {
    /* Generates RegExp pattern from space seperated search strings */
    queryString = ".*"+query.split(" ").join("|")+".*";
    queryRegExp = new RegExp(queryString);

    files = Files.find({"name": queryRegExp}).fetch();
    endFiles = _.map(files, (doc) => doc._id);

    tags = Tags.find({tagName: queryRegExp}).fetch();
    endTags =  _.map(tags, (doc) => doc.fileID);

    return _.uniq(endFiles.concat(endTags));
  }
});

export const incrementDownloads = new ValidatedMethod({
  name: "Files.methods.incrementDownloads",
  validate: new SimpleSchema({
    id: {
      type: String
    }
  }).validator(),
  run: ({id}) => {
    Files.update(id, {$inc: {downloads: 1}});
  }
});

export const setPublic = new ValidatedMethod({
  name: "Files.methods.setPublic",
  validate: new SimpleSchema({
    id: {
      type: String
    },
    public: {
      type: Boolean
    }
  }).validator(),
  run: ({id, public}) => {
    Files.update(id, {$set: {"global": public}});
  }
});

export const generatePreview = new ValidatedMethod({
  name: "files.generatePreview",
  validate: () => undefined,
  run: (fileObj) => {
    let options = {
      height: 400
    };
    let previewName = fileObj._id+"_preview.png";
    let previewPath = "/var/www/eantecomau/previews/" + previewName;
    let previewURL = 'eante.com.au/previews/'+previewName;

    if(Meteor.isServer) {
      filepreview = require("../../../libs/filepreview/filepreview.js");
      let output = filepreview.generateSync(fileObj.path, previewPath, options);
      Files.update(fileObj._id, {$set: {previewURL: previewURL}});
    }
  }
});