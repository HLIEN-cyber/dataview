// Book Bubble Chart Visualization
// Shows publication date (x), rating (y), and pages (bubble size)

function _1(md){return(
md`# Book Metrics Bubble Chart

This visualization displays book data with:
- **X-axis**: Publication date (year.month)
- **Y-axis**: Amazon rating (1-5 stars)
- **Bubble size**: Number of pages

Hover over each bubble to see book title and author.`
)}

function _chart(d3, width, height, xAxis, yAxis, grid, data, x, y, radius, color)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(grid);

  const circle = svg.append("g")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data)
    .join("circle")
      .sort((a, b) => d3.descending(a.pages, b.pages))
      .attr("cx", d => x(d.publicationDate))
      .attr("cy", d => y(d.rating))
      .attr("r", d => radius(d.pages))
      .attr("fill", d => color(d.rating))
      .attr("opacity", 0.7)
      .call(circle => circle.append("title")
        .text(d => `${d.title}\n${d.author}`));

  return svg.node();
}

function _x(d3, data, margin, width)
{
  const extent = d3.extent(data, d => d.publicationDate);
  return d3.scaleTime()
    .domain(extent)
    .range([margin.left, width - margin.right])
    .nice();
}

function _y(d3, data, height, margin)
{
  const extent = d3.extent(data, d => d.rating);
  return d3.scaleLinear()
    .domain([extent[0] * 0.95, extent[1] * 1.02])
    .range([height - margin.bottom, margin.top])
    .nice();
}

function _radius(d3, data)
{
  const extent = d3.extent(data, d => d.pages);
  return d3.scaleSqrt()
    .domain([0, extent[1]])
    .range([0, 50]);
}

function _color(d3)
{
  return d3.scaleSequential()
    .domain([3.5, 5])
    .interpolator(d3.interpolateRgb("#ff9999", "#00cc66"));
}

function _xAxis(height, margin, d3, x, width)
{
  return g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .ticks(width / 100)
      .tickFormat(d3.timeFormat("%Y-%m")))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("y2", -height + margin.top + margin.bottom)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text("Publication Date →"));
}

function _yAxis(margin, d3, y)
{
  return g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(8))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", g.node().getBBox().width)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("↑ Amazon Rating"));
}

function _grid(x, margin, height, y, width)
{
  return g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.05)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right));
}

async function _data(FileAttachment)
{
  const books = await FileAttachment("books.json").json();

  return books.map(book => {
    // Parse publication date from "YYYY.MM" format
    const [year, month] = book.publication.split('.').map(Number);
    return {
      ...book,
      publicationDate: new Date(year, month - 1, 1)
    };
  });
}

function _legend(d3, color, radius, data)
{
  const svg = d3.create("svg")
    .attr("width", 800)
    .attr("height", 120)
    .attr("style", "display: block; margin: 20px auto;");

  const legend = svg.append("g")
    .attr("transform", "translate(20, 20)");

  // Page size legend
  const pageScale = [100, 200, 300, 400, 500];
  const sizeGroup = legend.append("g");

  sizeGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Bubble Size (Pages):");

  pageScale.forEach((pages, i) => {
    const g = sizeGroup.append("g")
      .attr("transform", `translate(${i * 120 + 80}, 40)`);

    g.append("circle")
      .attr("r", radius(pages))
      .attr("fill", "#4a90e2")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);

    g.append("text")
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text(`${pages}`);
  });

  // Color legend for rating
  const colorGroup = legend.append("g")
    .attr("transform", "translate(0, 95)");

  colorGroup.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Color (Rating):");

  const colorScale = [3.9, 4.2, 4.5, 4.8];
  colorScale.forEach((rating, i) => {
    const g = colorGroup.append("g")
      .attr("transform", `translate(${i * 80 + 100}, 0)`);

    g.append("circle")
      .attr("r", 8)
      .attr("fill", color(rating))
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", 20)
      .attr("y", 5)
      .attr("font-size", "11px")
      .text(`${rating}★`);
  });

  return svg.node();
}

function _margin()
{
  return {top: 20, right: 30, bottom: 40, left: 60};
}

function _height()
{
  return 600;
}

function _d3(require)
{
  return require("d3@7");
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["books.json", {url: new URL("./books.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("legend")).define("legend", ["d3", "color", "radius", "data"], _legend);
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","yAxis","grid","data","x","y","radius","color"], _chart);
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], _y);
  main.variable(observer("radius")).define("radius", ["d3", "data"], _radius);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], _yAxis);
  main.variable(observer("grid")).define("grid", ["x","margin","height","y","width"], _grid);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
