const years = [2020, 2021, 2022, 2023, 2024];

function initializeLineChart(data) {
    function createLineChart(containerId, data, title, yAxisLabel = "Cases") {
        const container = document.getElementById(containerId);
        if (container) { 
            container.innerHTML = '';
        }
        
        const margin = { top: 40, right: 60, bottom: 100, left: 60 };
        const width = 1000 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        const categories = Object.keys(data);
        
        const lineData = categories.map(category => {
            return {
                category: category,
                values: data[category].map((value, index) => ({
                    year: years[index],
                    value: value
                }))
            };
        });
        
        const xScale = d3.scalePoint()
            .domain(['2020', '2021', '2022', '2023', '2024'])
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(lineData, d => d3.max(d.values, v => v.value))])
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(d.year.toString()))
            .y(d => yScale(d.value));
        
        const colorScale = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeCategory10);
        
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        
        xAxis.selectAll('text')
            .style('text-anchor', 'middle');
        
        svg.append('g')
            .call(d3.axisLeft(yScale));
        
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(yAxisLabel);
        
        svg.selectAll('.line')
            .data(lineData)
            .enter()
            .append('path')
            .attr('class', 'line')
            .attr('d', d => line(d.values))
            .attr('fill', 'none')
            .attr('stroke', d => colorScale(d.category))
            .attr('stroke-width', 3)
            .style('opacity', 0.8);
        
        svg.selectAll('.dot')
            .data(lineData.flatMap(d => d.values.map(v => ({...v, category: d.category}))))
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.year.toString()))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .attr('fill', d => colorScale(d.category))
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
        
        const legendWidth = (categories.length - 1) * 120;
        const legendX = (width - legendWidth) / 2;
        
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${height + 60})`);
        
        legend.append('rect')
            .attr('x', -15)
            .attr('y', -15)
            .attr('width', legendWidth + 30)
            .attr('height', 30)
            .attr('fill', 'none')
            .attr('stroke', '#e0e0e0')
            .attr('stroke-width', 1)
            .attr('rx', 6);
        
        legend.selectAll('.legend-item')
            .data(categories)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
            .each(function(d) {
                const g = d3.select(this);
                
                g.append('rect')
                    .attr('x', -8)
                    .attr('y', -8)
                    .attr('width', 16)
                    .attr('height', 16)
                    .attr('fill', colorScale(d))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5)
                    .attr('rx', 2);
                
                g.append('text')
                    .attr('x', 15)
                    .attr('y', 5)
                    .style('font-size', '13px')
                    .style('font-weight', '500')
                    .text(d.charAt(0).toUpperCase() + d.slice(1));
            });
        
        const tooltip = d3.select(container)
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
        
        svg.selectAll('.dot')
            .on('mouseover', function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                tooltip.html(`Cases: ${d.value}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    const possibleContainers = ['chlamydia-chart', 'gonorrhea-chart', 'syphilis-chart'];
    let containerId = null;
    
    for (const id of possibleContainers) {
        if (document.getElementById(id)) {
            containerId = id;
            break;
        }
    }
    
    if (containerId) {
        let title = 'Cases by Race/Ethnicity';
        if (containerId.includes('chlamydia')) {
            title = 'Chlamydia Cases by Race/Ethnicity';
        } else if (containerId.includes('gonorrhea')) {
            title = 'Gonorrhea Cases by Race/Ethnicity';
        } else if (containerId.includes('syphilis')) {
            title = 'Syphilis Cases by Race/Ethnicity';
        }
        
        createLineChart(containerId, data, title, 'Cases');
    }
}

