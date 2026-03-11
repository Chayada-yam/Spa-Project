let stars=document.querySelectorAll(".star")

stars.forEach((s,i)=>{

s.addEventListener("click",()=>{

stars.forEach(st=>st.classList.remove("active"))

for(let j=0;j<=i;j++){
stars[j].classList.add("active")
}

})

})