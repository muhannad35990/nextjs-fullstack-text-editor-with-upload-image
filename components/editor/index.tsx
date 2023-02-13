import axios from "axios"

import React, { useState, useRef, useEffect } from "react"

const UPLOAD_ENDPOINT = "/api/upload"

const Index = ({ value, onChange }: any) => {
  const editorRef = useRef<any>()
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false)
  const { CKEditor, CustomEditor }: any = editorRef.current || {}

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      CustomEditor: require("ckeditor5-custom-build/build/ckeditor")
    }
    setEditorLoaded(true)
  }, [])

  function uploadAdapter(loader: any) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData()

          loader.file.then((file: any) => {
            body.append("files", file)

            axios
              .post(`${UPLOAD_ENDPOINT}`, body)
              .then((res) => res)
              .then((res) => {
                resolve({
                  default: `${res.data.filename}`
                })
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
      }
    }
  }
  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return uploadAdapter(loader)
    }
  }

  return editorLoaded ? (
    <CKEditor
      editor={CustomEditor}
      data={value}
      config={{
        extraPlugins: [uploadPlugin],
        mediaEmbed: {
          previewsInData: true
        },
        toolbar: [
          "bold",
          "italic",
          "underline",
          "link",
          "strikethrough",
          "horizontalLine",
          "highlight",
          "fontBackgroundColor",
          "fontColor",
          "fontFamily",
          "fontSize",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "alignment",
          "outdent",
          "indent",
          "|",
          "imageInsert",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "undo",
          "redo",
          "findAndReplace",
          "code",
          "pageBreak",
          "removeFormat",
          "specialCharacters",
          "htmlEmbed"
        ]
      }}
      onChange={(event: any, editor: any) => {
        const data = editor.getData()

        onChange(data)
      }}
    />
  ) : (
    <div>Editor loading</div>
  )
}

export default Index
