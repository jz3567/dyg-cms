import React from 'react'
import E from 'wangeditor'
import { observer } from 'mobx-react'
import state from './state'

export default @observer class extends React.Component {

  componentDidMount() {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    const { onChange } = this.props;
    editor.customConfig.onchange = html => {
      onChange && onChange(state.editorContent)
      state.setEditorContent(html)
    }
    editor.customConfig.uploadImgShowBase64 = true
    editor.create()

    editor.txt.html(state.editorContent)

    // autorun(() => {
    //   onChange && onChange(state.editorContent)
    // });
  }

  render() {
    return <div ref='editorElem' style={{ width: '950px', }} {...this.props} ></div>
  }
}
