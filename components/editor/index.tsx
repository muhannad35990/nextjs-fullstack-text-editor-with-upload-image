import axios from "axios"
import React, { useState, useRef, useEffect } from "react"

const UPLOAD_ENDPOINT = "/api/upload"

const Index = ({ value, onChange }: any) => {
  const editorRef = useRef<any>()
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false)
  const [text, setText] = useState<any>({})
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
    <div>
      <CKEditor
        editor={CustomEditor}
        data={value}
        config={{
          pluggin: ["WordCount"],
          wordCount: {
            onUpdate: (stats: any) => {
              setText({ characters: stats.characters, words: stats.words })
            }
          },

          extraPlugins: [uploadPlugin],
          mediaEmbed: {
            previewsInData: true
          },
          fontSize: {
            options: [
              "9",
              "10",
              "11",
              "12",
              "13",
              "default",
              "18",
              "20",
              "22",
              "24",
              "30",
              "40",
              "45",
              "50"
            ],
            supportAllValues: true
          },
          fontFamily: {
            options: [
              "default",
              "Arial, Helvetica, sans-serif",
              "Courier New, Courier, monospace",
              "Georgia, serif",
              "Lucida Sans Unicode, Lucida Grande, sans-serif",
              "Tahoma, Geneva, sans-serif",
              "Times New Roman, Times, serif",
              "Trebuchet MS, Helvetica, sans-serif",
              "Verdana, Geneva, sans-serif"
            ]
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
              label: "Other Options",
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
      <div className="word-count">
        <div className="word-count__words">Words: {text.words}</div>
        <div className="word-count__characters">
          Characters: {text.characters}
        </div>
      </div>
    </div>
  ) : (
    <div>Editor loading</div>
  )
}

export default Index
