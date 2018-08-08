/*version .6*/

//const ip="localhost";
const ip="47.176.29.180";

const getXHR=(url,dataType,callback)=>{
	let xml=new XMLHttpRequest;
	xml.open("get",url);
	xml.send();
	xml.responseType=dataType;
	xml.onload=()=>callback(xml.response);
}


/*Last modified 7.2018*/
const postForm=obj=>{
	const xml=new XMLHttpRequest;
	xml.open("post",obj.url);
	xml.responseType="text";
	xml.send((obj.data));
	xml.onload=()=>{
		if(obj.callback) obj.callback(xml.response);
	}
}



const bundle=root=>{

	let partno=root.querySelector(".partno");
	let desc=root.querySelector(".desc");
	let code=root.querySelector(".code");
	let quantity=root.querySelector(".quantity");
	let price=root.querySelector(".price");
	let copybutton=root.querySelector(".copybutton");

	const transform=fragment=>{
		let output=[];
		for(let x of fragment.split("\n")){
			let array=x.split(",");
			output[array.splice(0,1)]=array;
		}
		return output;
	}

	const extendTransform=extend=>{
		
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


	const doIt=()=>{
		
		try{
			
			const r=data[code.value.replace("+","")][quantity.selectedIndex];
			if(r) price.value=r;

			else price.value="no result";
			
		}
		catch(e){
			price.value="no result";
		}

	}


	const doEx=()=>{
		const r=extendData[code.value.replace("+","")];
		if(r) price.value=r;
		else price.value="no result";
	}


	const createOptions=()=>{

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

	const setDisableRadioGroup=value=>{
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

	const generatePrice=()=>{

		const value=code.value.replace("+","");

		if(value>=101&&value<=271){
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

	const getPartObj=partno=>{
		const str=partno.replace(/ /g,"");
		const exec=/^[a-z]+/i.exec(str);
		
		if(exec) type=exec[0];
		const array=str.replace(type,"").split("-");

		return {
			TYPE:type,
			OD:array[0],
			LENGTH:array[1],
			ID:array[2]
		}
	}


	const partNoToDesc=partObj=>{
		return partObj.TYPE+" "+partObj.ID+"×"+getFraction(partObj.OD/64).replace(" ","-")+"×"+getFraction(partObj.LENGTH/16);
	}

	let detectUndefinedinObject=obj=>{
		for(let key in obj){
			if(!obj[key]) return true;
		}
	}

	partno.onkeyup=()=>{


		if(/[x×]/i.test(partno.value)) desc.value=partno.value;

		else{

			const obj=getPartObj(partno.value);
			//console.log(obj);

			if(detectUndefinedinObject(obj)){
				desc.value="no result";
				return;
			}


			desc.value=partNoToDesc(obj);

		}



		const fd=new FormData;
		fd.append("partno",partno.value.replace(/ /g,""));

		postForm({
			url:`http://${ip}:3002/query`,
			data:fd,
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



	const fd=new FormData;
	fd.append("partno",partno.replace(/ /g,""));
	fd.append("code",code);

	postForm({
		url:`http://${ip}:3002/update`,
		data:fd,
		callback:()=>{

			let node=sample.cloneNode(true);
			bundle(node);
			container.appendChild(node);

		}
	});


}

bundle(container.firstElementChild);
