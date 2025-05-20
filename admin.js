document.addEventListener("DOMContentLoaded", function()
{
    TablaGeneral(document.getElementById("tablazat"))
})


async function TablaGeneral(hova){
    hova.innerHTML=null;
    let tabla =document.createElement("table")
    tabla.classList.add("table")
    tabla.classList.add("table-striped")
    tabla.classList.add("table-dark")
    //Fejléc készítése
    let thead = document.createElement("thead")
    thead.classList.add("thead-dark")
    let theadtr = document.createElement("tr")
    theadtr.innerHTML="<th>Name</th><th>Calories</th><th>Fat_g_</th><th>Protein_g_</th><th>Carbohydrate_g_</th><th>Sugars_g_</th><th>Fiber_g_</th><th>_200_Calorie_Weight_g_</th><th>Delete</th><th>Insert</th>"
    thead.appendChild(theadtr)
    tabla.appendChild(thead)
    hova.appendChild(tabla)
    let data = await SelectAllAdmin()
    let test = document.createElement("tbody")
    for(let i=0;i<data.length;i++)
    {
        let sor = document.createElement("tr")
        sor.dataset.id=data[i].id
        //Name
        let name =document.createElement("td")
        let Name=document.createElement("input")
        Name.type="text"
        Name.value=data[i].Name
        name.appendChild(Name)

        //Calories
        let cal = document.createElement("td")
        let Calories=document.createElement("input")
        Calories.type="number"
        Calories.value=data[i].Calories
        cal.appendChild(Calories)

        //Fat_g
        let fatg = document.createElement("td")
        let Fat_g_=document.createElement("input")
        Fat_g_.type="number"
        Fat_g_.value=data[i].Fat_g_
        fatg.appendChild(Fat_g_)

        //Protein_g_
        let prog = document.createElement("td")
        let Protein_g_=document.createElement("input")
        Protein_g_.type="number"
        Protein_g_.value=data[i].Protein_g_
        prog.appendChild(Protein_g_)

        //Caghydrate_g_
        let carbg = document.createElement("td")
        let Carbohydrate_g_=document.createElement("input")
        Carbohydrate_g_.type="number"
        Carbohydrate_g_.value=data[i].Carbohydrate_g_
        carbg.appendChild(Carbohydrate_g_)

        //Sugars_g_
        let sugg = document.createElement("td")
        let Sugars_g_=document.createElement("input")
        Sugars_g_.type="number"
        Sugars_g_.value=data[i].Sugars_g_
        sugg.appendChild(Sugars_g_)

        //Fiber_g_
        let fibg = document.createElement("td")
        let Fiber_g_=document.createElement("input")
        Fiber_g_.type="number"
        Fiber_g_.value=data[i].Fiber_g_
        fibg.appendChild(Fiber_g_)

        //_200_Calorie_Weight_g_
        let cwg= document.createElement("td")
        let _200_Calorie_Weight_g_=document.createElement("input")
        _200_Calorie_Weight_g_.type="number"
        _200_Calorie_Weight_g_.value=data[i]._200_Calorie_Weight_g_
        cwg.appendChild(_200_Calorie_Weight_g_)

        //Töröl gomb
        let del = document.createElement("td")
        let delbut = document.createElement("button")
        delbut.type="button"
        delbut.dataset.id=data[i].id
        delbut.innerHTML="Delete"
        delbut.addEventListener("click",function(){
            admindel(this.dataset.id)
        })
        del.appendChild(delbut)

        //Insert gomb
        let ins = document.createElement("td")
        let insbut = document.createElement("button")
        insbut.type="button"
        insbut.dataset.id=data[i].id
        insbut.innerHTML="Insert"
        insbut.addEventListener("click",function(){
            let formdata= new FormData()
            formdata.append("Name",Name.value)
            formdata.append("Calories",Calories.value)
            formdata.append("Fat_g_",Fat_g_.value)
            formdata.append("Protein_g_",Protein_g_.value)
            formdata.append("Carbohydrate_g_",Carbohydrate_g_.value)
            formdata.append("Sugars_g_",Sugars_g_.value)
            formdata.append("Fiber_g_",Fiber_g_.value)
            formdata.append("_200_Calorie_Weight_g_",_200_Calorie_Weight_g_.value)
            adminins(formdata)
            admindel(this.dataset.id)
        })
        ins.appendChild(insbut)

        sor.appendChild(name)
        sor.appendChild(cal)
        sor.appendChild(fatg)
        sor.appendChild(prog)
        sor.appendChild(carbg)
        sor.appendChild(sugg)
        sor.appendChild(fibg)
        sor.appendChild(cwg)
        sor.appendChild(del)
        sor.appendChild(ins)
        test.appendChild(sor)
    }
    tabla.appendChild(test)
}

async function SelectAllAdmin()
{
    let response = fetch("/api/selectAllAdmin",{
        method: "GET"
    })
    return (await response).json();
}

async function admindel(azon)
{
    let response = fetch("/api/adminDel/"+azon,{
        method: "POST"
    })
    TablaGeneral(document.getElementById("tablazat"))
    return(await response).json()
}

async function adminins(formdata)
{
    let response=fetch("/api/insertEtel",{
        method: "POST",
        body: formdata
    })
    TablaGeneral(document.getElementById("tablazat"))
    return (await response).json()
}