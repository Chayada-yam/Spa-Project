function checkPassword(){

let p=document.getElementById("pass").value
let c=document.getElementById("confirm").value

if(p.length!=6){

alert("รหัสต้อง6ตัว")

return false

}

if(p!==c){

alert("รหัสผ่านไม่ตรงกัน")

return false

}

return true

}