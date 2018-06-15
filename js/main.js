/*version .6*/

const getXHR=(url,dataType,callback)=>{
	let xml=new XMLHttpRequest;
	xml.open("get",url);
	xml.send();
	xml.responseType=dataType;
	xml.onload=()=>callback(xml.response);
}

const getFormData=data=>{
	var param="";
	var count=0;
	for(var k in data){
		var value=data[k];
		if(count++) k="&"+k;
		param+=k+"="+value;
	}
	count=0;
	return param;
}

const postXhr=obj=>{
	var xml=new XMLHttpRequest;
	xml.open("post",obj.url);
	xml.setRequestHeader("content-type","application/x-www-form-urlencoded");
	xml.responseType="text";
	xml.send(getFormData(obj.data));
	xml.onload=function(){
		obj.callback(this.response);
	}
}

let bundle=root=>{

	let partno=root.querySelector(".partno");
	let desc=root.querySelector(".desc");
	let code=root.querySelector(".code");
	let quantity=root.querySelector(".quantity");
	let price=root.querySelector(".price");
	let copybutton=root.querySelector(".copybutton");

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
			//let r=data[code.value][document.querySelector("input[name='options']:checked").dataset.index];
			
			let r=data[code.value][quantity.selectedIndex];
			if(r) price.value=r;

			else price.value="no result";
			
		}
		catch(e){
			price.value="no result";
		}

	}


	let doEx=()=>{
		let r=extendData[code.value];
		if(r) price.value=r;
		else price.value="no result";
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

	let setDisableRadioGroup=value=>{
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

	let setDisabledSelectGroup=boolean=>{
		quantity.disabled=boolean;
	}

	let generatePrice=()=>{
		if(code.value>=101&&code.value<=271){
			setDisabledSelectGroup(false);
			doIt();
		}

		else{
			setDisabledSelectGroup(true);
			doEx();

		}
	}


	code.onkeyup=generatePrice;

	quantity.onchange=()=>{
		doIt();
	}


	copybutton.onclick=()=>{
		let text=copybutton.innerText;
		copybutton.innerText="Copied!";
		setTimeout(()=>copybutton.innerText=text,2000);
	}

	partno.focus();



	for (let x of root.querySelectorAll("input")){
		x.onclick=()=>x.select();
	}


	let getFraction=decimal=>{
		return (new Fraction(decimal)).toFraction(true);
	}


	let getPartObj=partno=>{
		let str=partno.replace(/ /g,"");
		let array=str.substr(1).split("-");
		return {
			TYPE:str[0],
			OD:array[0],
			LENGTH:array[1],
			ID:array[2]
		}
	}

	let partNoToDesc=partObj=>{
		return partObj.TYPE+" "+partObj.ID+"×"+getFraction(partObj.OD/64).replace(" ","-")+"×"+getFraction(partObj.LENGTH/16);
	}

	let detectUndifinedinObject=obj=>{
		for(let key in obj){
			if(!obj[key]) return true;
		}
	}

	partno.onkeyup=()=>{

		let obj=getPartObj(partno.value);
		//console.log(obj);

		if(detectUndifinedinObject(obj)){
			desc.value="no result";
			return;
		}

		desc.value=partNoToDesc(obj);


		postXhr({
			url:"http://localhost:3002/query",
			data:{
				partno:partno.value.replace(/ /g,"")
			},
			callback:r=>{
				code.value=r;
				generatePrice();
			}
		});

	}

	copybutton.addEventListener("click", function() {
	    copyToClipboard(price);
	});

}

let sample=container.firstElementChild.cloneNode(true);


add.onclick=()=>{
	
	let partno=container.lastElementChild.querySelector(".partno").value;
	let code=container.lastElementChild.querySelector(".code").value;


	if(partno==""||code=="") return;

	postXhr({
		url:"http://localhost:3002/update",
		data:{
			partno:partno.replace(/ /g,""),
			code:code
		},
		callback:()=>{

			let node=sample.cloneNode(true);
			bundle(node);
			container.appendChild(node);

		}
	});


}

bundle(container.firstElementChild);
