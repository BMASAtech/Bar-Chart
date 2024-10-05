// function App(){

//     const [countryData,setCountryData] = React.useState([]);
//     const [dataType,setDataType] = React.useState("casesPerOneMillion")
//     React.useEffect(() => {
//         async function fetchData(){
//             const response = await fetch("https://disease.sh/v3/covid-19/countries?sort=" + dataType)
//             const data =await response.json();
//             console.log(data);
//             setCountryData(data);
//         }
//         fetchData();
//     },[dataType]);

//     return (
//         <div>
//             <h1>Covid Data per country</h1>
//             <select 
//             name="dataType" 
//             id="dataType"
//             onChange={(e) =>setDataType(e.target.value)}
//             value={dataType}
//             >
//             <option value="casesPerOneMillion">Cases Per One Million</option>
//             <option value="cases">Cases</option>
//             <option value="deaths">Deaths</option>
//             <option value="tests">Tests</option>
//             <option value="deahsPerOneMillion">Deaths Per One Million</option>
//             </select>
//             <div className="visHolder">
            
//             <BarChart 
//             data={countryData} 
//             height={500} 
//             widthOfBar={5} 
//             width={countryData.length*5} 
//             dataType={dataType}
//             />
//             </div>
//         </div>
//     );
// }

// function BarChart({data,height,width,widthOfBar,dataType }){
//     React.useEffect(()=>{
//         createBarChart();
//     }, [data]);

//     const createBarChart = () =>{
//         const countryData = data.map((country) => country[dataType]);
//         console.log("countryData",countryData);
//         const countries = data.map((country) => country.country);

//         let tooltip = d3.select(".visHolder")
//         .append("div")
//         .attr("id","tooltip")
//         .style("opacity",0);

//         const dataMax = d3.max(countryData);
//         const yScale = d3.scaleLinear().domain([0,dataMax]).range([0,height]);
//         d3.select("svg").selectAll("rect").data(countryData).enter().append("rect");
//         d3.select("svg")
//         .selectAll("rect")
//         .data(countryData)
//         .style("fill",(d,i)=> (i % 2==0 ?"#9595ff":"#44ff44"))
//         .attr("x",(d,i)=> i*widthOfBar)
//         .attr("y", (d)=> height-yScale(d + dataMax *0.1))
//         .attr("height", (d,i)=> yScale(d + dataMax*0.1))
//         .attr("width",widthOfBar)
//         .on("mouseover",(d,i)=> {
//             tooltip.style("opacity",0.9);
//             tooltip
//             .html(countries[i] + `<br/> ${dataType}: `+ d)
//             .style("left",i * widthOfBar +20 +"px")
//             .style("top",d3.event.pageY -170 + "px");
//         });
//     };

//     return (
//         <>
//             <svg width={width} height={height}></svg>
//         </>
//     );
// }



// ReactDOM.render(<App/>,document.getElementById('root'));

document.addEventListener("DOMContentLoaded", function () {
    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

    // Fetch the GDP data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const dataset = data.data;
            
            // Define margins and chart dimensions
            const margin = { top: 50, right: 30, bottom: 50, left: 60 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            // Create SVG canvas
            const svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Parse date strings into JavaScript Date objects
            const parseDate = d3.timeParse("%Y-%m-%d");
            const dates = dataset.map(d => parseDate(d[0])); // Convert string to Date

            // Define the scales
            const xScale = d3.scaleTime()
                .domain([d3.min(dates), d3.max(dates)])  // Use parsed Date objects
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([height, 0]);

            // Create x-axis and y-axis
            const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
            const yAxis = d3.axisLeft(yScale);

            // Append x-axis to SVG
            svg.append("g")
                .attr("id", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);

            // Append y-axis to SVG
            svg.append("g")
                .attr("id", "y-axis")
                .call(yAxis);

            // Create the bars
            svg.selectAll(".bar")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => xScale(parseDate(d[0])))  // Use parsed Date for alignment
                .attr("y", d => yScale(d[1]))
                .attr("width", width / dataset.length)
                .attr("height", d => height - yScale(d[1]))
                .attr("data-date", d => d[0])  // Keep original string for data attribute
                .attr("data-gdp", d => d[1])
                .on("mouseover", (event, d) => {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .html(`Date: ${d[0]}<br>GDP: ${d[1]}`)
                        .attr("data-date", d[0])
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 20}px`);
                })
                .on("mouseout", () => {
                    d3.select("#tooltip")
                        .style("opacity", 0);
                });
        });
});

