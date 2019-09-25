import React from 'react'
import { Modal } from 'antd'
import WangEditor from '../../WangEditor'
import editorState from '../../WangEditor/state'
import { observer } from 'mobx-react'
import state from './state'
import { configUtils } from '../../../utils'

export default
@observer
class extends React.Component {
  constructor(props) {
    super(props)
    state.setCol(this.props.col)
  }

  componentDidMount() {
    const { value } = this.props
    configUtils.isShrink(state.col) && this.initEditorContent(value)
  }

  initEditorContent = value => editorState.setEditorContent(value)

  renderId2Value = this.props.renderId2Value

  render() {
    const { setInputValue, value, setEditable, col } = this.props

    return (
      <React.Fragment>
        {/* ⬇️实质是modal内容 */}
        {this.renderId2Value(value, col, col)}
        <Modal
          visible={state.visible}
          title='修改页面'
          okText='修改'
          cancelText='取消'
          maskClosable={false}
          onCancel={() => {
            state.setVisible(false)
            setEditable(false)
            // 取消设置未空
            editorState.setEditorContent('')
          }}
          onOk={() => {
            state.setVisible(false)
            configUtils.isShrink(col) &&
              setInputValue(editorState.editorContent)

            // 完成之后设为空
            editorState.setEditorContent('')
          }}
          // confirmLoading={this.state.confirmLoading}
          width={'1000px'}
        >
          {configUtils.isShrink(col) ? (
            <WangEditor />
          ) : null}
        </Modal>
      </React.Fragment>
    )
  }
}
