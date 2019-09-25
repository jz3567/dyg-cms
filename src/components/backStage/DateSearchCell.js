import React from 'react';
import { DatePicker } from "antd";

import moment from "moment";
import "moment/locale/zh-cn";

const { RangePicker } = DatePicker;
moment.locale("zh-cn");

export default class DateSearchCell extends React.Component {
    
      state = {
        data: this.props.data
      }
    
      onChange = (date, dateString) => {
        const [start, end] = dateString;
        const validDate = start && end;
        const {data} = this.state;
        const {column} = this.props;
        this.props.cb({
          data: data.map(record => {
            const match = start <= record[column] && end >= record[column];
            if (validDate && !match) {
              return null;
            }
            // const tmpRecord = {...record};
            return record;
          })
          .filter(record => !!record),
          filtered: true,
        })
      }
    
      render() {
        return (
          <div className="custom-filter-dropdown">
            <RangePicker column={this.props.column} onChange={this.onChange} 
              showTime={{ defaultValue: [moment('08:00:00', 'HH:mm'), moment('08:00', 'HH:mm')] }} format="YYYY-MM-DD HH:mm"/>
          </div>
        );
      }
}
    
    