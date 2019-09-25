import React from 'react';
import { Layout, Avatar, Button } from 'antd';
import SliderMenu from '../../components/backStage/SliderMenu/index';
import _ from 'lodash';
import EditableTable from '../../components/backStage/EditableTable';
import config from '../../config';
import urls from '../../config/menu';
import { configUtils } from '../../utils';
import axios from '../../utils/axios';
import { observer } from 'mobx-react';
import state from './state';
// import '../../utils/mock'
import './index.css';

const { Header, Content, Footer, Sider } = Layout;

export default
@observer
class extends React.Component {
	state = {
		injected: false
	};

	componentDidMount() {
		console.log('browserMenu加载');
		state.setUserName(
			_.get(JSON.parse(localStorage.getItem(config.USER_INFO)), 'userName', '未登录')
		);
		this.selectOptionValues();
	}

	selectOptionValues = (backendConfig = false) => {
		// axios.get('http://10.238.131.21:8081/activity/list').then(result => console.log("result", result))
		if (backendConfig) {
			axios
				.get(config.SELECTOR_URL)
				.then((result) => {
					state.setOptionValues(result.data);
				})
				.catch((err) => {
					console.log('cant get any options', err);
				});
		} else {
			//未injected就加载
			this.state.injected ||
				this.injectOptionValues().then((result) => {
					let optionValues = {};
					result.forEach((item) => {
						Object.assign(optionValues, item);
					});
					config.optionValues = { ...config.optionValues, ...optionValues };
					state.setOptionValues(config.optionValues);
					this.setState({ injected: true });
				});
		}
	};

	injectOptionValues = () => {
		const optUrls = config.injectOptionUrls;
		return Promise.all(
			optUrls.map(
				(item) =>
					new Promise((reslove) => {
						axios.get(item.url).then((result) => {
							const ids = result.data.data;
							const data = {};
							ids.forEach((id) => (data[id] = id));
							reslove({ [item.id]: data });
						});
					})
			)
		).catch((e) => {
			//出错就加载原来的optionvalues
			state.setOptionValues(config.optionValues);
		});
	};

	signout = () => {
		this.props.auth.signout(() => {
			this.props.history.push('/login');
		});
		localStorage.removeItem(config.TOKEN_INFO);
		localStorage.removeItem(config.USER_INFO);
	};

	redirectToTable = (currentKey) => {
		state.setCurrentKey(currentKey);
		this.selectOptionValues();
	};

	currentTable = () => {
		const currentKey = _.get(state, 'currentKey', '1');
		// const optionValues = {}
		const params = urls.urls;
		return (
			params[currentKey] && (
				<EditableTable
					key={currentKey}
					{...params[currentKey]}
					addData={configUtils.hasAdd(currentKey)}
					delData={configUtils.hasDel(currentKey)}
					editData={configUtils.hasEdit(currentKey)}
				/>
			)
		);
	};

	render() {
		return (
			<Layout className="bs-container">
				<Sider>
					<SliderMenu redirectToPage={this.redirectToTable} />
				</Sider>
				<Layout className="bs-layout">
					<Header className="bs-header">
						<div className="bs-user-msg">
							<Avatar icon="user" size="middle" />
							{state.userName}
						</div>
						<Button type="primary" className="bs-logout-btn" onClick={this.signout}>
							注销
						</Button>
					</Header>
					<Content className="bs-content">{state.optionValues && this.currentTable()}</Content>
					<Footer className="bs-footer"></Footer>
				</Layout>
			</Layout>
		);
	}
}
