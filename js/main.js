/*version .5*/

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
		let r=data[code.value][document.querySelector("input[name='options']:checked").dataset.index];
		if(r) price.value=r;

		else price.value="no result"
		
	}
	catch(e){
		price.value="no result";
	}

}


let doEx=()=>{
	let r=extendData[code.value];
	if(r) price.value=r;
	else price.value="no result"
}


let createOptions=()=>{

	let sample=document.querySelector(".tocopy .sample");

	options.forEach((x,i)=>{

		let ch=sample.cloneNode(true);
		let label=ch.querySelector("label");
		let input=ch.querySelector("input");

		label.setAttribute("for",x);
		label.innerText=input.id=x;
		input.dataset.index=i;
		input.disabled=true;

		ch.onclick=()=>{
			input.click();
			doIt();
		}

		container.appendChild(ch);

	});

}

createOptions();


let setDisable=value=>{
	for(let x of container.querySelectorAll("input")){
		x.disabled=value;
	}

	let color;
	if(value) color="#ccc";
	else color="black";

	for(let x of container.querySelectorAll("label")){
		x.style.setProperty("color",color);
	}

}


code.onkeyup=()=>{

	if(code.value>=101&&code.value<=271){
		setDisable(false);
		doIt();
	}


	else{
		setDisable(true);
		doEx();

	}
}


copybutton.onclick=()=>{
	let text=copybutton.innerText;
	copybutton.innerText="Copied!";
	setTimeout(()=>copybutton.innerText=text,2000);
}

code.focus();
code.onclick=()=>code.select();