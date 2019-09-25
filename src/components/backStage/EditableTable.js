import React from 'react'
import { Table, Button, Popconfirm, Modal, Spin } from 'antd'
import CollectionCreateForm from './CollectionCreateForm'
import { configUtils } from '../../utils'
import SearchCell from './SearchCell'
import DateSearchCell from './DateSearchCell'
import CollectionMultiSearchForm from './CollectionMultiSearchForm'
import CollectionDetailForm from './CollectionDetailForm'
import EditableCell from './EditableCell'
import backStageState from '../../pages/backStage/state'
import "./style/table.css"
import axios from '../../utils/axios'
import config from '../../config'
import moment from 'moment'
import _ from 'lodash'

export default class EditableTable extends React.Component {

  state = {
    searchCols: [],
    showCols: [],
    showData: [],
    expandable: true,
    searchText: '',
    formVisible: false,

    // 数据加载之前
    filtered: false,

    //多重筛选
    multiFormVisible: false,
    multiFilteredData: '',

    //detail
    detailVisible: false,
    detailId: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.optionValues !== nextProps.optionValues)
    //   return true
    if (this.state.showData !== nextState.showData)
      return true
    if (this.state.formVisible !== nextState.formVisible)
      return true
    if (this.state.multiFormVisible !== nextState.multiFormVisible)
      return true;
    if (this.state.showCols !== nextState.showCols)
      return true;
    if (this.state.detailVisible !== nextState.detailVisible)
      return true;
    return false;
  }

  componentDidMount() {
    this.loadTableData()
  }

  showDetails = (col) => {
    this.setState({detailVisible: true, detailId: col.mainKey || ''})
  }

  //处理数据格式
  loadTableData = (isAdd = false) => {
    console.log("table加载")
    let self = this;

    axios.get(self.props.selectUrl)
      .then(
        (result) => {
          let data = result.data && result.data.data
          // let data = result.data;

          if (data.length === 0) {
            self.setState({ filtered: true, showData: [] })
            return
          }
          // const keys = data && Object.keys(data[0].data);
          const keys = this.props.columns

          // 正常情况
          // const addCols = data[0].addKey || [];
          // const searchCols = data[0].searchKey || [];

          // 但是后端接口没改，所以
          const searchCols = keys

          const showCols = keys.map(
            (key) => ({
              title: configUtils.getColNameByMapper(key, this.props.mapper),
              dataIndex: key,
              render: (text, record) => this.renderColumns(text, record, key),
              sorter: (a, b) => configUtils.isNumber(a[key]) && configUtils.isNumber(b[key]) ? (a[key] - b[key]) : (a[key] > b[key] ? 1 : -1),
            })
          );

          const showData = data.map((val, key) => ({ ...val.data, key: key, description: val.description, mainKey: val.mainKey }));
          const expandable = _.get(data, '[0].description', false) && _.size(data[0].description) !== 0

          // 以上需要获取到，增加数据需要那些key（addCols），查询需要那些key（searchCols），数据源（showdata，实际展示到是filteredData），是否扩展（expandable）
          
          if(this.props.delData || this.props.detail) {
            showCols.push(
              {
                title: "操作",
                dataIndex: "operation",
                render: (_, record) => {
                  return (
                    <>
                    {
                      this.props.delData && 
                      <Popconfirm
                        title="确认删除？"
                        onConfirm={() => self.handleDelete(record.mainKey, record.key)}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    }
                    {
                      this.props.detail &&
                      <Popconfirm
                        title="查看详情"
                        disabled
                        trigger={'click'}
                      >
                          <a style={this.props.delData? {paddingLeft: '20px'}: {}} onClick={()=>this.showDetails(record)}>详情</a>
                      </Popconfirm>
                    }
                    </>
                  )
                }
              })
          }

          self.setState(
            { searchCols, showData, expandable },
            () => {
              if (showCols.length > 0) {
                self.setState({ showCols })
                isAdd && this.setState({ showData: [] }, () => this.setState({ showData }))
              }
            }
          );
        }
      )
      .catch((err) => {
        console.log('catch', err)
      })
  }

  renderId2Name = (text, column, condition, needImgDetect) => {

    if (configUtils.isPhoto(column) && needImgDetect) {
      //需要判断图片渲染的话
      return <img alt='' src={text} style={{ width: '100px', height: '100px' }} />
    }

    if (configUtils.isDate(column)) {
      try{
        // 如果是时间戳，转换为1以下格式
        text = moment(text).format('YYYY-MM-DD HH:mm:ss')
      } catch (e) {
        // 不变
        console.log('err date', e)
      }
      return text
    }

    const optionValues = backStageState.optionValues
    if (!configUtils.isSelector(column)) return text

    //处理selector的情况
    // const optionsValue = column === condition ? optionValues[column] || optionsValue : optionValues[column][condition] || optionsValue
    const optionsValue = column === condition ? optionValues[column] : optionValues[column][condition] 
    if (!optionsValue) return;

    if (typeof text === "number") text = text + "";
    if (text === undefined) return ""
    let value = ""
    text = text.split(",")
    text.forEach(val => {
      value += ((val in optionsValue ? optionsValue[val] : val) + ",")
    })
    value = value.substring(0, value.length - 1)
    
    return optionsValue && value;
    // return optionsValue && (text in optionsValue ? optionsValue[text] : text)
  }

  renderColumns = (text, record, column) => {
    // let condition = configUtils.isLessionId(column) ? record.classifyid : column;
    const condition = column
    return (
      <EditableCell
        mapper={this.props.mapper}
        keyValue={text}
        value={this.renderId2Name(text, column, condition)}
        column={column}
        onChange={(value, successCb, failCb) => 
            this.onCellChange(record.key, column, successCb, failCb)(text, value)}
        renderId2Value={this.renderId2Name}
        {...this.props}
      />
    )
  }

  renderExpandedRow = (record) => {
    const data = record.description;
    const self = this;
    if (!data) return null;
    const keys = Object.keys(data)
    const column = keys.map((key) => ({
      title: configUtils.getColNameByMapper(key, this.props.mapper), dataIndex: key,
      render: (_, record) => {
        const value = record[key];
        return configUtils.isPhoto(key) ? <img alt='' src={value} style={{ width: '100%', height: '20%' }} /> : self.renderId2Name(value, key, column)
      }
    }))

    const dataSource = [{ ...data, key: 0 }];
    return (
      <Table columns={column} dataSource={dataSource} pagination={false} />
    )
  }

  onCellChange = (key, dataIndex, successCb, failCb) => {
    
    return (text, value) => {
      if (configUtils.isSelector(dataIndex) && backStageState.optionValues[dataIndex][text] === value) {
        Modal.warning({ content: "修改成功" })
        return
      }
      const data = [...this.state.showData]
      let target = data.find(item => item.key === key)
      let self = this

      if (target) {
        // target[dataIndex] = configUtils.isPhoto(dataIndex) ? value.props.src : value;
        // target[dataIndex] = configUtils.isPhoto(dataIndex) ? bkValue.props.src : bkValue;
        
        target[dataIndex] = value
        
        // 暂用userId 127
        target['userId'] = 127

        axios.post(self.props.upUrl,
          { ...target })
          .then(
            (result) => {
              let msg = result.data
              let content = msg.msg || (msg.code == config.SUCCESS_CODE ? "修改成功" : "修改失败")
              Modal.warning({ content })
              if (msg.code === config.SUCCESS_CODE) {
                successCb()
                self.setState({ showData: data })
              } else {
                failCb()
              }
            })
          .catch(
            (err) => {
              console.log("catch", err)
              failCb();
            }
          )
      }
    }
  }

  // ⬇️handleCollectionCreateForm-------------------------------------------------
  handleFormCancel = () => {
    this.setState({ formVisible: false })
  }

  handleFormCreate = (startCb, endCb) => {
    const form = this.formRef.props.form;
    startCb()
    form.validateFields((err, values) => {
      if (err) {
        Modal.warning({
          content: "请填写完整信息！",
        })
        endCb()
        return;
      }

      let dateValues = {}
      Object.keys(values).filter((key) => configUtils.isDate(key))
        .forEach(key => {
          dateValues[key] = values[key].format("YYYY-MM-DD HH:mm:ss")
        })
      const sendData = { ...values, ...dateValues }
      axios.post(
        this.props.addUrl,
        { userId: 127, ...sendData })
        .then(
          (result) => {
            let msg = result.data;
            let content = msg.msg || (msg.code == config.SUCCESS_CODE ? "添加成功" : "添加失败")
            Modal.warning({ content })
            if (msg.code == config.SUCCESS_CODE) this.loadTableData(true)
            endCb()
          })
        .catch(
          err => {
            Modal.warning({
              content: "添加失败！"
            })
            endCb()
          }
        )
      form.resetFields();
      this.setState({ formVisible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleAdd = () => {
    this.setState({ formVisible: true });
  }

  // ⬆️CollectionCreateForm-------------------------------------------------

  // ⬇️CollectionMultiSearchForm-------------------------------------------------

  handleMultiSearch = () => {
    this.setState({ multiFormVisible: true });
  };

  handleMultiCancel = () => {
    this.setState({ multiFormVisible: false });
  }

  saveMultiFormRef = (formRef) => {
    this.multiFormRef = formRef
  }

  //多重筛选，因为可能有日期的存在，所以比较麻烦
  handleMultiSearchForm = (startCb, endCb) => {
    const form = this.multiFormRef.props.form;
    startCb()
    form.validateFields((err, values) => {
      //search这里的检测应该是不可能出现err的情况的
      if (err) {
        Modal.warning({
          content: "请填写完整信息！",
        })
        endCb()
        return;
      }

      //如果条件全部为空
      if (Object.values(values).every(r => (Array.isArray(r) && r.length === 0) || !!!r)) {
        this.setState({ multiFilteredData: this.state.showData, filtered: true, multiFormVisible: false })
        endCb()
        return;
      }

      let dateValues = {}, resultValues = {}
      Object.keys(values).filter(key => values[key])
        .forEach(k => {
          resultValues[k] = values[k]
        })

      Object.keys(resultValues).filter(key => configUtils.isDate(key))
        .forEach((key, i) => {
          dateValues[key] = values[key] && values[key].map(v => v.format("YYYY-MM-DD HH:mm:ss"))
        })

      resultValues = {
        ...resultValues,
        ...dateValues
      }

      let resultData = this.state.showData
      resultData = resultData.map(record => {

        return (Object.keys(resultValues).map(
          column => {
            const filterValue = resultValues[column]
            let dataValue = record[column]
            let match = false, matchDate = true, matchInput = true;
            if (configUtils.isDate(column)) {
              const [start, end] = filterValue
              matchDate = start <= dataValue && end >= dataValue
            }
            else {
              let dataValue = configUtils.isNumber(record[column]) ? record[column] + "" : record[column]
              const reg = new RegExp(filterValue, "gi");
              //因为下拉框传过来的值也是没render过的 所以直接用datavalue就可以了（datavalue是 id 也就是 123这样的）
              // matchInput = (renderId2Name ? renderId2Name(dataValue, column): dataValue).match(reg) ;
              dataValue = dataValue + ""
              matchInput = dataValue.match(reg);
            }
            match = matchDate && matchInput
            return match
          }
        ).every(r => !!r) ? record : null)
      }).filter(r => !!r)

      this.setState({ multiFilteredData: resultData, filtered: true })

      endCb()
      this.setState({ multiFormVisible: false })
    })
  }

  renderSearchCell = (column, data) => {
    return (<SearchCell cb={this.cb} column={column} data={data} renderId2Name={this.renderId2Name} />)
  }

  renderDateSearchCell = (column, data) => {
    return (<DateSearchCell cb={this.cb} column={column} data={data} />)
  }

  // ⬆️CollectionMultiSearchForm-------------------------------------------------

  handleDelete = (id, recordKey) => {
    const showData = [...this.state.showData]
    const delUrl = this.props.delUrl
    axios.post(
      // fuck backend 
      delUrl === '/commodity/delete'?
      `${delUrl}/${id}`: delUrl, 
      // ⬆️非要搞特殊
      { id })
      .then(
        (result) => {
          let msg = result.data;
          let content = msg.code == config.SUCCESS_CODE ? "删除成功" : "删除失败"
          Modal.warning({ content })
          if (msg.code == config.SUCCESS_CODE) this.setState({ showData: showData.filter(item => item.key !== recordKey) })
        })
      .catch(
        (err) => { console.log("catch", err) }
      )
  }

  render() {
    const { showCols, expandable } = this.state;
    const data = this.state.multiFilteredData || this.state.showData;
    return (
      (
        data.length === 0 && !this.state.filtered ?
          (
            <div>
              <Spin size="large" />
              <p>正在加载数据...</p>
            </div>
          ) : (
            <div>
              <div className="table-btn-container">
                {this.props.addData ? (
                  <div style={{ margin: '0 30px' }}>
                    <Button className="backStage editable-add-btn" onClick={this.handleAdd}>
                      增加
                    </Button>
                    <CollectionCreateForm
                      wrappedComponentRef={this.saveFormRef}
                      visible={this.state.formVisible}
                      onCancel={this.handleFormCancel}
                      onCreate={this.handleFormCreate}
                      labels={this.props.addKeys || this.props.columns}
                      extraFormDemand={this.props.extraFormDemand}
                      mapper={this.props.mapper}
                      mustInput={this.props.addKeys || this.props.columns}
                    />
                  </div>
                ) : null}
                {
                  <div style={{ margin: '0 0px' }}>
                    <Button className="backStage editable-add-btn" onClick={this.handleMultiSearch}>
                      多重筛选
                    </Button>
                    <CollectionMultiSearchForm
                      mapper={this.props.mapper}
                      wrappedComponentRef={this.saveMultiFormRef}
                      visible={this.state.multiFormVisible}
                      onCancel={this.handleMultiCancel}
                      onCreate={this.handleMultiSearchForm}
                      labels={this.state.searchCols}

                      renderSearchCell={this.renderSearchCell}
                      renderDateSearchCell={this.renderDateSearchCell}
                    />
                  </div>
                }
                {
                  this.props.detail && 
                  <CollectionDetailForm
                    mapper={this.props.mapper}
                    visible={this.state.detailVisible}
                    detail={this.props.detail}
                    detailParam={this.props.detailParam}
                    renderId2Name={this.renderId2Name}
                    detailId={this.state.detailId}
                    onCancel={()=>this.setState({detailVisible: false})}
                    onOk={()=>this.setState({detailVisible: false})}
                  />
                }
              </div>
              {
                expandable ? <Table
                  bordered={true}
                  dataSource={data}
                  columns={showCols}
                  expandedRowRender={(record) => this.renderExpandedRow(record)}
                  pagination={{ pageSize: 20, showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条， 共 ${total} 条` }}
                /> : <Table
                    bordered={true}
                    dataSource={data}
                    columns={showCols}
                    pagination={{ pageSize: 20, showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条， 共 ${total} 条` }}
                  />
              }
            </div >
          ))
    );
  }
}