import $ from 'jquery';

export class ControlsBag{
	constructor(controlNames){
		this._names = [].slice.call(arguments,0);
		this.id={};
		this._cache = {};
		this._names.forEach(name=>{
			this._cache[name]={
				id: 'n_'+name,
				c:null
			};
			//init funcs
			this[name]=()=>{
				let a = this._cache[name];
				if (!a.c)
					a.c = $('#'+a.id);
				ensure(a.c!=null, `Control name=${name} not created`);
				return a.c;
			};
			this.id[name]=()=>{
				return this._cache[name].id;
			};
		});
	}
}

export function ensure(val, message){
	if (!val)
		throw new Error(message||'Logic error.');
}
