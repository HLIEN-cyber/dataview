# Book Metrics Bubble Chart

A D3.js visualization showing book metrics in a bubble chart format.

## Visualization

This chart displays:
- **X-axis**: Publication date (YYYY.MM format)
- **Y-axis**: Amazon rating (1-5 stars)
- **Bubble size**: Number of pages (larger bubbles = longer books)
- **Bubble color**: Genre categories
  - Romance: Pink
  - Thriller: Crimson
  - Literary Fiction: Royal Blue
  - Contemporary Fiction: Lime Green
  - Science Fiction: Medium Purple

Hover over any bubble to see the book title and author.

## Running the Visualization

View this visualization in your browser by running a web server in this folder:

~~~sh
npx http-server
~~~

Then open http://localhost:8080 in your browser.

## Data Source

The visualization uses data from `books.json`, which contains information about various books including:
- Title
- Author
- Publication date
- Page count
- Amazon rating
