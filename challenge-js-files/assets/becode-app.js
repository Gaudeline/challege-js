/*
// WRITE YOUR JAVASCRIPT BELOW THIS COMMENT
Your name : Gaudeline
Date : 12/11/219
Contact information :
What does this script do ?
...
*/

// Your scripting goes here...
let pTag = document.createElement("p");   // creation de l'element <p>
pTag.setAttribute("class","graphic");     // attribution de la classe
let h1Tag = document.getElementById("firstHeading");   // récuperation de l'id du H1
h1Tag.appendChild(pTag);               // Insertion du <p> dans <h1>


///////////////////////////////////////////////////////////
//              Creation du premier graphique          //
/////////////////////////////////////////////////////////

// Récupération du json, creation et mise en forme du graphique
    async function returnGraphicOne(){
        try{
            let response = await fetch("https://inside.becode.org/api/v1/data/random.json");
            let data = await response.json();
                   let containerclear = d3.select("p.graphic").select("svg").remove(); // Suppression du graphique pour qu'il puisse être regénéré
                        let margin = {top: 20, right: 30, bottom: 40, left: 30}, //Mise en forme des différents éléments du graphique
                            width = 600 - margin.left - margin.right,
                            height = 500 - margin.top - margin.bottom;
                        let x = d3.scaleLinear()
                            .range([0, width]);
                        let y = d3.scaleBand()
                            .rangeRound([0, height])
                            .padding(0.1);
                        let xAxis = d3.axisBottom(x);
                        let yAxis = d3.axisLeft(y)
                            .tickSize(0)
                            .tickPadding(6);
                        let svg = d3.select("p.graphic").append("svg") //  creation du svg dans la nouvelle balise p
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                        x.domain(d3.extent(data, function(d) { return d[1]; })).nice(); // valeur retour de l'axe x du json
                        y.domain(data.map(function(d) { return d[0]; }));                 // valeur retour de l'axe y du json
                        svg.selectAll(".bar") // creation des différentes  barres selon les valeur du json
                            .data(data)
                            .enter().append("rect")
                            .attr("class", function(d) { return "bar bar--" + (d[1] < 0 ? "negative" : "positive"); })
                            .attr("x", function(d) { return x(Math.min(0, d[1])); })
                            .attr("y", function(d) { return y(d[0]); })
                            .attr("width", function(d) { return Math.abs(x(d[1]) - x(0)); })
                            .attr("height", y.bandwidth());
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);
                        svg.append("g")
                            .attr("class", "y axis")
                            .attr("transform", "translate(" + x(0) + ",0)")
                            .call(yAxis);
                        function type(d) {
                        d[1] = +d[1];
                        return d;
                        }
            } catch(e){
                console.log(e);
            }
        }

setInterval(function() { // mise a jour du graphique et des données chaques secondes
returnGraphicOne();
}, 1000);

///////////////////////////////////////////////////////////
//              Creation du deuxième graphique          //
/////////////////////////////////////////////////////////

function returnGraphicTwo(){
    const getDataFromHTMLTable = (CSSSelectorOfTheRows) => {
        let data = [];
        let tableRows = d3.selectAll(CSSSelectorOfTheRows); // Collect d'information sur chaque ligne
        tableRows = [...tableRows.nodes()];
        let tableHeaders = [];
        let cellsOfHeaders = [...tableRows[0].cells];
        for(let h=0; h<cellsOfHeaders.length;h++){      // Récuperation de l'entete pour les dates
            if(h>1){
                tableHeaders.push(cellsOfHeaders[h].innerHTML); // injection dans le tableau
            }
        }
    
        for (let i = 1; i < tableRows.length; i++) {
            let cellsOfRow = [...tableRows[i].cells];  // cellules
            let countryData = [];
            
            for (let j = 1; j < cellsOfRow.length; j++) { // Iteration sur chaque cellule
                if(j > 1){                              // Itération suite
                    if(cellsOfRow[j].innerText == ":"){ // Replacement des emplacements sans données par 0
                        countryData.push(0)
                    }else{
                        countryData.push(parseFloat((cellsOfRow[j].innerText).replace(",",".")));
                    }
                    
                }
            }
            data[i-1] = {}; 
            data[i-1].dates = tableHeaders;
            data[i-1].country = cellsOfRow[1].innerHTML;
            data[i-1].data = countryData;
        }
        return data;
    }
    
    let dataTableOne = getDataFromHTMLTable("#table1 > tbody > tr")
    console.log(dataTableOne);
   
  
    // Définition de la structure du svg
    
    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let width = 800 - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;

    // Creation du Graphique a proprement parlé
    function createGraphCrime(showCountry) {

    
    // Creation du svg   
    let svgCrime = d3.select('#mw-content-text').insert('svg','#table1')
                                    .attr('width', 900)
                                    .attr('height', 600)
                                    .style('background', '#fff')
                                    .attr('id','svgCrime')
    // Creation du graphique
    const graphic = svgCrime.append('g')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
    
    
    
    const xCrime = graphic.append('g')
                        .attr('transform', `translate(0, ${height})`);
    const yCrime = graphic.append('g');
    
    
    const x = d3.scaleBand()
                .domain(dataTableOne[showCountry].dates)
                .range([0, width])
                .paddingInner(0.2)
                .paddingOuter(0.1)
    
    const y = d3.scaleLinear()
                .domain([0, (Math.max(...dataTableOne[showCountry].data)*1.2)])
                .range([height, 0]);
    
    
    
    // Définition de l'axe x
    const axeX = d3.axisBottom(x)
    
    xCrime.call(axeX)
            .style('font-size', '14px')
            
            
    
    xCrime.selectAll('text')
            .attr('transform', 'rotate(-60) translate(0,5)')
            .attr('text-anchor', 'end');

    
    
    // Définition de l'axe Y
    
    const axeY = d3.axisLeft(y)
                    .ticks(20);
    
    yCrime.call(axeY)
            .style('font-size', '13px');
            
    
        // Définition de la fonction Hover du graphique
      function mouseOver(d, i) {
        d3.select(this)
          .style("opacity", 0.8)
          .attr('fill', 'orange')
          
    
        graphic.append('text')
                .attr('id', `data${d}${i}`)
                .style('font-weight', 'bold')
                .style('font-size', '1.7rem')
                .attr('fill', 'steelblue')
                .attr('x', function(){return x(d)+7})
                .attr('y', this.y.animVal.value-15)
                .text(dataTableOne[showCountry].data[i])
                
          
      }
      // définition de la fonction Hover leave du graphique
      function mouseLeave(d, i) {
        d3.select(this)
          .style("opacity", 1)
          .attr('fill', 'steelblue');
    
        d3.select(`#data${d}${i}`).remove();
      } 

      // Ajout des différents éléments dans le graphique
    const rects = graphic.selectAll("rect")
                        .data(dataTableOne[showCountry].data)
                        .enter()
                        .append('rect')
                        .on("mouseover", mouseOver)
                        .on("mouseleave", mouseLeave)
                        .attr('width', x.bandwidth())
                        .attr('height', function(d){return height - y(d)})
                        .attr('fill', 'steelblue')
                        .attr('y', function(d){return y(d)})
                        .data(dataTableOne[showCountry].dates)
                        .attr('x', function(d){return x(d)});
}    
createGraphCrime(1);    
    
    
    // Creation du DropDown
    
    let dropdown = d3.select('#mw-content-text').insert("select","#svgCrime")
                                                .attr('name','countries')
                                                .attr('id','selectCountry')
                                                .on('change', switchCountry)
                                            
                                        dropdown.selectAll("option")
                                                .data(dataTableOne)
                                                .enter()
                                                .append("option")
                                                .attr("value", function(d,i){return i})
                                                .text(function(d){return d.country})                                                             

     function switchCountry(){
     d3.select("#svgCrime").remove();
     createGraphCrime(this.value);
     }
}
returnGraphicTwo();



///////////////////////////////////////////////////////////
//              Creation du Troisième graphique         //
/////////////////////////////////////////////////////////

function returnGraphicTree (){
    // Récup donnée tableau
        const getDataFromHTMLTable = (CSSSelectorOfTheRows) => {
            let data = [];
            let tableRows = d3.selectAll(CSSSelectorOfTheRows); // Collect d'information sur chaque ligne
            tableRows = [...tableRows.nodes()];
            let tableHeaders = [];
            let cellsOfHeaders = [...tableRows[0].cells];
            for(let h=0; h<cellsOfHeaders.length;h++){      // Récuperation de l'entete pour les dates
                if(h>1){
                    tableHeaders.push(cellsOfHeaders[h].innerHTML); // injection dans le tableau
                }
            }
        
            for (let i = 1; i < tableRows.length; i++) {
                let cellsOfRow = [...tableRows[i].cells];  // cellules
                let countryData = [];
                
                for (let j = 1; j < cellsOfRow.length; j++) { // Iteration sur chaque cellule
                    if(j > 1){                              // Itération suite
                        if(cellsOfRow[j].innerText == ":"){ // Replacement des emplacements sans données par 0
                            countryData.push(0)
                        }else{
                            countryData.push(parseFloat((cellsOfRow[j].innerText).replace(",",".")));
                        }
                        
                    }
                }
                data[i-1] = {}; 
                data[i-1].dates = tableHeaders;
                data[i-1].country = cellsOfRow[1].innerHTML;
                data[i-1].data = countryData;
            }
            return data;
        }
            
    
    let dataTableTwo = getDataFromHTMLTable("#table2 tr")
    console.log(dataTableTwo);

// Creation du graphique


    // Creation du Graphique a proprement parlé
    function createGraphHomicides(showCountry) {
        var width = 550
        height = 550
        margin = 20
    
    
    var radius = Math.min(width, height) / 2 - margin
    

    
    var svg = d3.select("#table2 caption").append("div")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    

    
    // Division des couleurs selon les éléments indiqués
    var color = d3.scaleOrdinal()
      .domain(d3.entries(dataTableTwo[showCountry].data))
      .range(["steelblue", "darkorange"])
    
    // Position des parties du donuts
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function(d) {return d.value; })
    var data_donut = pie(d3.entries(dataTableTwo[showCountry].data))
    
    //Creation des arcs
    var arc = d3.arc()
      .innerRadius(radius * 0.5)         // Taille du trou central
      .outerRadius(radius * 0.8)
    

    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)
    
  // Creation du donut et des parts
    svg
      .selectAll('allSlices')
      .data(data_donut)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")

    

    svg
      .selectAll('allPolylines')
      .data(data_donut)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          var posA = arc.centroid(d) 
          var posB = outerArc.centroid(d) 
          var posC = outerArc.centroid(d); 
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
          return [posA, posB, posC]
        })
    


    //Ajout des lignes et des labels
    svg
      .selectAll('allLabels')
      .data(data_donut)
      .enter()
      .append('text')
      .text( function(d) { console.log(d.data.value) ; return d.data.value } )
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })
// ajout des étiquettes 

var legendItemSize = 18
var legendSpacing = 4

var legend = svg
  .selectAll('.legend')
  .data(dataTableTwo[showCountry].dates)
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', (d, i) => {
    var height = legendItemSize + legendSpacing
    var offset = height * color.domain().length / 2
    var x = legendItemSize * -2;
    var y = (i * height) - offset
    return `translate(${x}, ${y})`
  })

legend
  .append('rect')
  .attr('width', legendItemSize)
  .attr('height', legendItemSize)
  .style('fill', color);

legend
  .append('text')
  .attr('x', legendItemSize + legendSpacing)
  .attr('y', legendItemSize - legendSpacing)
  .text((d) => d)
    }
createGraphHomicides(1);
// creation du dropdown
let dropdown = d3.select('#table2 caption div')
.insert("select","svg")
.attr('name','countries')
.attr('id','selectCountry')
.on('change', switchCountry)

dropdown.selectAll("option")
.data(dataTableTwo)
.enter()
.append("option")
.attr("value", function(d,i){return i})
.text(function(d){return d.country})                                                             

function switchCountry(){
d3.select('#table2 caption').select("svg").remove();
createGraphHomicides(this.value);
}

}
returnGraphicTree();
