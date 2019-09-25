import { observable, action } from 'mobx';

class State {
	@observable currentKey = '1';
	@observable optionValues = '';
	@observable userName = '';

	@action setCurrentKey = (currentKey) => {
		this.currentKey = currentKey;
	};
	@action setOptionValues = (optValues) => {
		this.optionValues = optValues;
	};
	@action setUserName = (userName) => {
		this.userName = userName;
	};
}

export default new State();
