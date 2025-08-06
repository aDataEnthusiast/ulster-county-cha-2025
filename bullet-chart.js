function initializeBulletCharts(data) {
    const maxValue = 100;
    const minValue = 0;
    
    function createBulletChart(containerId, label, current, goal, direction) {
        const container = document.getElementById(containerId);
        
        const met = direction === 'higher' ? current >= goal : current <= goal;
        
        const chartWidth = 625;
        const chartHeight = 80;
        const margin = { top: 25, right: 20, bottom: 25, left: 140 };
        const width = chartWidth - margin.left - margin.right;
        const height = chartHeight - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight);
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        const xScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([0, width]);
        
        g.append('rect')
            .attr('x', 0)
            .attr('y', 15)
            .attr('width', width)
            .attr('height', 30)
            .attr('fill', '#f0f0f0')
            .attr('rx', 3);
        
        g.append('rect')
            .attr('class', 'current-bar')
            .attr('x', 0)
            .attr('y', 20)
            .attr('width', (current / maxValue) * width)
            .attr('height', 20)
            .attr('fill', met ? '#4CAF50' : '#FF9800')
            .attr('rx', 2);
        
        g.append('line')
            .attr('class', 'goal-marker')
            .attr('x1', (goal / maxValue) * width)
            .attr('x2', (goal / maxValue) * width)
            .attr('y1', 10)
            .attr('y2', 50)
            .attr('stroke', '#333')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '3,3');
        
        g.append('text')
            .attr('class', 'label')
            .attr('x', -10)
            .attr('y', 35)
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(label);
        
        g.append('text')
            .attr('class', 'current-value')
            .attr('x', (current / maxValue) * width + 8)
            .attr('y', 35)
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(`${current}%`);
        
        g.append('text')
            .attr('class', 'goal-text')
            .attr('x', (goal / maxValue) * width + 8)
            .attr('y', 12)
            .attr('font-size', '11px')
            .attr('fill', '#666')
            .attr('font-weight', 'bold')
            .text(`Goal: ${goal}%`);
    }

    const chartsContainer = document.getElementById('charts-container');
    
    chartsContainer.innerHTML = '';
    
    data.labels.forEach((label, index) => {
        const current = data.current[index];
        const goal = data.goals[index];
        const direction = data.directions[index];
        const met = direction === 'higher' ? current >= goal
        : current <= goal;
        
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-row';
        chartItem.innerHTML = `
            <div class="chart-layout">
                <div class="chart-container">
                    <div id="bullet-${index}"></div>
                </div>
                <div class="status-indicator ${met ? 'status-met' : 'status-not-met'}">
                    ${met ? 'Met ✓' : 'Unmet ✗'}
                </div>
            </div>
        `;
        
        chartsContainer.appendChild(chartItem);
        
        setTimeout(() => {
            createBulletChart(`bullet-${index}`, label, current, goal, direction);
        }, 100);
    });
}