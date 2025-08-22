const years = [2020, 2021, 2022, 2023, 2024];

function initializeLineChart(data) {
    const categories = Object.keys(data).filter(key => key !== 'title' && 
                                                       key !== 'subtitle' && 
                                                       key !== 'scope');
    
    function createLineChart(containerId, data, yAxisLabel = "Cases") {
        const container = document.getElementById(containerId);
        if (container) { 
            container.innerHTML = '';
        }
        
        const margin = { top: 40, right: 200, bottom: 60, left: 60 };
        const width = 600;
        const height = 350 - margin.top - margin.bottom;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
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
        
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            );
        
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        
        xAxis.selectAll('text')
            .style('text-anchor', 'middle');
        
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisBottom(xScale)
                .tickSize(height)
                .tickFormat('')
            );
        
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
        
        const legendX = width + 20;
        const legendItemHeight = 25;
        const legendPadding = 10;
        
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${legendItemHeight})`);
        
        legend.append('rect')
            .attr('x', -legendPadding)
            .attr('y', -legendPadding)
            .attr('width', 120)
            .attr('height', (categories.length * legendItemHeight) + (legendPadding * 2))
            .attr('fill', 'none')
            .attr('stroke', '#e0e0e0')
            .attr('stroke-width', 1)
            .attr('rx', 6);
        
        legend.selectAll('.legend-item')
            .data(categories)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * legendItemHeight + legendItemHeight/2})`)
            .each(function(d) {
                const g = d3.select(this);
                
                g.append('rect')
                    .attr('x', 0)
                    .attr('y', -6)
                    .attr('width', 12)
                    .attr('height', 12)
                    .attr('fill', colorScale(d))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5)
                    .attr('rx', 2);
                
                g.append('text')
                    .attr('x', 20)
                    .attr('y', 4)
                    .style('font-size', '13px')
                    .style('font-weight', '500')
                    .style('text-anchor', 'start')
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
                tooltip.html(`${d.category} <br> Cases: ${d.value}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    const container = document.getElementById('chart-container');
    if (container) {
        let titleContainer = '';
        if (data.subtitle) {
            titleContainer = `<div class="title-container">
                                <div class="main-title">${data.title}</div>
                                <div class="subtitle">${data.subtitle}</div>
                            </div>`
        } else {
            titleContainer = `<div class="title-container">
                                <div class="main-title">${data.title}</div>
                            </div>`
        }
        container.innerHTML = `
            ${titleContainer}
            <div class="chart-and-table-container">
                <div class="chart-section">
                    <div id="line-chart"></div>
                    <div class="data-table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    ${categories.map(category => `<th>${category}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${years.map((year, index) => `
                                    <tr>
                                        <td>${year}</td>
                                        ${categories.map(category => `<td>${data[category][index]}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
            
        `;

        createLineChart('line-chart', data, 'Cases');
    }
}

