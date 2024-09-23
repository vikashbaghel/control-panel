import uploadFile from "../components/uploadFile";

async function ckEditorUpload(file, handler) {
  let { name, type, size } = file;
  return await uploadFile(
    { name, type, originFileObj: file },
    { is_public: true }
  ).then(({ fileUrl }) => {
    handler(size);
    return {
      default: fileUrl,
    };
  });
}

class ckEditorUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file) =>
      ckEditorUpload(file, (size) => {
        this.loader.uploadTotal = size;
        this.loader.uploaded = size;
      })
    );
  }

  abort() {}
}

export default ckEditorUploadAdapter;
