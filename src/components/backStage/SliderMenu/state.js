import { observable, action } from 'mobx'

class State {
    @observable menuStyle = ''
    @observable current = ''
    @observable departs = {}

    @action setMenuStyle = (menuStyle) => {
        this.menuStyle = menuStyle
    }
    @action setCurrent = (current) => {
        this.current = current
    }
    @action setDeparts = (departs) => {
        this.departs = departs
    }

}

export default new State()