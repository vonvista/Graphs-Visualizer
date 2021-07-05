const controlsHeight = document.getElementById("controlPanel").offsetHeight 

var animSpeed = 7
const easing = 0.05 * animSpeed

var clickMode = "none"
var inp, inpButton, inpValue, inpTarget
var tempTransition
var stringValue = ""
var keyPress
var editingMode = false

//COLORS
const YELLOW = [255, 242, 0]
const WHITE = [255,255,255]
const BASE_DARKBLUE = [28,42,53]

const VISITED_COLOR = [32,98,149]
const TRAVERSAL_OUTLINE = [255,157,0]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

class Graph {
  // defining vertex array and
  // adjacent list
  constructor(noOfVertices)
  {
    this.noOfVertices = noOfVertices
    this.AdjList = new Map()
  }

  addVertex(v)
  {
    // this.AdjList.set(v, []);
    this.AdjList.set(v, new Set());
  }

  addEdge(v, w)
  {
    if(v == w){
      this.AdjList.get(v).add(w);
      return
    }
    // get the list for vertex v and put the
    // vertex w denoting edge between v and w
    this.AdjList.get(v).add(w);
  
    // Since graph is undirected,
    // add an edge from w to v also
    //this.AdjList.get(w).add(v);
  }

  removeEdge(v, w){

    if(edges.has(w.value + "," + v.value)){
      edges.get(w.value + "," + v.value).edgeType = "straight"
    }

    this.AdjList.get(v).delete(w);
  }

  removeNode(v){
    
    for (const [key, value] of this.AdjList.entries()) {
      if(value.has(v)){
        value.delete(v)
      }
    }

    this.AdjList.delete(v);
  }

  async bfs(startingNode) {

    disableButtonControls()

    // create a visited object
    var visited = {};
  
    // Create an object for queue
    var q = []
  
    // add the starting node to the queue
    visited[startingNode.value] = true;
    q.push(startingNode);
    await startingNode.changeFill(32,98,149)
    //startingNode.outlineColor = [255,157,0]
    await startingNode.changeOutline(255,157,0)

    statusText = "Running: Breadth-First Search(" + startingNode.value + ")"
  
    // loop until queue is element
    while (q.length != 0) {
      // get the element from the queue
     
      var getQueueElement = q.shift();

      // passing the current vertex to callback funtion
      console.log(getQueueElement.value);
      await getQueueElement.changeFill(32,98,149)

      // get the adjacent list for current vertex
      var get_List = this.AdjList.get(getQueueElement);

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i of get_List) {
        
        //console.log(i)
        console.log(visited)
        
        var neigh = i;

        //FOR VISUALIZER
        if(edges.has(getQueueElement.value + "," + neigh.value)){
          //edges.get(getQueueElement.value + "," + neigh.value).color = [255,157,0]
          await edges.get(getQueueElement.value + "," + neigh.value).changeFill(255,157,0)
        }
        else {
          //edges.get(neigh.value + "," + getQueueElement.value).color = [255,157,0]
          await edges.get(neigh.value + "," + getQueueElement.value).changeFill(255,157,0)
        }
        //await sleep(200)

        if (!visited[neigh.value]) {
          visited[neigh.value] = true;
          
          //neigh.outlineColor = [255,157,0]
          await neigh.changeOutline(255,157,0)
          //await sleep(200)
          
          q.push(neigh);
        }
        //console.log(q.length)
      }

      console.log(q)
    }
    statusText = "Breadth-First Search: Click on starting node to start"

    enableButtonControls()
  }

  async dfs(startingNode) {

    disableButtonControls()

    // create a visited object
    var visited = {};
  
    // Create an object for queue
    var q = []
  
    // add the starting node to the queue
    visited[startingNode.value] = true;
    q.push(startingNode);
    await startingNode.changeFill(32,98,149)
    //startingNode.outlineColor = [255,157,0]
    await startingNode.changeOutline(255,157,0)

    //console.log(visited)
    //console.log(q)
    statusText = "Running: Depth-First Search(" + startingNode.value + ")"
  
    // loop until queue is element
    while (q.length != 0) {
      // get the element from the queue
      //console.log(q)
     
      var getQueueElement = q.pop();

      // passing the current vertex to callback funtion
      console.log(getQueueElement.value);
      await getQueueElement.changeFill(32,98,149)

      // get the adjacent list for current vertex
      var get_List = this.AdjList.get(getQueueElement);

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i of get_List) {
        
        //console.log(i)
        console.log(visited)
        
        var neigh = i;

        //FOR VISUALIZER
        if(edges.has(getQueueElement.value + "," + neigh.value)){
          //edges.get(getQueueElement.value + "," + neigh.value).color = [255,157,0]
          await edges.get(getQueueElement.value + "," + neigh.value).changeFill(255,157,0)
        }
        else {
          //edges.get(neigh.value + "," + getQueueElement.value).color = [255,157,0]
          await edges.get(neigh.value + "," + getQueueElement.value).changeFill(255,157,0)
        }
        //await sleep(200)

        if (!visited[neigh.value]) {
          visited[neigh.value] = true;
          
          //neigh.outlineColor = [255,157,0]
          await neigh.changeOutline(255,157,0)
          //await sleep(200)
          q.push(neigh);
        }
        //console.log(q.length)
      }

      console.log(q)
    }
    statusText = "Depth-First Search: Click on starting node to start"

    enableButtonControls()
  }

  async greedyColoring(startingNode) {

    disableButtonControls()

    var colors = [0,1,2,3,4,5,6,7,8,9]
    var result = new Map()
    var usedColors = new Set()

    var colorValues = [[41, 89, 126],[126, 87, 41],[126, 41, 41],[103, 41, 126],[71, 126, 41],
    [121, 126, 41],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]

    result[startingNode.value] = colors[0]

    await startingNode.changeFill(colorValues[result[startingNode.value]][0],colorValues[result[startingNode.value]][1],colorValues[result[startingNode.value]][2])

    console.log(startingNode.value)
    console.log(result[startingNode.value])

    statusText = "Greedy Coloring: Node(" + startingNode.value +") with first color"

    for (const [key, value] of this.AdjList.entries()) {
      
      if(key == startingNode){
        continue
      }

      console.log("==========")
      console.log(key.value)

      for (var i of value) { //Loop through adjacent nodes
        if(!result.has(i.value)){  //Proxy !result
          
          usedColors.add(result[i.value])
        }
      }
      console.log(usedColors.size);

      let cr = 0
      while(true){
        if(!usedColors.has(cr)){
          console.log()
          break
        }
        cr += 1
      }
            
      // Assign the found color
      result[key.value] = colors[cr]

      //await key.changeFill(colors[cr])
      await key.changeFill(colorValues[cr][0],colorValues[cr][1],colorValues[cr][2])

      console.log(result[key.value])

      usedColors.clear()
    }
    
    console.log(result.size)

    enableButtonControls()

  }

  async primMST(startingNode) {

    disableButtonControls()

    //let key = new Map()
    let key = {}
    let MST = []
    let mstSet = new Set()

    MST.push(startingNode.value)
    key[startingNode.value] = 0

    let min
    let min_node = startingNode

    //FOR VISUALIZER
    let connected_node
    let minAdj = {}

    statusText = "Running: Minimum Spanning Tree (Prim) :Node(" + startingNode.value + ")"

    for(let i of nodes){
      min = Number.POSITIVE_INFINITY
      //let min_node
      console.log("=============")
      //console.log(key)
      //console.log(mstSet)
      for(let v of mstSet){
        
        for(let adj of this.AdjList.get(v)){

          if(mstSet.has(adj) == false && (key[adj.value] == undefined || key[adj.value] < min)){
            // console.log("HERE")
            // console.log(mstSet)
            // console.log(adj.value)
            min = key[adj.value]
            min_node = adj
            connected_node = v

            console.log(key)
            console.log(connected_node)
          }
        }
        
      }
      console.log(min_node)
      
      mstSet.add(min_node)

      if(min_node != startingNode){
        await min_node.changeFill(32,98,149)
      }
      else {
        await min_node.changeFill(103, 41, 126)
      }
      await min_node.changeOutline(255,157,0)


      if(min_node != startingNode) await minAdj[min_node.value].changeFill(126, 198, 247)

      for(let adj of this.AdjList.get(min_node)){
        if(getEdge(min_node, adj).value != 0 && mstSet.has(adj) == false && 
        (key[adj.value] == undefined || getEdge(min_node, adj).value < key[adj.value])){
          console.log("HERE")
          MST.push(min_node.value)

          await getEdge(min_node, adj).changeFill(255,157,0)
          await adj.changeOutline(255,157,0)

          key[adj.value] = getEdge(min_node, adj).value
          minAdj[adj.value] = getEdge(min_node, adj)
        }

        statusText2 = "Key:" + JSON.stringify(key)
      }

      

    }
    //DIM OUT NODES THAT ARE NOT PART OF THE MST
    for (const [nodes, edge] of edges.entries()) {
      console.log(edge.color)
      if(edge.color[0] == 255 && edge.color[1] == 255 && edge.color[2] == 255){
        
        await edge.changeFill(27, 69, 94)
      }
      if(edge.color[0] == 255 && edge.color[1] == 157 && edge.color[2] == 0){
        
        await edge.changeFill(27, 69, 94)
      }
      
    }

    enableButtonControls()
    
  }

  async dijkstraSPT(startingNode) {

    disableButtonControls()

    //let key = new Map()
    let dist = {}
    let SPT = []
    let sptSet = new Set()

    for(let node of nodes){
      dist[node.value] = Number.POSITIVE_INFINITY
    }

    dist[startingNode.value] = 0

    let min
    let min_node = startingNode

    //FOR VISUALIZER
    let minAdj = {}

    //statusText3 = "SPT Set:" 

    statusText = "Running: Shortest Path Tree (Dijkstra) :Node(" + startingNode.value + ")"

    for(let i of nodes){
      min = Number.POSITIVE_INFINITY
      console.log("=============")
      console.log(dist)

      for(let v of sptSet){
        
        for(let adj of this.AdjList.get(v)){

          if(sptSet.has(adj) == false && dist[adj.value] <= min){
            

            min = dist[adj.value]
            min_node = adj
            
          }
        }
        
      }
      //console.log(min_node)
      
      sptSet.add(min_node)

      statusText2 = "Distance:" + JSON.stringify(dist)

      //statusText3 += min_node.value + ","

      min_node.label = "D:" + dist[min_node.value]

      if(min_node != startingNode){
        await min_node.changeFill(32,98,149)
      }
      else {
        await min_node.changeFill(103, 41, 126)
      }
      await min_node.changeOutline(255,157,0)

      //console.log(minAdj)
      if(min_node != startingNode) await minAdj[min_node.value].changeFill(126, 198, 247)

      for(let adj of this.AdjList.get(min_node)){
        
        if(getEdge(min_node, adj).value != 0 && sptSet.has(adj) == false && 
        (dist[min_node.value] != Number.POSITIVE_INFINITY &&
        dist[min_node.value] + getEdge(min_node, adj).value < dist[adj.value])){

          console.log(dist[adj.value])
          console.log(dist[min_node.value] + getEdge(min_node, adj).value)
          await getEdge(min_node, adj).changeFill(255,157,0)
          await adj.changeOutline(255,157,0)

          dist[adj.value] = dist[min_node.value] + getEdge(min_node, adj).value
          minAdj[adj.value] = getEdge(min_node, adj)
        }

        statusText2 = "Distance:" + JSON.stringify(dist)
      }

    }
    //DIM OUT NODES THAT ARE NOT PART OF THE MST

    for (const [nodes, edge] of edges.entries()) {
      //console.log(edge.color)
      if(edge.color[0] == 255 && edge.color[1] == 255 && edge.color[2] == 255){
        
        await edge.changeFill(27, 69, 94)
      }
      if(edge.color[0] == 255 && edge.color[1] == 157 && edge.color[2] == 0){
        
        await edge.changeFill(27, 69, 94)
      }
      
    }

    enableButtonControls()
    
  }

  async kosarajuSCC() {

    statusText = "Running: Strongly Connected Components (Kosaraju)"

    disableButtonControls()

    var stack = []
    
    var visited = {}

    for(let node of nodes){
      if(!visited[node.value]){
        await this.kosarajuFillOrder(node, visited, stack)
      }
    }
    console.log(stack)

    let gr = await this.getTranspose()

    //console.log(gr)

    visited = {}
    console.log(visited)

    while(stack.length != 0){
      let i = stack.pop()
      let SCC = new Set()
      console.log("===========")
      if(!visited[i.value]){
        console.log(i.value)

        SCC.add(i)

        // i is solely there to connect the first and last edge for visualizer
        await gr.kosarajuDFS(i, visited, SCC)

        // color remaining uncolored edges on SCC
        console.log(SCC)

        for(let u of SCC){
          for(let v of SCC){
            if(edges.has(u.value + "," + v.value)) {
              let edge = getEdge(u, v)
              if(edge.color[0] == 255 && edge.color[1] == 255 && edge.color[2] == 255){
                edge.changeFill(255,157,0)
              }

              if(edge.color[0] == 126 && edge.color[1] == 198 && edge.color[2] == 247){
                edge.changeFill(255,157,0)
              }
              
            }
          }
        }
      }
    }

    //color !SCC edges with a blunt blue
    for (const [nodes, edge] of edges.entries()) {
      if(edge.color[0] == 255 && edge.color[1] == 255 && edge.color[2] == 255){
        //edge.changeFill(42, 76, 102)
      }

      if(edge.color[0] == 126 && edge.color[1] == 198 && edge.color[2] == 247){
        await edge.changeFill(255, 255, 255)
      }
    }

    handleMouse()
    enableButtonControls()
    
  }

  async kosarajuFillOrder(v, visited, stack){
    visited[v.value] = true

    await v.changeFill(32,98,149)

    for(let i of this.AdjList.get(v)){

      await edges.get(v.value + "," + i.value).changeFill(126, 198, 247)
      
      if(!visited[i.value]){
        
        await this.kosarajuFillOrder(i, visited, stack)
      }
    }

    stack.push(v)
    console.log(stack)
    
  }

  async kosarajuDFS(v, visited, SCC){
    visited[v.value] = true
    await v.changeOutline(255,157,0)
    await v.changeFill(126, 41, 41)

    for(let i of this.AdjList.get(v)){
      if(!visited[i.value]){
        console.log(i.value)

        SCC.add(i)
        
        await getEdge(i, v).changeFill(255,157,0)
        await this.kosarajuDFS(i, visited, SCC)

        
      }
    }
  }

  async getTranspose() {
    let g = new Graph()

    for (const [key, value] of this.AdjList.entries()) {
      g.addVertex(key)
    }


    for (const [key, value] of this.AdjList.entries()) {
      for(let adjNodes of value){
        g.addEdge(adjNodes, key)
      }
    }
    return g
  }

  draw() {

    // for (const [key, value] of this.AdjList.entries()) {
    //   key.draw()
    // }
  }
}


class GraphNode {
  constructor(x, y){
    this.value = ""
    this.x = x
    this.y = y
    this.size = 50
    this.outlineColor = [255,255,255]
    this.fillColor = [28,42,53]
    this.label = ""
    
  }
  draw(){
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    stroke(this.outlineColor[0], this.outlineColor[1], this.outlineColor[2])
    strokeWeight(1)


    // if(this.color[0] < 255){
    //   this.color[0] += 3
    // }
    // if(this.color[1] < 255){
    //   this.color[1] += 3
    // }
    // if(this.color[2] < 255){
    //   this.color[2] += 3
    // }


    ellipse(this.x, this.y, this.size, this.size)

    if(this.isFinal){
      ellipse(this.x, this.y, this.size - 10, this.size - 10)
    }
    fill(255,255,255);
    if(this.isInitial){
      triangle(this.x - 50, this.y + 25, this.x - 50, this.y - 25, this.x - 25, this.y)
    }

    if(this.value != ""){
      noStroke()
      fill(255, 255, 255);
      textSize(12)
      text(this.value, this.x, this.y)
    }

    if(this.label != ""){
      strokeWeight(4)
      stroke(28, 42, 53)
      fill(255, 255, 255);
      textSize(12)
      text(this.label, this.x, this.y - 35)
    }

  }
  clicked(){
    if(!editingMode){
      if(mouseX > this.x - this.size/2 && mouseX < this.x + this.size/2 && mouseY > this.y - this.size/2 && mouseY < this.y + this.size/2){
        console.log("clicked")
        return this
      }
    }
  }
  async changeFill(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.fillColor[0] = this.fillColor[0] + (r - this.fillColor[0]) * easing
      this.fillColor[1] = this.fillColor[1] + (g - this.fillColor[1]) * easing
      this.fillColor[2] = this.fillColor[2] + (b - this.fillColor[2]) * easing
      await sleep(2)
    }
    
    this.fillColor[0] = r
    this.fillColor[1] = g
    this.fillColor[2] = b
  }
  async changeOutline(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.outlineColor[0] = this.outlineColor[0] + (r - this.outlineColor[0]) * easing
      this.outlineColor[1] = this.outlineColor[1] + (g - this.outlineColor[1]) * easing
      this.outlineColor[2] = this.outlineColor[2] + (b - this.outlineColor[2]) * easing
      await sleep(2)
    }
    
    this.outlineColor[0] = r
    this.outlineColor[1] = g
    this.outlineColor[2] = b
  }
}

class Edge {
  constructor(start, end, edgeType){
    this.start = start
    this.end = end
    this.value = ""
    this.edgeType = edgeType
    this.color = [255,255,255]
  }
  draw(){
    var center = 25

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance
    
    //Control line shape
    strokeWeight(2)
    stroke(this.color[0], this.color[1], this.color[2])

    // if(this.color[0] < 255){
    //   this.color[0] += 3
    // }
    // if(this.color[1] < 255){
    //   this.color[1] += 3
    // }
    // if(this.color[2] < 255){
    //   this.color[2] += 3
    // }

    if(this.edgeType == "straight"){
      line(this.start.x, this.start.y, this.end.x, this.end.y)
    }
    else if(this.edgeType == "curve"){
      
      noFill()
      beginShape()
      curveVertex(this.start.x,this.start.y)
      curveVertex(this.start.x,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
      curveVertex(this.end.x,this.end.y)
      curveVertex(this.end.x,this.end.y)
      endShape()
      
    }
    else if(this.edgeType == "loop"){

      let loopOffset = 20
      curveDistance = 60

      let distance = sqrt(pow(this.start.y - this.end.y,2) + pow((this.end.x - loopOffset) - (this.start.x + loopOffset),2))
      distance = curveDistance/distance

      noFill()
      beginShape()
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * ((this.end.x - loopOffset) - (this.start.x + loopOffset)))
      curveVertex(this.end.x - loopOffset,this.end.y)
      curveVertex(this.end.x - loopOffset,this.end.y)
      endShape()
    }

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    
    //Control arrow point
    var offset = 8
    push() //start new drawing state
    var angle = atan2(this.start.y - this.end.y, this.start.x - this.end.x); //gets the angle of the line

    if(this.edgeType == "straight"){
      translate(midX, midY); //translates to the destination vertex
    }
    else if(this.edgeType == "curve"){
      translate(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
    }
    else if(this.edgeType == "loop"){
      angle = -90
      translate(this.start.x + 14, this.start.y - 25)
    }

    rotate(angle-HALF_PI); //rotates the arrow point
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    pop();

    fill(this.color[0], this.color[1], this.color[2])
    stroke(28, 42, 53)
    strokeWeight(4)

    textSize(12)

    //control transition labels
    
    if(this.edgeType == "straight"){
      text(this.value, (this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2 - 20)
    }
    else if(this.edgeType == "curve"){
      text(this.value, midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x)- 20)
    }
    else if(this.edgeType == "loop"){
      text(this.value, this.start.x, this.start.y - curveDistance - 10)
    }
    
  }

  clicked(){
    let clickArea = 15

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance

    if(this.edgeType == "straight" && dist((this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    
    else if(this.edgeType == "curve" && dist(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x), mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    if(this.edgeType == "loop" && dist(this.start.x, this.start.y - 60, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
  }

  async changeFill(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (150 / animSpeed); i++){
      this.color[0] = this.color[0] + (r - this.color[0]) * easing
      this.color[1] = this.color[1] + (g - this.color[1]) * easing
      this.color[2] = this.color[2] + (b - this.color[2]) * easing
      await sleep(2)
    }
    
    this.color[0] = r
    this.color[1] = g
    this.color[2] = b
  }

}

// FUNCTIONS FOR CONTROL BUTTONS

function handleAddNode() {
  clickMode = "addNode"
  statusText = "Add Node"
  resetColors()
}

function handleRemoveNode() {
  clickMode = "removeNode"
  statusText = "Remove Node"
  resetColors()
}

function handleRemoveEdge() {
  clickMode = "removeEdge"
  statusText = "Remove Edge"
  resetColors()
}

function handleAddEdge() {
  clickMode = "addEdge"
  statusText = "Add Edge"
  resetColors()
}

function handleMouse() {
  clickMode = "none"
  statusText = "Mouse"
}

function handleBFS() {
  clickMode = "bfs"
  statusText = "Breadth-First Search: Click on starting node to start"
  resetColors()
}

function handleDFS() {
  clickMode = "dfs"
  statusText = "Depth-First Search: Click on starting node to start"
  resetColors()
}

function handleGreedyColoring() {
  clickMode = "greedyColoring"
  statusText = "Greedy Coloring: Click on starting node to start"
  resetColors()
}

function handlePrimMST() {
  clickMode = "primMST"
  statusText = "Minimum Spanning Tree (Prim): Click on starting node to start"
  resetColors()
}

function handleDijkstraSPT() {
  clickMode = "dijkstraSPT"
  statusText = "Shortest Path Tree (Dijkstra): Click on starting node to start"
  resetColors()
}

function handleSCC() {
  graph.kosarajuSCC()
  handleMouse()
  statusText = "Running: Kosaraju's Strongly Connected Components"  
  resetColors()
  
}

//FUNCTION FOR ANIMATION SLIDER

var buttonControls = document.getElementsByClassName("controlButton");

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  //statusText = "Standby"
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  //document.getElementById("animSlider").innerHTML = output * 50
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
  //var output = 
  //output.innerHTML = slider.value; // Display the default slider value
}


//GENERAL FUNCTIONS

function moveInputField(x, y) {
  inp.position(x ,y)
  inpButton.position(x + 80,y)
}

function nodeValueSet() {
  console.log(inpValue)

  //WE CANNOT USE HAS BECAUSE WE NEED TO READ THE VALUE OF THE NODE
  for(node of nodes){
    if(node.value == inpValue){
      alert("Duplicate value")
      return
    }

  }

  editingMode = false;
  handleMouse()
  inpTarget.value = inpValue
  moveInputField(-500,-500)
}

function edgeValueSet() {
  console.log(inpValue)



  editingMode = false;
  handleMouse()
  inpTarget.value = inpValue
  moveInputField(-500,-500)
}

function resetColors() {
  for (const [nodes, edge] of edges.entries()) {
    edge.color = [255,255,255]
  }

  for(node of nodes){
    node.fillColor = [28,42,53]
    node.outlineColor = [255,255,255]
    node.label = ""
  }

  statusText2 = ""
  statusText3 = ""
}

function getEdge(u,v) {
  return(edges.get(u.value + "," + v.value))
}

function addNodeManual(value, x, y){
  let newNode = new GraphNode(x, y)
  nodes.add(newNode)
  newNode.value = value
  graph.addVertex(newNode)
  return newNode
}

function addEdgeManual(weight, u, v){

  if(edges.has(u.value + "," + v.value) || 
  edges.has(v.value + "," + u.value)){
    return
  }

  let lineType = "straight"

  if(u == v){
    lineType = "loop"
  }

  var newEdge = new Edge(u, v, lineType)
  edges.set(u.value + "," + v.value, newEdge)
  graph.addEdge(u, v)

  newEdge.value = weight
}

function loadExample() {
  graph.AdjList = new Map()
  nodes.clear()
  edges.clear()

  node1 = addNodeManual(1, 100, 300)
  node2 = addNodeManual(2, 300, 100)
  node3 = addNodeManual(3, 500, 100)
  node4 = addNodeManual(4, 700, 100)
  node5 = addNodeManual(5, 900, 300)
  node6 = addNodeManual(6, 700, 500)
  node7 = addNodeManual(7, 500, 500)
  node8 = addNodeManual(8, 300, 500)
  node9 = addNodeManual(9, 500, 300)

  addEdgeManual(4, node1, node2)
  addEdgeManual(8, node8, node1)
  addEdgeManual(8, node2, node3)
  addEdgeManual(7, node3, node4)
  addEdgeManual(9, node4, node5)
  addEdgeManual(10, node5, node6)
  addEdgeManual(14, node4, node6)
  addEdgeManual(4, node3, node6)
  addEdgeManual(2, node6, node7)
  addEdgeManual(6, node7, node9)
  addEdgeManual(1, node7, node8)
  addEdgeManual(7, node8, node9)
  addEdgeManual(11, node2, node8)
  addEdgeManual(2, node3, node9)

}



let nodes = new Set()
let edges = new Map()


let selectedNode
let startx = 0, starty = 0, endx = 0, endy = 0
let startnode = undefined, endnode = undefined

var graph = new Graph()

var statusText = "Standby"
var statusText2 = ""
var statusText3 = ""

function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  inp = createInput("")
  inp.parent("sketchHolder")
  inp.size(70)
  inp.position(-500,-500)
  inp.input(function myInputEvent() {
    inpValue = this.value()
  })

  inpButton = createButton("Set")
  inpButton.parent("sketchHolder")
  inpButton.position(-500,-500)
  inpButton.mousePressed(nodeValueSet);


  rectMode(CENTER)
  textAlign(CENTER, CENTER)
}

function draw() {
  background(28, 42, 53);

  fill(WHITE)
  noStroke()
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)
  text(statusText2, 10, 30)
  text(statusText3, 10, 50)

  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  for (const [nodes, edge] of edges.entries()) {
    edge.draw()
  }

  for(node of nodes){
    node.draw()
  }

  //tempLine
  strokeWeight(1)
  stroke(255)
  line(startx, starty, endx, endy)
}

function mousePressed() {
  if(mouseButton == LEFT && mouseY > 0){
    if(clickMode == "addNode" && editingMode == false){
      inpButton.mousePressed(nodeValueSet);
      moveInputField(mouseX,mouseY)
      var newNode = new GraphNode(mouseX, mouseY)
      nodes.add(newNode)
      editingMode = true
      graph.addVertex(newNode)
      inpTarget = newNode
    }

    else if(clickMode == "addEdge" && editingMode == false){
      inpButton.mousePressed(edgeValueSet);
      startx = mouseX
      starty = mouseY
      endx = mouseX
      endy = mouseY
      for(let node of nodes){
        startnode = node.clicked()
        if(startnode != undefined){
          break
        }
      }
    }
    else if(clickMode == "removeNode" && editingMode == false){
      let removeNode
      for (node of nodes) {
        removeNode = node.clicked()
        if(removeNode != undefined){

          for (const [nodes, edge] of edges.entries()) {
            if(edge.end == removeNode || edge.start == removeNode){
              edges.delete(edge.start.value + "," + edge.end.value)
              edges.delete(edge.end.value + "," + edge.start.value)
            }
          }
          graph.removeNode(removeNode)

          nodes.delete(removeNode)

          

          break
        }
      }
    }

    else if(clickMode == "removeEdge" && editingMode == false){
      let removeEdge
      for (const [nodes, edge] of edges.entries()) {
        removeEdge = edge.clicked()
        if(removeEdge != undefined){
          graph.removeEdge(edge.start, edge.end)

          edges.delete(edge.start.value + "," + edge.end.value)
          console.log("YES")
          break
        }
      }
    }

    else if(clickMode == "bfs" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "BFS: Running"
          graph.bfs(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "dfs" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "DFS: Running"
          graph.dfs(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "greedyColoring" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statusText = "Greedy Coloring: Running"
          graph.greedyColoring(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "primMST" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "Prim's Algo: Running"
          graph.primMST(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "dijkstraSPT" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "Dijkstra's Algo: Running"
          graph.dijkstraSPT(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "none" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.x = mouseX
          selectedNode.y = mouseY
          break
        }
      }
    }
  }
  else if(mouseButton == RIGHT && editingMode == false){
    console.log(graph.AdjList)
    console.log(edges)
  }
}

function mouseDragged(){
  if(mouseButton == LEFT && mouseY > 0 && editingMode == false){
    if(clickMode == "addEdge"){
      endx = mouseX
      endy = mouseY
    }
    else if (clickMode == "none" && editingMode == false){
      if(selectedNode != undefined){
        selectedNode.x = mouseX
        selectedNode.y = mouseY
      }
      
    }
  }
}

function mouseReleased(){
  //console.log(startnode)
  startx = 0, starty = 0, endx = 0, endy = 0

  if(mouseButton == LEFT && mouseY > 0){
    if(selectedNode != undefined){
      selectedNode.color = [255, 255, 255];
    }

    if(clickMode == "addEdge" && editingMode == false){

      for(let node of nodes){
        endnode = node.clicked()
        if(endnode != undefined){
          break
        }
      }
      if(startnode != undefined && endnode != undefined){
        if(edges.has(startnode.value + "," + endnode.value)){
          return
        }

        let lineType = "straight"

        if(startnode == endnode){
          lineType = "loop"
        }

        if(graph.AdjList.get(endnode).has(startnode)){
          console.log("CURVED")
          edges.get(endnode.value + "," + startnode.value).edgeType = "curve"
          // console.log(startnode.value + "," + endnode.value)
          // console.log(edges.get(endnode.value + "," + startnode.value))
          lineType = "curve"
        }

        //GET EDGE WEIGHT
        var midX = (startnode.x + endnode.x)/2
        var midY = (startnode.y + endnode.y)/2

        var curveDistance = 25
        var distance = sqrt(pow(startnode.y - endnode.y,2) + pow(endnode.x - startnode.x,2))
        distance = curveDistance/distance

        //MOVE POSITION
        if(lineType == "straight"){
          moveInputField((startnode.x + endnode.x)/2, (startnode.y + endnode.y)/2 - 20)
        }
        else if(lineType == "curve"){
          moveInputField(midX + distance * (startnode.y-endnode.y), midY + distance * (endnode.x-startnode.x)- 20)
        }
        else if(lineType == "loop"){
          moveInputField(startnode.x, startnode.y - curveDistance - 10)
        }

        editingMode = true
        
        var newEdge = new Edge(startnode, endnode, lineType)
        inpTarget = newEdge
        edges.set(startnode.value + "," + endnode.value, newEdge)
        graph.addEdge(startnode, endnode)
      }
      
    }
  }
}







