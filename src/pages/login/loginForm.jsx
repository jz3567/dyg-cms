import React from 'react';
import './login.css';
import { Redirect } from 'react-router-dom';

import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import auth from './auth';
import logo from '../../assets/logo.svg';
import { configUtils } from '../../utils';
import axios from '../../utils/axios';
import config from '../../config';
import _ from 'lodash';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
	state = {
		redirectToReferrer: false,
		loading: false,
		storedUserInfo: localStorage.getItem(config.USER_INFO)
	};

	componentDidMount() {
		const userInfo = this.state.storedUserInfo;
		userInfo &&
			this.setState({
				storedUserInfo: JSON.parse(this.state.storedUserInfo)
			});
		//isValidToken 验证是否过期
		const isValidToken = (token) => token;
		isValidToken(configUtils.token_info()) &&
			userInfo &&
			this.login(JSON.parse(this.state.storedUserInfo));
	}

	login = (user) => {
		auth.setUser(user.userName);
		auth.authenticate(() => {
			this.setState({ redirectToReferrer: true });
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				const userErrorMessage = err.userName ? '请输入用户名！\n' : '';
				const pwdErrorMessage = err.password ? '请输入密码！' : '';
				Modal.error({
					content: userErrorMessage + pwdErrorMessage
				});
				return;
			}
			//验证成功后跳转
			//if(成功)
			const user = {
				userName: this.props.form.getFieldsValue().userName || 'admin',
				password: this.props.form.getFieldsValue().password || ''
			};
			this.setState({ loading: true });

			// setTimeout(() => {
			//   this.setState({
			//     loading: false,
			//   });
			//   this.login(user);
			//   console.log(localStorage.getItem("user"), "BEFORE USER?")
			//   localStorage.setItem('user', JSON.stringify(user));
			//   console.log(localStorage.getItem("user"), "USER?")
			// }, 1000);

			axios
				.post(config.LOGIN_API_URL + '/login', user)
				.then((result) => {
					let data = result.data || '';
					if (_.get(data, 'status', '') === '200') {
						data.token &&
							localStorage.setItem(config.TOKEN_INFO, JSON.stringify(_.get(data, 'token', '')));
						values.remember
							? localStorage.setItem(config.USER_INFO, JSON.stringify({ userName: user.userName }))
							: localStorage.removeItem(config.USER_INFO);
						this.setState({
							loading: false
						});
						this.login(user);
					} else if (_.get(data, 'status', '') === '400') {
						this.setState(
							{
								loading: false
							},
							() => {
								Modal.warning({
									content: '请检查账号或密码是否输入正确！'
								});
							}
						);
					}
				})
				.catch((err) => {
					Modal.warning({
						content:
							err.status == 0
								? '请检查网络！'
								: err.status == 400
								? '请检查账号或密码是否输入正确！'
								: '发生意外错误！'
					});
					this.setState({
						loading: false
					});
				});
		});
	};
	render() {
		const { from } = this.props.location.state || { from: { pathname: '/backStage' } };
		const { redirectToReferrer, loading } = this.state;
		if (redirectToReferrer) {
			return <Redirect to={from} />;
		}
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="main-container">
				<div className="main-center">
					<p className="login-form-head"></p>
					<div className="content">
						<div className="top">
							<div className="header">
								<img alt="logo" className="login-logo" src={logo} />
								<span className="title">MI</span>
							</div>
							<div className="desc">三元购--后台管理系统</div>
						</div>
						<Form onSubmit={this.handleSubmit} className="login-form">
							<FormItem>
								{getFieldDecorator('userName', {
									rules: [{ required: true, message: '请输入用户名！' }],
									initialValue: this.state.storedUserInfo && this.state.storedUserInfo.userName
								})(
									<Input
										prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
										placeholder="用户名"
									/>
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入密码！' }],
									initialValue: this.state.storedUserInfo && this.state.storedUserInfo.password
								})(
									<Input
										prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
										type="password"
										placeholder="密码"
									/>
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true
								})(<Checkbox>记住账号</Checkbox>)}
								<Button
									type="primary"
									htmlType="submit"
									className="login-form-button"
									loading={loading}
								>
									登录
								</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
