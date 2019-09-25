import React from 'react';
import {Button, Input} from "antd";
import { configUtils } from '../../utils';

export default class SearchCell extends React.Component {
    state = {
      filterDropdownVisible: false,
      data: this.props.data,
      searchText: "",
      filtered: false,
      searchDate: "",
    };
  
    onInputChange = e => {
      this.setState({ searchText: e.target.value });
    };
    
    onSearch = (column) => {
      const { searchText, data } = this.state;
      const reg = new RegExp(searchText, "gi");
      this.setState({
        filterDropdownVisible: false,
        filtered: !!searchText,
      }, () => this.props.cb(
        {
          data: data.map(record => {
            // let condition = configUtils.isLessionId(column) ? record.classifyid : column
            const condition = column
            //解决筛选id匹配问题
            const renderId2Name = this.props.renderId2Name;
            const value = configUtils.isNumber(record[column]) ? record[column] + "" : record[column]
            const match = (renderId2Name ? renderId2Name(value, column, condition): value).match(reg) ;
            if (!match) {
              return null;
            }
            const tmpRecord = {...record};
            return tmpRecord;
          }).filter(record => !!record), 
        filtered: true,
      }));
      
    };
  
    render() {
      return (
      <div className="custom-filter-dropdown">
          <Input
            allowClear
            ref={ele => (this.searchInput = ele)}
            placeholder="内容"
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={() => this.onSearch(this.props.column)}
          />
          <Button type="primary" onClick={() => this.onSearch(this.props.column)}>
            搜索
          </Button>
        </div>
      );
    }
  
  }