const easing = 0.05
const controlsHeight = document.getElementById("controlPanel").offsetHeight 


var clickMode = "none"
var inp, inpButton, inpValue, inpTarget
var tempTransition
var stringValue = ""
var keyPress
var editingMode = false


//COLORS
let YELLOW = [255, 242, 0]
let WHITE = [255,255,255]

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
    this.color = [255,255,255]
    
  }
  draw(){
    fill(28, 42, 53);
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
  }
  clicked(){
    if(!editingMode){
      if(mouseX > this.x - this.size/2 && mouseX < this.x + this.size/2 && mouseY > this.y - this.size/2 && mouseY < this.y + this.size/2){
        console.log("clicked")
        return this
      }
    }
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

    //REMOVE TEXT FOR UNWEIGHTED GRAPHS

    // textSize(12)

    // //control transition labels
    
    // if(this.edgeType == "straight"){
    //   text(this.value, (this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2 - 20)
    // }
    // else if(this.edgeType == "curve"){
    //   text(this.value, midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x)- 20)
    // }
    // else if(this.edgeType == "loop"){
    //   text(this.value, this.start.x, this.start.y - curveDistance - 10)
    // }
    
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
}

function keyPressed() {
  if (keyCode === ENTER) {
    console.log("Enter")
    keyPress = "Enter"
  }
}

function keyReleased() {
  keyPress = null
}

function handleAddNode() {
  clickMode = "addNode"
  statusText = "Add Node"
}


function handleRemoveNode() {
  clickMode = "removeNode"
  statusText = "Remove Node"
}

function handleRemoveEdge() {
  clickMode = "removeEdge"
  statusText = "Remove Edge"
}

function handleAddEdge() {
  clickMode = "addEdge"
  statusText = "Add Edge"
}

function handleMouse() {
  clickMode = "none"
  statusText = "Mouse"
}

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


let nodes = new Set()
let edges = new Map()


let selectedNode
let startx = 0, starty = 0, endx = 0, endy = 0
let startnode = undefined, endnode = undefined

var graph = new Graph()

var statusText = "Standby"

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

  //moveInputField(100,100)

  rectMode(CENTER)
  textAlign(CENTER, CENTER)
}

function draw() {
  background(28, 42, 53);

  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  for (const [nodes, edge] of edges.entries()) {
    edge.draw()
  }

  for(node of nodes){
    node.draw()
  }

  graph.draw()

  fill(WHITE)
  noStroke()
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)

  //tempLine
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

        //DISABLED FOR UNWEIGHTED

        // //GET EDGE WEIGHT
        // var midX = (startnode.x + endnode.x)/2
        // var midY = (startnode.y + endnode.y)/2

        // var curveDistance = 25
        // var distance = sqrt(pow(startnode.y - endnode.y,2) + pow(endnode.x - startnode.x,2))
        // distance = curveDistance/distance

        // //MOVE POSITION
        // if(lineType == "straight"){
        //   moveInputField((startnode.x + endnode.x)/2, (startnode.y + endnode.y)/2 - 20)
        // }
        // else if(lineType == "curve"){
        //   moveInputField(midX + distance * (startnode.y-endnode.y), midY + distance * (endnode.x-startnode.x)- 20)
        // }
        // else if(lineType == "loop"){
        //   moveInputField(startnode.x, startnode.y - curveDistance - 10)
        // }

        // editingMode = true
        
        var newEdge = new Edge(startnode, endnode, lineType)
        //inpTarget = newEdge
        edges.set(startnode.value + "," + endnode.value, newEdge)
        graph.addEdge(startnode, endnode)
      }
      
    }
  }
}







