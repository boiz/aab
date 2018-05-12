let transform=fragment=>{
	let output=[];
	for(let x of fragment.split("\n")){
		let array=x.split(",");
		output[array.splice(0,1)]=array;
	}
	return output;
}


let extendTransform=extend=>{
	
	let array=[];
	let output=[];

	for(let x of extend.split(",,")){
		if(x){
			let item=x.split(",\n");
			array.push(item[0]);
			if(item[1]) array.push(item[1]);
		}
	}

	for(let x of array){
		let item=x.split(",");
		output[item[0]]=item[1]
	}

	return output;

}


let data=transform(fragment);
let extendData=extendTransform(extend);

let doIt=()=>{

	try{
		let r=data[code.value][option.selectedIndex];
		if(r) price.value=r;
		else price.value="no result"
		
	}
	catch(e){
		price.value="no result";
	}

}

let createOptions=()=>{
	for(let x of options){
		let label=document.createElement("label");
		label.setAttribute("for",x);
		label.innerText=x;
		let input=document.createElement("input");
		input.id=x;
		input.type="radio";
		input.name="options";
		container.appendChild(label);
		container.appendChild(input);
	}

}

createOptions();

code.onkeyup=()=>{
	doIt();
}

