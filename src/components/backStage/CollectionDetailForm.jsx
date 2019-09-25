import { Modal, Form, Input, Select, Table } from 'antd';
import React from 'react';
import { configUtils } from '../../utils'
import backStageState from '../../pages/backStage/state'
import axios from '../../utils/axios'
import _ from 'lodash'
import moment from 'moment'

const FormItem = Form.Item;

const Option = Select.Option;

const CollectionCreateForm = Form.create()(
  class extends React.Component {

    state = {
      confirmLoading: false,
      value: '',
      detailId: '',
      formData: {},
      dataList:[]
    }

    componentDidMount() {
      const { detailId, detail } = this.props
      this.setState({ detailId, detail })
    }

    componentWillReceiveProps(nextProps) {
      const { detailId } = nextProps
      if (detailId !== this.state.detailId){
        this.setState({ detailId }, this.update)
      }
    }

    update = () => {
      const { detail, detailId } = this.state
      const { detailParam } = this.props
      axios.get(`${detail}?${detailParam}=${detailId}`)
        .then(res => {
          const data = detailParam === 'actId'? res.data.data: res.data.data.data
          const [column1, column2] = Object.keys(data)
          const [formData = {}, dataList = []] = [data[column1], data[column2]]
          /// 没给想要的数据格式（好气
          let actData = []
          if(detailParam === 'actId'){
            dataList.forEach(item => {
              const dict = {}
              dict['lucky'] = item.lucky
              actData.push({...dict, ...item.user})
            })
          }
          this.setState({ formData, dataList: detailParam === 'actId'? actData: dataList })
        })
    }

    renderTable = () => {
      const data = this.state.dataList
      if (data.length === 0) return null
      
      const keys = Object.keys(data[0])
      const column = keys.map((key) => ({
        title: configUtils.getColNameByMapper(key, this.props.mapper), dataIndex: key,
        render: (__, record) => {
          const value = record[key]
          return configUtils.isPhoto(key) ? <img alt='' src={value} style={{ width: '100px', height: '100px' }} /> : 
            value === false ? '否': value === true? '是': value
        }
      }))

      const dataSource = data.map((value, index) => ({...value, key: index}))
      return <Table columns={column} dataSource={dataSource} pagination={false} />
    }

    generateOptions = (column) => {
      const optionValues = backStageState.optionValues
      const optionsValue = optionValues[column]
      Object.keys(optionsValue).map((val, i) => {
        return <Option key={i} value={val}>{optionsValue[val]}</Option>
      })
    }

    getInitValue = (labelName) => {
      if(configUtils.isDate(labelName)){
        let tempValue = this.state.formData[labelName]
        try{
          tempValue = moment(this.state.formData[labelName]).format('YYYY-MM-DD HH:mm:ss');
        } catch {}
        return tempValue
      }

      const value = this.state.formData[labelName]
      const optionValues = backStageState.optionValues
      const optionsValue = optionValues[labelName]
      return (optionsValue && optionsValue[value]) || value
    }

    render() {
      const { visible, onCancel, onOk, form, mapper } = this.props
      const { getFieldDecorator } = form

      const generateItem = (labelName, i) => {
        return (
          <FormItem label={configUtils.getColNameByMapper(labelName, mapper)} key={i}>
            {getFieldDecorator(labelName, {
              // valuePropName: 'checked',
              initialValue: this.getInitValue(labelName),
            })(
                configUtils.isPhoto(labelName) ? (
                  <img alt='' src={this.getInitValue(labelName)} style={{ width: '100px', height: '100px' }} />
                ) : (<Input disabled/>)
              )}
          </FormItem>
        )
      }

      // const labels = this.props.labels;
      const labels = Object.keys(this.state.formData)

      return (
        <Modal
          width={'1000px'}
          visible={visible}
          title="详情"
          onCancel={onCancel}
          onOk={onOk}
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
          {
            this.renderTable()
          }
        </Modal>
      );
    }
  }
);


export default CollectionCreateForm;