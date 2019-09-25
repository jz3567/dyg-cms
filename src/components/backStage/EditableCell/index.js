import React from 'react';
import { Input, Icon, DatePicker, Modal, Select } from 'antd';
import Popover from '../popover';
import moment from 'moment';
import PicturesWall from '../PicturesWall';
import { configUtils } from '../../../utils';
import _ from 'lodash';
import editorModalState from '../EditorModal/state';
import EditorModal from '../EditorModal';
import backStageState from '../../../pages/backStage/state';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import './cell.css';
import '../style/table.css';
import config from '../../../config';

export default
@observer
class extends React.Component {
	@observable value = '';
	@observable column = '';
	@observable preValue = '';
	@observable keyValue = '';

	@observable editable = false;
	@observable condition = {};
	@observable extraOptionValue = {};

	@action setValue = (value) => (this.value = value);
	@action setColumn = (column) => (this.column = column);
	@action setPreValue = (preValue) => (this.preValue = preValue);
	@action setKeyValue = (keyValue) => (this.keyValue = keyValue);

	@action setEditable = (editable) => (this.editable = editable);
	@action setCondition = (condition) => (this.condition = condition);
	@action setExtraOptionValue = (extraOptionValue) => (this.extraOptionValue = extraOptionValue);

	componentDidMount() {
		this.initState();
	}

	initState = () => {
		this.setValue(this.props.value);
		this.setColumn(this.props.column);
		this.setPreValue(this.props.preValue);
		// keyvalue不需要初始化
		// this.setKeyValue(this.props.keyValue)
	};

	handleChange = (e) => this.setValue(e.target.value);

	handleChangeSelect = (data, column) => {
		const optionValues = backStageState.optionValues;
		const optionsValue = optionValues[column];
		const value = data in optionsValue ? optionsValue[data] : data;
		this.setValue(value);
		this.setKeyValue(data);
	};

	handleChangeData = (_, dateString) => this.setValue(dateString);

	check = () => {
		this.setEditable(false);
		if (!this.value) {
			Modal.warning({
				content: '修改值不能为空！（您可以尝试一下添加空格）'
			});
			this.setValue(this.preValue);
			return;
		}
		if (this.props.onChange) {
			const value = this.keyValue || this.value;
			const self = this;
			this.props.onChange(
				value,
				() => self.setPreValue(self.value),
				() => self.setValue(self.preValue)
			);
		}
	};

	cancel = () => {
		this.setEditable(false);
		this.setValue(this.preValue);
	};

	edit = (_, column, value) => {
		// 目前仅是editorModal
		configUtils.isModal(column) && editorModalState.setVisible(true);
		this.setPreValue(value);
		this.setEditable(true);
	};

	renderId2Value = (text, column, condition) =>
		this.props.renderId2Value(text, column, condition, true);

	getImgUrl = (img) => {
		img instanceof Object && this.setValue(img.props.src);
	};

	getVidUrl = (videoUrl) => this.setValue(videoUrl);

	renderEditComponents = (column, value, keyValue, optionsValue) => {
		return configUtils.isSelector(column) ? (
			<Select
				showSearch
				style={{ width: '120px' }}
				placeholder={value}
				optionFilterProp="children"
				onChange={(data) => this.handleChangeSelect(data, column)}
				filterOption={(input, option) =>
					option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				defaultValue={configUtils.isNumber(keyValue) ? undefined : keyValue}
				mode={''}
			>
				{Object.keys(optionsValue).map((val, i) => {
					return (
						<Select.Option key={i} value={val}>
							{optionsValue[val]}
						</Select.Option>
					);
				})}
			</Select>
		) : configUtils.isDate(column) ? (
			<DatePicker
				value={moment(value)}
				onChange={this.handleChangeData}
				showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}
				format="YYYY-MM-DD HH:mm:ss"
				allowClear={false}
			/>
		) : configUtils.isPhoto(column) ? (
			<PicturesWall imgUrl={toJS(value)} getImgUrl={this.getImgUrl} />
		) : configUtils.isModal(column) ? (
			<EditorModal
				col={column}
				value={value}
				setInputValue={(v) => this.setValue(v)}
				setEditable={this.setEditable}
				renderId2Value={this.renderId2Value}
			/>
		) : (
			<Input allowClear value={value} onChange={this.handleChange} onPressEnter={this.check} />
		);
	};

	judgeEdit = (column, value) => {
		const edit = (
			<Icon
				type="edit"
				className="editable-cell-icon"
				onClick={(e) => this.edit(e, column, value)}
			/>
		);
		const fixedColumns = this.props.fixedColumns || [];

		//⬇️特殊情况：status单独处理
		if (column === 'status' && value !== '未上线') {
			return null;
		}
		// 有优先级
		if (fixedColumns.includes(column)) {
			return null;
		} else if (this.props.editData) {
			return edit;
		} else {
			return null;
		}
	};

	render() {
		const optionValues = backStageState.optionValues;
		const { value, editable, column, keyValue, condition } = this;
		const optionsValue =
			Object.keys(condition).length !== 0 ? optionValues[condition] : optionValues[column];
		return (
			<div className="editable-cell">
				{this.props.editData && editable ? (
					<div className="editable-cell-input-wrapper">
						<div className="editable-cell-text-span">
							{this.renderEditComponents(column, value, keyValue, optionsValue, optionValues)}
						</div>
						<div style={{ display: 'flex' }}>
							<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
							<Icon type="close" style={{ marginLeft: '20px' }} onClick={this.cancel} />
						</div>
					</div>
				) : (
					<div className="editable-cell-text-wrapper">
						<div className="editable-cell-text-span">
							{configUtils.isShrink(column) || configUtils.isPhoto(column) ? (
								<Popover
									placement="right"
									overlayStyle={{ width: '250px' }}
									content={
										configUtils.isPhoto(column)
											? `<img src=${value} style="width: 200px; height: 200px" />`
											: value
									}
									title={configUtils.getColNameByMapper(column, this.props.mapper)}
								>
									{configUtils.isPhoto(column) ? (
										<img src={value} style={{ width: '100px', height: '100px' }} />
									) : (
										value || ' '
									)}
								</Popover>
							) : _.isNil(this.renderId2Value(value, column, column)) ? (
								''
							) : (
								this.renderId2Value(value, column, column)
							)}
						</div>
						{this.judgeEdit(column, value)}
					</div>
				)}
			</div>
		);
	}
}
