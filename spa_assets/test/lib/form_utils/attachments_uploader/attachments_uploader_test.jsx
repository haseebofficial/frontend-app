import test from "enhanced-tape";
import { nextTick } from "test/support/event_loop";
import { renderHook } from '@testing-library/react-hooks';
import { useAttachmentsUploader, uploadFiles, removeAttachment } from "form_utils/attachments_uploader";

function uploadFile(file) {
  return Promise.resolve(uploadedAttachment(file));
}

function uploadedAttachment(file) {
  return `attachment_${file.name}`;
}

function dummyFile(name) {
  return new File(["dummy"], name, { type: 'text/plain' });
}

test("useAttachmentsUploader", function(t) {
  function getAttachments(uploader) {
    return current(uploader)[0];
  }

  function getDispatch(uploader) {
    return current(uploader)[1];
  }

  function current(uploader) {
    return uploader.result.current;
  }

  function dispatch(uploader, action) {
    return getDispatch(uploader)(action);
  }

  t.test("base properties", function(t) {
    t.test("returns empty attachments and dispatch fun by default", function(t) {
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));
      let [attachments, dispatch] = current(uploader);

      t.same(attachments, []);
      t.equal(typeof dispatch, "function");
    
      t.end();
    });

    t.test("preserves dispatch's identity between changes if callbacks objects doesn't change", function(t) {
      let callbacks = {uploadFile};
      let uploader = renderHook(() => useAttachmentsUploader(callbacks));

      let oldDispatch = getDispatch(uploader);
      dispatch(uploader, uploadFiles([dummyFile("test.txt")]));
      let newDispatch = getDispatch(uploader);

      t.equal(oldDispatch, newDispatch);
    
      t.end();
    });
  });

  t.test("dispatch: uploadFiles", function(t) {
    t.test("updates attachments list before uploading", function(t) {
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));
      let file = dummyFile("test.txt");

      dispatch(uploader, uploadFiles([file]));

      let [attachment] = getAttachments(uploader);
      t.equal(attachment.isUploaded, false);
      t.equal(attachment.file, file);
      t.equal(attachment.uploaderResult, undefined);
  
      t.end();
    });

    t.test("updates attachments list after uploading", async function(t) {
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));
      let file = dummyFile("test.txt");

      dispatch(uploader, uploadFiles([file]));
      await nextTick();

      let [attachment] = getAttachments(uploader);
      t.equal(attachment.isUploaded, true);
      t.equal(attachment.file, file);
      t.equal(attachment.uploaderResult, uploadedAttachment(file));
  
      t.end();
    });

    t.test("works with multiple consequent uploads", async function(t) {
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));

      dispatch(uploader, uploadFiles([dummyFile("test_1.txt")]));
      dispatch(uploader, uploadFiles([dummyFile("test_2.txt")]));
      await nextTick();

      let [attachment_1, attachment_2] = getAttachments(uploader);
      t.equal(attachment_1.file.name, "test_1.txt");
      t.equal(attachment_2.file.name, "test_2.txt");
    
      t.end();
    });

    t.test("removes attachment if upload failed", async function(t) {
      let uploadFile = () => Promise.reject();
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));

      dispatch(uploader, uploadFiles([dummyFile("test.txt")]));
      await nextTick();

      let attachments = getAttachments(uploader);
      t.same(attachments, []);

      t.end();
    });
  });

  t.test("dispatch: removeAttachment", function(t) {
    t.test("removes attachment from list", function(t) {
      let uploader = renderHook(() => useAttachmentsUploader({uploadFile}));

      dispatch(uploader, uploadFiles([dummyFile("test_1.txt"), dummyFile("test_2.txt")]));
      let [attachment_1] = getAttachments(uploader);
      dispatch(uploader, removeAttachment(attachment_1));
  
      let attachments = getAttachments(uploader);
      t.equal(attachments.length, 1);
      t.same(attachments[0].file.name, "test_2.txt");

      t.end();
    });
  });
});