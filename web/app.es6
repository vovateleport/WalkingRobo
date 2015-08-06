import $ from 'jquery';

export class App {
	constructor(){
		this._subscribe();
	}

	start(){
		this._updateState();
	}

	_updateState(){
		let h = window.location.hash;
		console.log('state=',h);

	}

	_subscribe(){
		$(window).bind('hashchange',()=>this._updateState())
	}
}