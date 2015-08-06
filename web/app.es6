import $ from 'jquery';
import {ControlsBag} from './utils';

export class App {
	constructor(){
		this._c = new ControlsBag(
			'last','result','linkOsm','linkStyles',
			'log','duration','task','settings',
			'buttonSaveFields','fieldsAdd','fieldsRemove');
		this._subscribe();
	}

	start(){
		this._updateState();
	}

	_updateState(){
		let h = this._hash();
		console.log('state=',h);

		if (h == 'settings') {//do nothing
			this._showSettings();
			return;
		}

		$.ajax('http://localhost:9001/api/tasks/'+h)
		.done(task => this._showTask(task))
		.fail((jqxhr,err)=> {
			alert( "error" + err );
		});
	}

	_hash(){
		let h = window.location.hash;
		return h.replace(/^#/,'');
	}

	_showTask(task){
		let c = this._c;
		c.settings().hide();
		c.task().show();

		c.last().text(new Date(task.start));
		c.result().text(task.result);
		c.duration().text(task.duration);
		c.log().text(JSON.stringify(task.log,null,2));
	}

	_showSettings(){
		let c = this._c;
		c.settings().show();
		c.task().hide();

		$.ajax('http://localhost:9001/api/settings/fields')
			.done(fields =>{
				if (fields.addFields)
					c.fieldsAdd().val(fields.addFields);
				if (fields.removeFields)
					c.fieldsRemove().val(fields.removeFields);
			})
			.fail((jqxhr,err)=> {
				alert( "error" + err );
			});
	}

	_saveFields_click(e){
		e.preventDefault();
		let c= this._c;
		let obj = {
			addFields: c.fieldsAdd().val(),
			removeFields: c.fieldsRemove().val()
		};

		$.ajax({url:'http://localhost:9001/api/settings/fields', method:'POST', data: obj })
			.done(fields =>{
				if (fields.addFields)
					c.fieldsAdd().val(fields.addFields);
				if (fields.removeFields)
					c.fieldsRemove().val(fields.removeFields);
			})
			.fail((jqxhr,err)=> {

				alert( "error" + err );
			});
	}

	_subscribe(){
		$(window).bind('hashchange',()=>this._updateState());

		this._c.buttonSaveFields().bind('click',this._saveFields_click.bind(this));

	}
}