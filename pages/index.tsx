import React, { useState } from "react"
import Editor from "../components/editor"
import styles from "../styles/Home.module.css"

function Index() {
  const [data, setData] = useState(null)

  return (
    <div className={styles.container}>
      <Editor value={data} onChange={(v: any) => setData(v)} />

      <div className="content">
        {data && <div dangerouslySetInnerHTML={{ __html: data }}></div>}
      </div>
    </div>
  )
}

export default Index
