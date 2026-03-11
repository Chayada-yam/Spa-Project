document.addEventListener("DOMContentLoaded", () => {

const stars = document.querySelectorAll(".star")

if(stars){
stars.forEach((star,index)=>{

star.addEventListener("click",()=>{

stars.forEach(s=>s.classList.remove("active"))

for(let i=0;i<=index;i++){
stars[i].classList.add("active")
}

})

})
}

})