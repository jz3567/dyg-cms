import { observable, action } from 'mobx'

class State {
  @observable editorContent = ''
  @action setEditorContent = editorContent => {
    this.editorContent = editorContent
  }
}

export default new State()
