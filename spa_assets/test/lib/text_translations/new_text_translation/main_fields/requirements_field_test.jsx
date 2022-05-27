import test from "test/browser_tape";
import { fireEvent } from "test/support/react_renderer";
import api from "api_routes";
import { mockFormData } from "test/lib/improved_fetch/test_helpers";
import { 
  awaitRequestForm,
  fillRequestForm, 
  submitRequestForm, 
  wasRequestFormSubmitted,
  mockRequestSubmit
} from "test/lib/text_translations/new_text_translation/test_helpers";

test("RequestForm: requirements_field", function(t) {
  t.test("words count field", function(t) {
    t.test("is displayed by default", async function(t) {
      let form = await awaitRequestForm();
      t.true(form.queryByTestId("words-count-input"));
  
      t.end();
    });
  });

  t.test("attachments uploading", function(t) {
    t.test("hides attachments by default", async function(t) {
      let form = await awaitRequestForm();
      t.false(form.queryByTestId("attachments-list"));
  
      t.end();
    });

    t.test("displays attachments list and hides words count field", async function(t) {
      let form = await awaitRequestForm();
      let [file] = uploadAttachment(form, "text.txt");
      await awaitUpload();

      t.false(form.queryByTestId("words-count-input"));
      t.true(attachmentInput(form));
      t.true(form.queryByTestId("attachments-list"));
      t.true(form.queryByTestId(`attachment-${file.name}`));

    
      t.end();
    });

    t.test("removes attachments on click", async function(t) {
      let form = await awaitRequestForm();
      let [file] = uploadAttachment(form, "text.txt");
      await awaitUpload();

      fireEvent.click(form.queryByTestId(`remove-attachment-${file.name}`));
      t.false(form.queryByTestId("attachments-list"));
    
      t.end();
    });

    t.test("submits uploaded attachments with the form", async function(t) {
      let form = await awaitRequestForm();
      let formData = fillRequestForm(form);
      let [_file, attachment] = uploadAttachment(form, "text.txt");
      await awaitUpload();

      let request = Object.assign(formData, {attachmentUuids: [attachment.uuid]});
      delete request.wordCount;
      mockRequestSubmit(request);
      await submitRequestForm(form);

      t.true(wasRequestFormSubmitted(form));
    
      t.end();
    });
  });
});

function attachmentInput(form) {
  return form.queryByTestId("attachment-input");
}

function uploadAttachment(form, fileName) {
  let [file, attachment] = mockAttachment({name: fileName});
  fireEvent.change(attachmentInput(form), {target: { files: [file]} });

  return [file, attachment];
}

async function awaitUpload() {
  await fetch.awaitRequests();
}

function mockAttachment({name: filename}) {
  let file = new File(["pdf_content"], filename, { type: 'text/plain' });
  let attachment = {
    uuid: uuid(filename),
    url: `test.com/${filename}`,
    filename: filename
  };

  let response = { attachment };
  mockFormData(api.textTranslationAttachmentsPath(), response, {body: {file} });

  return [file, attachment];
}

function uuid(filename) {
  return `${filename}-123`;
}