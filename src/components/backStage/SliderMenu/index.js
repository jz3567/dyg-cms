import React from 'react'
import { Menu, Icon } from 'antd'
import state from './state'
import menus from '../../../config/menu'
import { observer } from 'mobx-react'

const SubMenu = Menu.SubMenu

export default
@observer
class SliderMenu extends React.Component {
  constructor(props) {
    super(props)
    this.initState()
  }

  initState = () => {
    state.setCurrent('1')
  }

  handleClick = e => {
    this.props.redirectToPage(e.key)
    state.setCurrent(e.key)
  }

  render() {
    return (
      <div style={{ color: 'white' }}>
        <Menu
          theme={'dark'}
          onClick={this.handleClick}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode='inline'
        >
          {menus.menus.map(menu => (
            <SubMenu
              key={menu.key}
              title={
                <span>
                  <Icon type={menu.icon} />
                  <span>{menu.title}</span>
                </span>
              }
            >
              {menu.subs.map(sub => (
                <Menu.Item key={sub.key}>{sub.title}</Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </div>
    )
  }
}
