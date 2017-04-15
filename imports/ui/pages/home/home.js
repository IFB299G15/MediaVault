import './home.html';

import '../../components/fileList/fileList.js';
import '../../modals/deleteFile/deleteFile.js';
import { Files } from '../../../api/files/files.js';

Template.uploadForm.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    }
});

Template.uploadForm.events({
    'change #fileInput': function (e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // multiple files were selected
            var upload = Files.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
            }, false);

            upload.on('start', function () {
                template.currentUpload.set(this);
            });

            upload.on('end', function (error, fileObj) {
                if (error) {
                    //alert('Error during upload: ' + error);
                    toastr.error('Error during upload: ' + error, "Error")
                } else {
                    toastr.success('File "' + fileObj.name + '" successfully uploaded', "Uploaded.")
                }
                template.currentUpload.set(false);
            });

            upload.start();
        }
    }
});