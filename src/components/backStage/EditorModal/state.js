import { observable, action } from 'mobx'

class State {
    @observable visible = false
    @observable col = ''

    @action setVisible = visible => this.visible = visible
    @action setCol = col => this.col = col
}

export default new State()
