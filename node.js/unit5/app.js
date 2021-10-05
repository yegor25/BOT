const arg=process.argv;
//console.log(arg[2]);
const a=+arg[2];
const b=+arg[3];
console.log(typeof a)
if(a>b) {
    console.log(a);
}
    else{
        console.log(b);
    }
    let d=[1,5,7];
   let e= d.map(elem=>{
        return elem*3;
    })
console.log(e);
