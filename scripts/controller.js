'use strict';

angular.module('fightingEbola', [])

.controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.notSelected = true;
  $scope.score = 0;
  var root = 0;
  var initialColor = "#9be89b";
  var queue = [];
  var last = root;
  // create an array with node
  var network, nodes, edges;
  $("#close-score").click(function () {
    $("#score-modal").modal('hide');
  });
  $.getJSON("data.json", function (data) {
    nodes = data.nodes;
    edges = data.edges;
    for (var i = 0; i < nodes.length; i++)
      $scope.score += parseInt(nodes[i].label);
    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        edges: {
          color: {
            color: "#25a583",
            highlight: "#25a583",
            inherit: false
          }
        }
      }
      // initialize your network!
    network = new vis.Network(container, data, options);
    network.on('selectNode', function (evt) {
      $scope.$apply(function () {
        $scope.notSelected = false;
        console.log($scope.notSelected);
      });
    });
    network.on('deselectNode', function (evt) {
      $scope.$apply(function () {
        $scope.notSelected = true;
        console.log($scope.notSelected);
      });
    });
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
    if (queue.length == 0)
      return;
    var u;
    do {
      u = queue.shift();
      $scope.score -= parseInt(nodes[u].label);
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

  $scope.next = function () {
    var selectedNode = network.getSelection();
    protect(selectedNode.nodes[0]);
    bfs();
    if (queue.length == 0) {
      $("#score-modal").modal('show');
      return;
    }
  }
        }]);
