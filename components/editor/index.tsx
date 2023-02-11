import axios from "axios";

import React, { useState, useRef, useEffect } from "react";

const UPLOAD_ENDPOINT = "/api/upload";
const API_URL = "http://localhost:3000";
const Editor = ({ value, onChange }: any) => {
  const editorRef = useRef<any>();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, FullEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      FullEditor: require("ckeditor5-build-full"),
    };
    setEditorLoaded(true);
  }, []);

  function uploadAdapter(loader: any) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file: any) => {
            body.append("files", file);

            axios
              .post(`${API_URL}/${UPLOAD_ENDPOINT}`, body)
              .then((res: any) => res)
              .then((res: any) => {
                resolve({
                  default: `/${res.data.filename}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader);
    };
  }

  return editorLoaded ? (
    <CKEditor
      editor={FullEditor}
      data={value}
      config={{
        extraPlugins: [uploadPlugin],
        language: {
          ui: "en",
          content: "en",
        },
      }}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  ) : (
    <div>Editor loading</div>
  );
};

export default Editor;
