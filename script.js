var root = 0;
var initialColor = "#9be89b";
var queue = [];
var last = root;
// create an array with node
var network, nodes, edges;


$.getJSON("data.json", function (data) {
  nodes = data.nodes;
  edges = data.edges;
  // create a network
  var container = document.getElementById('mynetwork');
  var options = {
    edges: {
      color : {
        color: "#25a583",
        highlight: "#25a583",
        inherit: false
      }
    }
  }
    // initialize your network!
  network = new vis.Network(container, data, options);
  infect(root);
});

function protect(nodeId) {
  if (nodes[nodeId].processed)
    return;
  var node = network.body.data.nodes.get(nodeId);
  node.color = '#2b9d2b';
  network.body.data.nodes.update(node);
  nodes[nodeId].processed = true;
}

function infect(nodeId) {
  var node = network.body.data.nodes.get(nodeId);
  node.color = '#d9534f';
  network.body.data.nodes.update(node);
  nodes[nodeId].processed = true;
  queue.push(nodeId);
}

function bfs() {
  var u;
  do {
    u = queue.shift();
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      if (edge.from == u || edge.to == u) {
        var v;
        if (edge.from == u)
          v = edge.to;
        else
          v = edge.from;
        if (nodes[v].processed == false)
          infect(v);
      }
    }
  } while (u != last);
  last = queue[queue.length - 1];
}

function next() {
  var selectedNode = network.getSelection();
  protect(selectedNode.nodes[0]);
  bfs();
}
