let btn=document.getElementById('search');
let data=document.getElementById('in');
let users=[
    {name:'Igor',age:23},
    {name:'Ivan',age:25},
    {name:'Illya',age:20}
]
//task 3,4,5
btn.addEventListener('click',t1);
function t1(e){
    if(data.value=='google'){
        alert('Yandex круче, но это неточно ')
        
    
    }
    else{alert(data.value);}
    alert(users[0].name)
   
    
}
//task 6
function superSum(num1,num2){
    let res=num1+num2;
    alert(res);
}
superSum(10,5)

//task 7
function t2(arr){
  
    for(let i=0;i<arr.length;i++){
        arr.sort( (a,b)=>a-b)
    }
   console.log(arr[0]);
   console.log(arr[arr.length-1])
   console.log(arr)

}
t2([5,6,8,4,2,0,15,9])

//task8
let a=12;
let b=10;
[a,b]= [b,a];

console.log('b = '+ b);
console.log('a = '+ a);

//task9
function findMax(numbers){
    console.log(Math.max.apply(null,numbers))
}
findMax([1,8,5,6]);

//task10
btn.addEventListener('click',t4)
function t4(){
    if(data.value=='yandex'){
        setTimeout(function times() {
            alert('good choice')
        }, 3000); 
    }
}
t4()
