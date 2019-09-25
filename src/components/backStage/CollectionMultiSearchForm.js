import { Modal, Form, Input, Select, DatePicker } from 'antd';
import React from 'react';
import { configUtils } from '../../utils'
import moment from "moment";
import "moment/locale/zh-cn";
import backStageState from '../../pages/backStage/state'

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

moment.locale("zh-cn");
const Option = Select.Option;

const CollectionMultiSearchForm = Form.create()(
  class extends React.Component {

    state = {
      confirmLoading: false,
      value: ''
    }

    render() {
      const optionValues = backStageState.optionValues
      const { visible, onCancel, onCreate, form, mapper } = this.props;
      const { getFieldDecorator } = form;

      const generateItem = (labelName, i) => {
        const optionsValue = optionValues[labelName];
        return (
          <FormItem label={configUtils.getColNameByMapper(labelName, mapper)} key={i}>
            {getFieldDecorator(labelName, {
            })(
              configUtils.isDate(labelName) ?
                <RangePicker onChange={this.onChange}
                  showTime={{ defaultValue: [moment('08:00:00', 'HH:mm'), moment('08:00', 'HH:mm')] }} format="YYYY-MM-DD HH:mm" />
                :
                configUtils.isSelector(labelName) ? (
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }>
                    {
                      Object.keys(optionsValue).map((val, i) => {
                        return <Option key={i} value={val}>{optionsValue[val]}</Option>
                      })
                    }
                  </Select>
                ) :
                  <Input allowClear/>
              )}
          </FormItem>
        )
      }

      const labels = this.props.labels
      return (
        <Modal
          visible={visible}
          title="多重筛选"
          okText="筛选"
          onCancel={onCancel}
          onOk={() => onCreate(
            () => this.setState({ confirmLoading: true }),
            () => this.setState({ confirmLoading: false })
          )}
          confirmLoading={this.state.confirmLoading}
          width='800px'
          >
          <Form layout="vertical" style={{
            display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'
          }}>
            {
              labels.map((label, i) => generateItem(label, i))
            }
          </Form>
        </Modal>
      );
    }
  }
);


export default CollectionMultiSearchForm;