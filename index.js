var wholeData;
var dataa;
var chart;
 anychart.onDocumentReady(function() {

        anychart.theme(anychart.themes.darkEarth);
    
    // set the data
    dataa = {
        header: ["Name", "Confirmed Cases"],
      rows: []};

   
    // create the chart
    chart = anychart.bar();

    // add data
    chart.data(dataa);

    // set the chart title
    chart.title("Covid Cases from October 1 to October 20");

  // draw
  chart.container("container");
  chart.draw();
});
window.onload=function(){

   



    var xhr=new XMLHttpRequest();
    xhr.open('get',"https://api.covid19api.com/summary")
    xhr.send();
    xhr.onload=function(){
        if(xhr.status==200){
          wholeData=(JSON.parse(this.response))
            tableData(wholeData.Countries) // to show the data in a tabular form
             var global=JSON.parse(this.response).Global
             
             handleGlobal(global)// handling the total counts
            
        }
    }
    function tableData(countrynames)
    {   var countryNames=countrynames;
        var table=document.querySelector('.scrollit>table')
        
    
        for(var i=0;i<countryNames.length;i++){
          
            var tr=document.createElement('tr')
                
            var td1=document.createElement('td')
    
            td1.innerHTML=countryNames[i].Country;
     
            tr.appendChild(td1)
            table.appendChild(tr)   
        }
        
        table.addEventListener('click',showdata)

    }   
    
       

    
}
function handleGlobal(data){
    const globalData=data;
    var NewConfirmed=document.querySelector(".box1 .smallbox");
        NewConfirmed.textContent=globalData.NewConfirmed;
    
    var totalConfirmed=document.querySelector(".box2 .smallbox");
        totalConfirmed.textContent=globalData.TotalConfirmed;

    var newDeaths=document.querySelector(".box3 .smallbox");
    newDeaths.textContent=globalData.NewDeaths;

    var totalDeaths=document.querySelector(".box4 .smallbox");
    totalDeaths.textContent=globalData.TotalDeaths;

    var newRecovered=document.querySelector(".box5 .smallbox");
    newRecovered.textContent=globalData.NewRecovered;

    var totalRecovered=document.querySelector(".box6 .smallbox");
    totalRecovered.textContent=globalData.TotalRecovered;    
 
}

var input=document.getElementById('search')
input.addEventListener('keyup', data);



// once keyup event has triggered data will be shown in the table according to the input//
function data(){
  
    var dataname=document.getElementById('search').value.toUpperCase();
 
    const table=document.querySelector('table')
        var tr=table.getElementsByTagName('tr')

        for(let i=0;i<tr.length;i++){
  
            let td=tr[i].getElementsByTagName('td')[0];
           
            if(td){
                let textvalue=td.textContent
                   
                if(textvalue.toUpperCase().indexOf(dataname)>-1){
                        let td=tr[i].getElementsByTagName('td')[0];
                            td.style.width="315px"
                        tr[i].style.display="flex";
                }
                else{
                        tr[i].style.display="none";
                }

            }
        }
}

//adding Eventlistener to the tables TD
function showdata(){ 
    if(event.target.nodeName=="TD")
    { 
        const {textContent}=event.target
        var overpage=document.querySelector('.overpage')
        overpage.style.display="flex"
        showDataOverpage(textContent)
        overpage.addEventListener('click',backto) 
    }
    
  
     
}

//country name received by showDataOverpage
function showDataOverpage(cn){
     const nameCountry=cn

        for(var i=0;i<wholeData.Countries.length;i++){
            if(wholeData.Countries[i].Country==nameCountry){

                    var presentCountryData=wholeData.Countries[i]
                    break;
                        
            }
        }

        console.log(presentCountryData)

        const overpageIn=document.querySelector('.overpage-in')
            overpageIn.textContent="";

            const flag=document.createElement('div')
            const countryCode=presentCountryData.CountryCode.toLowerCase()
            const img=document.createElement('img')
                    img.setAttribute('src',"flags/"+countryCode+".svg")
                    img.setAttribute("alt",nameCountry)
                    img.setAttribute('width',"100%")
                    flag.append(img)
            
            const countryname=document.createElement('div')
                  countryname.style.fontFamily="Rokkitt";
                  countryname.textContent=nameCountry.toUpperCase();
       
            const lastUpdated=document.createElement('div')
                  lastUpdated.textContent=`Last Updated : ${presentCountryData.Date}`

            const newConfirmed=document.createElement('div')
                
                  newConfirmed.textContent=`New Confirmed : ${presentCountryData.NewConfirmed}`

            const newDeaths=document.createElement('div')
                  newDeaths.textContent=`New Deaths : ${presentCountryData.NewDeaths}`

            const newRecovered=document.createElement('div')
                  newRecovered.textContent=`New Recovered : ${presentCountryData.NewRecovered}`
            
            const totalConfirmed=document.createElement('div')
                  totalConfirmed.textContent=`Total Confirmed : ${presentCountryData.TotalConfirmed}`
            
            const totalDeaths=document.createElement('div')
                  totalDeaths.textContent=`Total Deaths : ${presentCountryData.TotalDeaths}`
            
            const totalRecoverd=document.createElement('div')
                  totalRecoverd.textContent=`Total Recovered : ${presentCountryData.TotalDeaths}`
            
                    overpageIn.append(flag,countryname,lastUpdated,totalConfirmed,totalRecoverd,totalDeaths,newConfirmed,newRecovered,newDeaths)

        // adding data to the chart 
        var xhr=new XMLHttpRequest();
            xhr.open("GET","https://api.covid19api.com/total/country/"+presentCountryData.Slug+"/status/confirmed?from=2020-10-01T00:00:00Z&to=2020-10-21T00:00:00Z")
            xhr.send();
            xhr.onload=function(){
                    var perDaycases=JSON.parse(this.response)
                  
                      dataa.rows=[];
                    for(var i=0;i<perDaycases.length;i++){
                        var getdate=perDaycases[i].Date.split("T")
                            
                        dataa.rows.push([(getdate[0]+"("+perDaycases[i].Cases.toString()+")"),(perDaycases[i].Cases)%100])
                    } 
                    chart.data(dataa)
            }

        
}

//click on the display to go back to the dashboard
function backto(){   
    var overpage=document.querySelector('.overpage')
    overpage.style.display="none" ;
  
}
