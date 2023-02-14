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
          "fontBackgroundColor",
          "fontColor",
          "fontFamily",
          "essentials",
          "fontSize",
          "highlight",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "alignment",

          "|",
          "imageInsert",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "pageBreak",
          "undo",
          "redo",
          {
            name: "Other",
            title: "Other",
            items: [
              "findAndReplace",
              "code",
              "removeFormat",
              "specialCharacters",
              "htmlEmbed"
            ]
          }
        ],

        image: {
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "imageStyle:alignLeft",
            "imageStyle:alignCenter",
            "imageStyle:alignRight",
            "linkImage",
            "ImageStyle",
            "ImageResize"
          ]
        }
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
