import { Modal, Form, Input, Select, DatePicker } from 'antd';
import React from 'react';
import PicturesWall from './PicturesWall';
import { configUtils } from '../../utils'
import moment from "moment";
import "moment/locale/zh-cn";
import WangEditor from '../WangEditor'
import wangeditorState from '../WangEditor/state'
import backStageState from '../../pages/backStage/state'

const FormItem = Form.Item;

moment.locale("zh-cn");
const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {

    state = {
      confirmLoading: false,
      value: '',
    }

    generateOptions = (column) => {
      const optionValues = backStageState.optionValues
      const optionsValue = optionValues[column]
      Object.keys(optionsValue).map((val, i) => {
        return <Option key={i} value={val}>{optionsValue[val]}</Option>
      })
    }

    render() {
      const optionValues = backStageState.optionValues
      const { visible, onCancel, onCreate, form, mapper, mustInput } = this.props
      const { getFieldDecorator } = form
      const generateItem = (labelName, i) => {
        const optionsValue = optionValues[labelName]
        return (
          <FormItem label={configUtils.getColNameByMapper(labelName, mapper)} key={i}>
            {getFieldDecorator(labelName, {
              rules: [{
                required: (mustInput && mustInput.includes(labelName)), message: '请输入内容！'
              }]
            })(
               configUtils.isSelector(labelName) ? (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  /* onChange={(value)=>this.props.form.setFieldsValue({value})} */
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  >
                  {
                    optionsValue && Object.keys(optionsValue).map((val, i) => {
                      return <Option key={i} value={val}>{optionsValue[val]}</Option>
                    })
                  }
                </Select>
              ) :
                  configUtils.isDate(labelName) ? (
                    <DatePicker
                      /* initialValue={moment('2018-01-01', 'YYYY-MM-DD')} */
                      showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}
                      format="YYYY-MM-DD HH:mm:ss"
                      allowClear={false}
                      />
                  ) :
                    configUtils.isPhoto(labelName) ? (
                      //因为受控组件，所以让控件重新render,下同
                      visible ? <PicturesWall isAdd={true} /> : <div />
                    ) :  configUtils.isShrink(labelName) ? (
                        visible? <WangEditor /> : <div />
                          ) : (<Input allowClear/>)
              )}
          </FormItem>
        )
      }

      const labels = this.props.labels;

      return (
        <Modal
          width={'1000px'}
          visible={visible}
          title="添加一条新纪录"
          okText="添加"
          onCancel={onCancel}
          onOk={() => onCreate(
            () => this.setState({ confirmLoading: true }),
            () => {
              this.setState({ confirmLoading: false })
              //成功之后清空数据
              wangeditorState.setEditorContent('')
            }
          )}
          confirmLoading={this.state.confirmLoading}
          >
          <Form layout="vertical" style={{
            display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
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


export default CollectionCreateForm;