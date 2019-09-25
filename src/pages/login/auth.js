class Auth {
	isAuthenticated = false;
	userName = '';

	authenticate = (cb) => {
		this.isAuthenticated = true;
		setTimeout(cb, 100); // fake async
	};
	signout = (cb) => {
		this.isAuthenticated = false;
		setTimeout(cb, 100);
	};
	setUser = (userName) => {
		this.userName = userName;
	};
}

export default new Auth();
