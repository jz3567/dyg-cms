import React from 'react';
import './login.css';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import auth from './auth';
import NoMatch from '../NoMatch';
import BackStage from '../backStage';
import WrappedNormalLoginForm from './loginForm';

export class AuthRoute extends React.Component {
	render() {
		return (
			<Router history={this.props.history}>
				<Switch>
					<Route exact path="/login" component={WrappedNormalLoginForm} />
					{/* <PrivateRoute path='/backStage' component={BackStage} /> */}
					<Route path="/backStage" component={BackStage} />
					<Route component={NoMatch} />
				</Switch>
			</Router>
		);
	}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			auth.isAuthenticated ? (
				<Component {...props} auth={auth} />
			) : (
				<Redirect
					to={{
						pathname: '/login',
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);
