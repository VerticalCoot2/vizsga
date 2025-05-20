document .addEventListener("DOMContentLoaded", function()
{
    if(localStorage.getItem("targetCalorie") == null)
    {
        let caltarget=document.getElementById("caltarget")
        caltarget.innerHTML=null
        caltarget.innerHTML="<h2>You don't have a calorie target set yet</h2>\nPlease set your data to get your target"
    }
    else if(!isNaN(localStorage.getItem("targetCalorie")))
    {
        let caltarget=document.getElementById("caltarget")
        caltarget.innerHTML=null
        caltarget.innerHTML='<h2>Your Calorie Target is: '+localStorage.getItem("targetCalorie")+'</h2>\nIf you want to change it, just set your goals and data again ;)'
    }
    $('.js-example-basic-single').select2();
    document.getElementById("terv").addEventListener("change", async function()
    {
        let youCanEat=document.getElementById("youCanEat")
        if(document.getElementById("terv").value=="Fogyas")
        {
            youCanEat.innerHTML=null
            youCanEat.innerHTML=("<h2>Foods you can eat for weight loss</h2>")
        }
        else if(document.getElementById("terv").value=="TomegMegtart")
        {
            youCanEat.innerHTML=null
            youCanEat.innerHTML=("<h2>Foods you can eat for weight maintenance</h2>")
        }
        else
        {
            youCanEat.innerHTML=null
            youCanEat.innerHTML=("<h2>Foods you can eat for weight gain</h2>")
        }
        
        build("/api/select"+ this.value, document.getElementById("sel2"));
        localStorage.setItem("plan", this.value);
        document.getElementById("hiddenAtStart").style.display = "flex";
        
    });

    let calcCalBTN = document.getElementById("CalcCalorie");

    calcCalBTN.addEventListener("click", function()
    {
        let req = document.getElementsByClassName("required");
        let i = -1;
        let kitoltve = true;
        while(i < req.length-1 && kitoltve)
        {
            i++;
            if(req[i].value == "" || req[i].value == null)
            {
                kitoltve = false;       
            }
        }
        if(kitoltve)
        {
            let weight=parseInt(document.getElementById("weight").value)
            let age=parseInt(document.getElementById("age").value)
            let height=parseInt(document.getElementById("height").value)
            FinalCalorie(document.getElementById("terv").value, TargetCalorie(weight,age,height));
            const targetCalorie = Math.round(FinalCalorie(document.getElementById("terv").value, TargetCalorie(weight,age,height)));
            //localStorage.setItem("targetCalorie", targetCalorie);
            let caltarget=document.getElementById("caltarget")
            if(weight < 20 || weight > 400 || height < 50 || height > 272 ||age > 122 || age < 0)
            {
                Swal.fire({
                    title: "Warning!",
                    text: "We need you to use real data!",
                    icon: "warning",
                    confirmButtonText: "Try Again!",
                    buttonsStyling: false, // Disable default button styling
                    customClass: {
                    popup: "styled-alert-popup", // Custom popup styling
                    title: "styled-alert-title", // Custom title styling
                    confirmButton: "styled-alert-button" // Custom button styling
                    }
                });
            }
            else if(!isNaN(targetCalorie))
            {
                Swal.fire(
                {
                    title: "Success!",
                    text: "Your Calorie Target has been saved!",
                    icon: "success",
                    confirmButtonText: "Great!",
                    buttonsStyling: false, // Disable default button styling
                    customClass: {
                    popup: "styled-alert-popup", // Custom popup styling
                    title: "styled-alert-title", // Custom title styling
                    confirmButton: "styled-alert-button" // Custom button styling
                    }
                });
                
                caltarget.innerHTML=null
                caltarget.innerHTML='<h2>Your Calorie Target is: '+targetCalorie+'</h2>'
                localStorage.setItem('targetCalorie', targetCalorie);
            }
        }
        else
        {
            Swal.fire(
            {
                title: "Missing Data!",
                text: "Fill out every element!",
                icon: "warning",
                confirmButtonText: "Try Again!",
                buttonsStyling: false, // Disable default button styling
                customClass:
                {
                    popup: "styled-alert-popup", // Custom popup styling
                    title: "styled-alert-title", // Custom title styling
                    confirmButton: "styled-alert-button" // Custom button styling
                }
            });
        }
    });

    let reqInputFields = document.getElementsByClassName("requiredFields");
    for(let i = 0; i < reqInputFields.length; i++)
    {
        reqInputFields[i].dataset.value = true;
        reqInputFields[i].addEventListener("change", function()
        {
            if(this.value != null || this.value != "")
            {
                this.dataset.value = false;
            }
            else
            {
                this.dataset.value = true;
            }
            if(reqInputFields[0].dataset.value == reqInputFields[1].dataset.value && reqInputFields[2].dataset.value == reqInputFields[1].dataset.value && reqInputFields[0].dataset.value == "false")
            {
                calcCalBTN.disabled = false;
            }
            else
            {
                calcCalBTN.disabled = true;
            }
        });
    }
});


async function build(url, target)
{
    let sel2 = document.getElementById("sel2");
    sel2.classList.add("kaja");
    target.innerHTML = null;
    let data = await fetchGET(url)
    for(let i = 0;i < data.length ;i++)
    {
    
        let Name = document.createElement("option");
            Name.classList.add("kajaText");
            Name.innerHTML = data[i].Name+", "+ data[i].Calories + "kcal" + ", " + data[i].Fat_g_ + ", " + data[i].Protein_g_ + ", " + data[i].Carbohydrate_g_ + ", " + data[i].Sugars_g_ + ", " + data[i].Fiber_g_ + ", " + data[i]._200_Calorie_Weight_g_;
            Name.value = data[i].id;
            Name.dataset.id = data[i].id;

        target.appendChild(Name);
    }
}
async function fetchGET(url)
{
    let response = fetch(url , 
    {
       method: "GET" 
    });
    return (await response).json();
}

function TargetCalorie(weight,age,height)
{
    let sex = document.getElementById("selectSex").value;
    if(sex == "Male")
    {
        return ((10*weight) + (6.25 * height) - (5 * age)) + 5;
    }
    else if(sex == "Female")
    {
        return ((10*weight) + (6.25 * height) - (5 * age)) - 161;
    }
    else
    {
        return "Choose an option!";
    }
}
//lmg = Lose, Maintain or Gain :)
function FinalCalorie(lmg,data)
{
    let activity =parseFloat(document.getElementById("dailyActivity").value);
    if(lmg == "Fogyas")
    {
        return (data * activity) -400;
    }
    else if(lmg == "TomegMegtart")
    {
        return (data * activity);
    }
    else if(lmg == "TomegNovel")
    {
        return (data * activity) + 400;
    }
    else
    {
        return "Something went wrong! :(";
    }
}