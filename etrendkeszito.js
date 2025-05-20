let SavedNotEatenFoods = localStorage.getItem("savedFoods");
let SavedEatenFoods = localStorage.getItem("savedEatenFoods");
let plan = localStorage.getItem("plan");;
let dailyCalories = 1500;
document.addEventListener("DOMContentLoaded", function()
{
    
    if(SavedNotEatenFoods!=null)
    {
        
        let data = JSON.parse(SavedNotEatenFoods);
        if(data != [])
        {
            for(let i = 0; i < data.length; i++)
            {
                cardGen(data[i], document.getElementById("Fede"));
            }
        }        
    }

    if(SavedEatenFoods!=null)
    {
        let data = JSON.parse(SavedEatenFoods);
        if(data != [])
        {
            for(let i = 0; i < data.length; i++)
            {
                cardGen(data[i], document.getElementById("mindmegette"));
            }
        }        
    }
    
    listVisibilityCheck(document.getElementById("Fede"));
    listVisibilityCheck(document.getElementById("mindmegette"));
    if(plan != null && plan != "")
    {
        build(document.getElementById("sel2"), true);
    }
    else
    {
        Swal.fire({
            title: "Oh no!",
            text: "You havent selected a plan on the Calc-your-cals site",
            icon: "warning",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
        });
        build(document.getElementById("sel2"), false);
    }

    $('.js-example-basic-single').select2();

    document.getElementById("addBTN").addEventListener("click", async function()
    {
        let selectedID = document.getElementById("sel2").value;
        let selectData = (await SelectID(selectedID))[0];
        let data =
        {
            Name: selectData.Name,
            foodDATA:
            {
                "Calories": selectData.Calories,
                "Fat(g)": selectData.Fat_g_,
                "Protein(g)": selectData.Protein_g_,
                "Carbohydrate(g)": selectData.Carbohydrate_g_,
                "Sugars(g)": selectData.Sugars_g_,
                "Fiber(g)": selectData.Fiber_g_,
                "200 Calorie/Weight(g)": selectData._200_Calorie_Weight_g_,
                "help": selectData._200_Calorie_Weight_g_,
            },
            "vol" : Math.round(((parseFloat(selectData.Calories)*parseFloat(selectData._200_Calorie_Weight_g_))/200) *100)/100,
            "id": selectData.id,
            "dine": selectData.dine,
            "amountG": 100
        };
        cardGen(data, document.getElementById("Fede"));
        listVisibilityCheck(document.getElementById("Fede"));
        saveTOlocalStorage(document.getElementById("Fede"), "savedFoods");
    });

    document.getElementById("biscuitDelete").addEventListener("click", function()
    {
        localStorage.setItem("savedFoods", "[]");
        ClearContent(document.getElementById("Fede"));
    });

    document.getElementById("calcDailyCalcs").addEventListener("click", function()
    {
        holder = document.getElementById("mindmegette");
        if(holder.childElementCount > 0)
        {
            localStorage.setItem("savedEatenFoods", "[]");
            osszAdat();
            checkCaloriePlan();
            ClearContent(holder);
        }
        else
        {
            Swal.fire({
                title: "Oh no!",
                text: "You did not eat anything!",
                icon: "warning",
                confirmButtonText: "Close",
                buttonsStyling: false, // Disable default button styling
                customClass: {
                  popup: "upload-alert-popup", // Custom popup styling
                  title: "upload-alert-title", // Custom title styling
                  confirmButton: "upload-alert-button" // Custom button styling
                }
            });
        }
    });

    document.getElementById("fyhe").innerHTML = "Foods you have eaten: " + document.getElementById("mindmegette").childElementCount;
    if(!isNaN(getSavedCal()))
    {
        document.getElementById("target").innerHTML=null
        document.getElementById("target").innerHTML = "Target calorie: " + getSavedCal()
    }
    document.getElementById("allCals").innerHTML =  " SUM of the calories: " + EatenCalsSUM();
    
});

function saveTOlocalStorage(cardHolder, location)
{
    let savedFoods = [];
    for(let i = 0; i < cardHolder.childElementCount; i++)
    {
        savedFoods.push(JSON.parse(cardHolder.children[i].dataset.adatk))
    }
    localStorage.setItem(location, JSON.stringify(savedFoods));
    
    listVisibilityCheck(cardHolder);
}

async function SelectID(id)
{
    let response = fetch("/api/selectID?id=" + id,
    {
        method : "GET"
    });
    return (await response).json();
}




function EatenCalsSUM()
{
    holder = document.getElementById("mindmegette");
    if(holder.innerHTML != null)
    {
        let caloiesSUM = 0;
        for(let i = 0; i < holder.childElementCount; i++)
        {
            caloiesSUM += JSON.parse(holder.children[i].dataset.adatk).foodDATA.Calories;
        }
        return parseInt(caloiesSUM);
    }
    return "You haven't ate anything today";
}


function osszAdat() {
    const holder = document.getElementById("mindmegette");
    console.log(document.getElementById("mindmegette"));
    if (!holder || holder.innerHTML.trim() === "") {
        Swal.fire({
            title: "Oh no!",
            text: "You haven't eaten anything today!",
            icon: "warning",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
        });
        return;
    }

    let letoltendo = [];

    for (let i = 0; i < holder.childElementCount; i++) {
        const data = JSON.parse(holder.children[i].dataset.adatk);
        delete data.vol;
        delete data.id;
        try
        {
            let foodDaty = [];
            let tempString="";
            for(key in data.foodDATA)
            {
                console.log(key)
                if(key != "help" && key != "200 Calorie/Weight(g)" )
                {
                    // tempString+="\""+key + ": " + data.foodDATA[key]+"\";"
                    // foodDaty.push(key + ": " + data.foodDATA[key]);
                    data[key] = data.foodDATA[key];
                    if(key == "Fiber(g)")
                    {
                        console.log(data.foodDATA[key]);
                    }
                }
            }
            const today = new Date();

            const year = today.getFullYear();      // Aktuális év
            const month = today.getMonth() + 1;    // Aktuális hónap (0-tól indul, ezért +1)
            const day = today.getDate();           // Aktuális nap

            data["Date"] = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            delete data.foodDATA;
            // console.log(foodDaty);
            // data.foodDATA = tempString;
            // console.log(data);
            letoltendo.push(data);
        } catch (err) {
            console.error("Invalid JSON in dataset.adatk", err);
        }
    }

    if (letoltendo.length === 0) {
        Swal.fire({
            title: "Oh no!",
            text: "No valid data to export.",
            icon: "warning",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
        });
        return;
    }

    // Convert to CSV
    const keys = Object.keys(letoltendo[0]);
    const csvRows = [keys.join(";")]; // header row

    for (const row of letoltendo) {
        const values = keys.map(k => `"${(row[k] || "").toString().replace(/"/g, '""')}"`);
        csvRows.push(values.join(";"));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "food_log.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getSavedCal()
{
    try
    {
        return parseFloat(localStorage.getItem("targetCalorie"));
    }
    catch
    {
        Swal.fire({
            title: "No data!",
            icon: "alert",
            confirmButtonText: "Got it!",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
          });
    }
}


function checkCaloriePlan()
{
    let digestedCalories = EatenCalsSUM();
    let tC = parseFloat(getSavedCal());
    let beszolasok = [["You're so skinny, you could hula hoop with a Cheerio.","You turn sideways and disappear.","If you walked into a spider web, you’d get tied up.","You're the only person who can use floss as a belt.","You're not skinny – you're basically a line of code.",        "You have to run around in the shower to get wet.",        "Even your shadow looks underweight.",        "You're the reason hangers feel insecure.",        "You fall through cracks in the sidewalk.",        "You could dodge raindrops.",        "You wear spaghetti straps and they look like trench coats.",        "You're the only one who can tightrope walk on a phone cable.",        "If a breeze hits, you end up in the neighbor’s yard.",        "You hide behind lampposts... and vanish.",        "You're the first to get taken by a balloon.",        "You sneeze and fly across the room.",        "Your ribs have their own zip code.",        "You're the stick figure in every diagram.",        "You're the 'before' photo for protein powder.",        "You use a paperclip for a belt buckle.",        "A twig once tried to date you.",        "You're so thin, you could sword fight with a toothpick.",        "Your whole outfit fits in a sandwich bag.",        "You once wore a ring as a bracelet.",        "Your bones echo when you walk.",        "You get lost in your own clothes.",        "You once bench-pressed a cotton ball and pulled something.",        "You do pushups and float.",        "Even your jeans skip leg day.",        "Your profile picture is literally your profile.",        "You turn sideways and become invisible.",        "You're the reason 'low-fat' has a face.",        "You blend in with fence posts.",        "You're a strong gust away from Narnia.",        "You're built like a question mark without the dot.",        "Your shadow is jealous of your mass.",        "You sit on air – no chair needed.",        "You once got mistaken for a mic stand.",        "You skip meals and vanish.",        "You climb stairs and they say, 'Where’d you go?'",        "You're a scarecrow’s role model.",        "Your hugs feel like pipe cleaners.",        "You once hid behind a pencil.",        "You wear chapstick like foundation.",        "Your collarbones have collarbones.",        "You wear shoelaces as scarves.",        "Your blood type is 'transparent'.",        "You use a Q-tip for a walking stick.",        "You're too small for x-rays to detect.",        "A shirt button once outweighed you.",        "Your Halloween costume is always ‘skeleton’.",      ], [        "You're the reason the fridge has a panic button.",        "When you step on a scale, it says 'To be continued...'",        "NASA mistook you for a new moon.",        "You make elevators pray.",        "You're not just big-boned, you’re whole-skeletoned.",        "Your shadow has its own zip code.",        "When you jump, the ground apologizes.",        "You're the only person whose chair files a worker's comp claim.",        "You don't wear clothes, you wear tarps.",        "You sneeze and cause small earthquakes.",        "Even your mirror takes a deep breath before reflecting.",        "Your favorite workout is breathing heavy.",        "You bring a fork to a buffet like it's a weapon.",        "Your footsteps count as seismic activity.",        "Your idea of portion control is using one hand.",        "You sat on a coin and made it a pancake.",        "You enter a pool and it becomes a tsunami simulator.",        "Your bed has suspension – like a truck.",        "You’re on a seafood diet – you see food and eat it.",        "You're the reason they invented reinforced chairs.",        "If you were a superhero, your power would be gravitational pull.",        "You're not overweight, you're just gravitationally gifted.",        "You break a sweat thinking about salad.",        "When you run, the street gets tired.",        "You wear jeans stitched by ship sailmakers.",        "You leave crumbs wherever you go, like edible breadcrumbs.",        "Even your Fitbit gave up.",        "You walk into a bakery and they start baking faster.",        "Your grocery list reads like a restaurant menu.",        "Your clothes shop calls in extra staff when you enter.",        "Your reflection has a lag.",        "You don't walk – you orbit.",        "Your food pyramid is a rectangle... all carbs.",        "When you turn around, people think it's a time lapse.",        "Your napkin is a tablecloth.",        "You ask for a snack and get a pallet of chips.",        "You bite into a burger and it screams.",        "You consider breathing an exercise.",        "You need a GPS just to get around your belly.",        "Your pants size is just 'LOL'.",        "You're the reason the treadmill trembles.",        "You wear XL as a warm-up size.",        "You accidentally sit on your phone and call 911.",        "You don’t eat seconds. You eat fifths.",        "You make Santa look fit.",        "The fridge gets PTSD when it hears you coming.",        "You eat birthday cakes like they're muffins.",        "You're the boss fight in a food-themed video game.",        "You once tried to jog... the street filed a complaint.",        "You sweat gravy.",        "You're the only person who deep-fries cereal.",      ]];
    if(digestedCalories < tC*0.9)
    {
        Swal.fire({
            title: "Oh no!\nYou ate less, than you should have",
            text: beszolasok[0][Math.floor(Math.random() * beszolasok[0].length)],
            icon: "warning",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
        });
    }
    else if(digestedCalories > tC * 1.1)
    {
        Swal.fire({
            title: "Oh no!\nYou ate more than you should have!",
            text: beszolasok[1][Math.floor(Math.random() * beszolasok[1].length) ],
            icon: "warning",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
          });
    }
    else
    {
        Swal.fire({
            title: "Splendid!",
            text: "You are capable enough to understand a simple task!",
            imageUrl: "../pictures/sulek.png",
            imageWidth: 200,
            imageHeight: 100,
            imageAlt: "Custom image",
            confirmButtonText: "Close",
            buttonsStyling: false, // Disable default button styling
            customClass: {
              popup: "upload-alert-popup", // Custom popup styling
              title: "upload-alert-title", // Custom title styling
              confirmButton: "upload-alert-button" // Custom button styling
            }
          });
    }
}

async function szelektPlan()
{
    let response = fetch("/api/select" + plan,
    {
        method : "GET"   
    });
    return (await response).json();
}

async function szelektAll()
{
    let response = fetch("/api/selectAll",
    {
        method : "GET"   
    });
    return (await response).json();
}

async function build(target, hasDATA)
{
    let sel2 = document.getElementById("sel2");
    sel2.classList.add("kaja");
    target.innerHTML = null;
    let data;
    if(hasDATA)
    {
        data = await szelektPlan();
    }else
    {
        data = await szelektAll();
    }
    for(let i = 0;i < data.length ;i++)
    {
    
        let Name = document.createElement("option");
            Name.classList.add("kajaText");
            Name.innerHTML = data[i].Name+", "+ data[i].Calories + "kcal" + ", " + data[i].Fat_g_ + "fat, " + data[i].Protein_g_ + "prot, " + data[i].Carbohydrate_g_ + "carb, " + data[i].Sugars_g_ + "sug, " + data[i].Fiber_g_ + "fib";
            Name.value = data[i].id;
            Name.dataset.id = data[i].id;

        target.appendChild(Name);
    }
}

function cardGen(data, target)
{
    let card = document.createElement("div");
        card.dataset.adatk = JSON.stringify(data);
        card.dataset.id = data.id;
        let top = document.createElement("div");
            top.classList.add("top");
            top.innerHTML = data.Name

        let middle = document.createElement("div");
            middle.classList.add("middle");
            let table = document.createElement("table");
                for(var key in data.foodDATA)
                {
                    if(key != "help" && key)
                    {
                        let tr = document.createElement("tr");
                            let th = document.createElement("th");
                                th.innerHTML = key

                            let td = document.createElement("td");
                            let final = Math.round((parseFloat(data.foodDATA[key])/parseFloat(data.vol))*parseFloat(data.amountG) * 100)/100;
                            data.foodDATA[key] = final;
                            card.dataset.adatk = JSON.stringify(data);

                                td.innerHTML = final;
                            
                            tr.appendChild(th);
                            tr.appendChild(td);
                        table.appendChild(tr);
                    }
                }
                
                
            middle.appendChild(table);
            
        let bottom = document.createElement("div");
            bottom.classList.add("bottom");
            let deleteBTN = document.createElement("button");
                deleteBTN.type = "button";
                deleteBTN.classList.add("btn")
                deleteBTN.addEventListener("click", function()
                {
                    this.parentElement.parentElement.remove();
                    document.getElementById("Fede").childElementCount
                    

                    document.getElementById("fyhe").innerHTML = "Foods you have eaten: " + document.getElementById("mindmegette").childElementCount;
                    if(!isNaN(getSavedCal()))
                    {
                        document.getElementById("target").style.display="flex"
                        document.getElementById("target").innerHTML = "Target calorie: " + getSavedCal()
                    }
                    document.getElementById("allCals").innerHTML =  " SUM of the calories: " + EatenCalsSUM();
                    saveTOlocalStorage(document.getElementById("Fede"), "savedFoods");
                    saveTOlocalStorage(document.getElementById("mindmegette"), "savedEatenFoods");
                });
            deleteBTN.innerHTML = "DELETE";
        
            if(target.id == "Fede")
            {
                let tr = document.createElement("tr");
                    let th = document.createElement("th");
                        th.innerHTML = "Volume(g)";

                    let td = document.createElement("td");
                        td.innerHTML = Math.round(((data.foodDATA.Calories*data.foodDATA.help)/200) *100)/100
                    
                    tr.appendChild(th);
                    tr.appendChild(td);
                table.appendChild(tr);

                card.classList.add("card");
                card.classList.add("oszlop");
                let eatenBTN = document.createElement("button");
                eatenBTN.type = "button";
                eatenBTN.disabled = true;
                eatenBTN.addEventListener("click", function()
                {
                    this.parentElement.parentElement.remove();
                    cardGen(data, document.getElementById("mindmegette"));
                    saveTOlocalStorage(document.getElementById("Fede"), "savedFoods");
                    saveTOlocalStorage(document.getElementById("mindmegette"), "savedEatenFoods");
                    
                    document.getElementById("fyhe").innerHTML = "Foods you have eaten: " + document.getElementById("mindmegette").childElementCount;
                    if(!isNaN(getSavedCal()))
                    {
                        document.getElementById("target").style.display="flex"
                        document.getElementById("target").innerHTML = "Target calorie: " + getSavedCal()
                    }
                    document.getElementById("allCals").innerHTML = " SUM of the calories: " + EatenCalsSUM();      
                });
                eatenBTN.innerHTML = "I ate this";

            let fChoice = document.createElement("select");
                let reg = document.createElement("option");
                    reg.value ="breakfast";
                    reg.innerHTML = "breakfast";
                
                let tiz = document.createElement("option");
                    tiz.value = "elevenses";
                    tiz.innerHTML = "elevenses";
                
                
                let eb = document.createElement("option");
                    eb.value ="lunch";
                    eb.innerHTML = "lunch";
                

                let uzs = document.createElement("option");
                    uzs.value ="snack";
                    uzs.innerHTML = "snack";

                let vacs = document.createElement("option");
                    vacs.value ="dinner";
                    vacs.innerHTML = "dinner";
                
                let choose = document.createElement("option");
                    choose.hidden = true;
                    choose.innerHTML = "Choose...";
                
                switch(data.dine)
                {
                    case "breakfast":
                        reg.selected = true;
                        break;
                    case "elevenses":
                        tiz.selected = true;
                        break;
                    case "lunch":
                        eb.selected = true;
                        break;
                    case "snack":
                        uzs.selected = true;
                        break;
                    case "dinner":
                        vacs.selected = true;
                        break;
                    default:
                        choose.selected = true;
                        break;
                }
                fChoice.appendChild(choose);
                fChoice.appendChild(reg);
                fChoice.appendChild(tiz);
                fChoice.appendChild(eb);
                fChoice.appendChild(uzs);
                fChoice.appendChild(vacs);
            fChoice.addEventListener("change", function()
            {
                card.dataset.dine = fChoice.value;
                data.dine = fChoice.value;
                card.dataset.adatk = JSON.stringify(data);
                saveTOlocalStorage(document.getElementById("Fede"), "savedFoods");
            });

            let amount = document.createElement("input");
                amount.type = "number";
                amount.placeholder = "How much?(g)";
                if(data.amountG != null && data.amountG != "")
                {
                    eatenBTN.disabled = false;
                }
                amount.value = data.amountG;
                amount.addEventListener("change", function()
                {
                    eatenBTN.disabled = false;
                    data.amountG = amount.value;
                    card.dataset.adatk = JSON.stringify(data);
                    saveTOlocalStorage(document.getElementById("Fede"), "savedFoods");
                });
                


            bottom.appendChild(eatenBTN);
            bottom.classList.add("oszlop")
            bottom.appendChild(fChoice);
            bottom.appendChild(amount);

            }
            else
            {
                card.classList.add("cardEaten");
                card.classList.add("oszlop");
                let holderDiv = document.createElement("div");
                holderDiv.classList.add("holderDiv");
                    if(data.dine != null)
                    {
                        let mire = document.createElement("div");
                            mire.innerHTML = "For " + data.dine;
                            mire.classList.add("mire");
                        holderDiv.appendChild(mire);
                    }
                    let mennyit = document.createElement("div");
                            mennyit.classList.add("mennyit");
                            mennyit.innerHTML = "Amount eaten(g): " + data.amountG;
                        holderDiv.appendChild(mennyit);
                bottom.appendChild(holderDiv);

                let tr = document.createElement("tr");
                    let th = document.createElement("th");
                        th.innerHTML = "Volume(g)";

                    let td = document.createElement("td");
                        td.innerHTML = data.amountG;
                    
                    tr.appendChild(th);
                    tr.appendChild(td);
                table.appendChild(tr);
            }
            
            
            bottom.appendChild(deleteBTN);

            
            card.appendChild(top);
            card.appendChild(middle);
            card.appendChild(bottom);
        target.appendChild(card);
}

function listVisibilityCheck(holder)
{
    if(holder.childElementCount == 0)
    {
        holder.style.display = "none";
    }
    else
    {
        holder.style.display = "flex";
    }
};

function ClearContent(target)
{
    target.innerHTML = null;
    listVisibilityCheck(target);
    document.getElementById("allCals").innerHTML =  " SUM of the calories: " + EatenCalsSUM();
    document.getElementById("fyhe").innerHTML = "Foods you have eaten: " + document.getElementById("mindmegette").childElementCount;
}