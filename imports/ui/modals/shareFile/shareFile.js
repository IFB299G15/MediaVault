/**
 * Created by John Board on 15-Apr-17.
 */
import './shareFile.html';
import '../modalTemplate/modalTemplate.js';

import { Files } from '../../../api/files/files.js';
import { getUsers } from '../../../api/users/methods.js';

Template.ui_modals_shareFile.onRendered(() => {
  setTimeout(() => {
    Meteor.call("Users.methods.getUsers", (error, result) => {
      let autocomplete = {};
      _.map(result, (doc) => {
        let key = doc.profile.name;
        autocomplete[key] = null;
      });
      console.log(autocomplete);
      $('.mv-sharedUserChips').material_chip({
        autocompleteOptions: {
          data: autocomplete,
          limit: Infinity,
          minLength: 1
        }
      });
    });
  }, 500);
});

Template.ui_modals_shareFile.helpers({
    getPublicLink: () => {
        return Files.findOne(Template.instance().data.file._id).link();
    },
    isPublic: () => {
        return Template.instance().data.file.public;
    }
});

Template.ui_modals_shareFile.events({
    "click .mv-publicLink": (event, template) => {
        event.target.select();
        document.execCommand('copy');
        toastr.success("Copied URL to clipboard.");
    },
    "change .mv-isPublic": (event, template) => {
        value = $(event.target).is(":checked");
        Meteor.call("Files.methods.setPublic", {id: Template.instance().data.file._id, public: value});
    }
});