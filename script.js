// D3 imports
const {
  select,
  json,
  scaleLinear,
  scaleTime,
  min,
  max,
  axisLeft,
  axisBottom,
  format,
} = d3;

// Source data
const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const rootPadding = 50;

// Svg dimensions
const width = 1200;
const height = window.innerHeight - rootPadding;

// Root
const root = select('#root');

// Svg
const svg = root.append('svg')
  .attr('width', width)
  .attr('height', height);

// Render function
const render = (sourceData) => {

  // Format received data
  // Transform nested arrays to objects with date and value prop
  const data = sourceData.data.map(d => ({
    date: new Date(d[0]),
    value: d[1]
  }));

  const dateStrings = sourceData.data.map(d => d[0]);

  // Value accessors
  const xValue = (d) => d.date;
  const yValue = (d) => d.value;

  const xMin = min(data, xValue);
  const xMax = max(data, xValue);

  // Margins
  const margin = { top: 50, right: 20, bottom: 20, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const barWidth = innerWidth / data.length;

  // x scale
  const xScale = scaleTime()
  .domain([xMin, xMax])
  .range([0, innerWidth]);

  // x axis
  const xAxis = axisBottom(xScale);

  // x scale
  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0]);

  // y axis
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)

  // Create group element inside svg
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title 
  g.append('text')
    .attr('id', 'title')
    .attr('text-anchor', 'middle')
    .attr('x', innerWidth / 2)
    .attr('y', -10)
    .text('Gross Domestic Product (GDP)');

  // Create y axis g element
  const yAxisG = g.append('g').call(yAxis)
    .attr('id', 'y-axis')
    
  // Remove domain line
  yAxisG.select('.domain').remove();

  // Create x axis g element
  g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    .attr('id', 'x-axis');

  // Tooltip div
  const tooltip = root.append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  // Mouse over
  const handleMouseover = (d, i) => {
    tooltip.transition()		
      .duration(200)		
      .style("opacity", .9);

    tooltip.html('TEST TOOLTIP')
      .attr('data-date', dateStrings[i])
      .attr('data-gdp', yValue(d))
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
  }
  // Mouse out
  const handleMouseout = () => {
    tooltip.transition()		
      .duration(500)		
      .style("opacity", 0);	
  }

  // Append bars
  g.selectAll('rect').data(data).enter()
    .append('rect')
      .attr('class', 'bar')
      // Data attributes
      .attr('data-gdp', yValue)
      .attr('data-date', (d, i) => dateStrings[i])
      // Dimensions
      .attr('width', barWidth)
      .attr('height', (d) => yScale(0) - yScale(yValue(d)))
      // Position
      .attr('x', (d) => xScale(xValue(d)))
      .attr('y', (d) => yScale(yValue(d)))
      // Event handlers
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);
};

// Make http request using json method from d3
json(url).then((sourceData) => {
  

  render(sourceData);
});
