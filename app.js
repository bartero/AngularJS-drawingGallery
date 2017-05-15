"use strict";

angular.module('gallery', [])
   .controller('GalleryController', function($scope) {
      $scope.drawingWidth = 400;
      $scope.drawingHeight = 300;

      $scope.drawingFunction = {
         start: drawSquare,
         prepareCanvas: true
      }
      $scope.colors = [];
      for(let i = 0; i < 3; i++) {
         let color = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
         $scope.colors.push(color);
      }

      $scope.drawSquare = drawSquare;
      $scope.drawFractal = drawFractal;
   })
   .directive('drawing', function() {
      return {
         restrict: 'E',
         scope: {
            drawingWidth: '=',
            drawingHeight: '=',
            drawingFunction: '=',
            drawingParams: '=',
         },

         controller: function($scope, $element) {
            let parent = $element[0];
            let preparedCanvas;
            if($scope.drawingFunction.prepareCanvas) {
               preparedCanvas = document.createElement('canvas');
               parent.appendChild(preparedCanvas);
            }

            let start = $scope.drawingFunction.start;
            let stop;

            let notifySizeChanged = () => {
               if(stop) {
                  if(preparedCanvas) {
                     drawOnCanvas(preparedCanvas, stop);
                  } else {
                     stop(parent);
                  }
               }

               if(preparedCanvas) {
                  let canvas = preparedCanvas;
                  let ctx = canvas.getContext("2d");

                  canvas.width = $scope.drawingWidth;
                  canvas.height = $scope.drawingHeight;
                  stop = $scope.drawingFunction.start(ctx, canvas.width, canvas.height, $scope.drawingParams);
               } else {
                  stop = $scope.drawingFunction.start(parent, $scope.drawingWidth, $scope.drawingHeight, $scope.drawingParams);
               }
            }

            $scope.$watch('drawingWidth', function() {
               notifySizeChanged();
            });
            $scope.$watch('drawingHeight', function() {
               notifySizeChanged();
            });
         }
      };
   });


function randomInt(min, max) {
   return min + Math.floor(Math.random() * (max - min));
}

function drawSquare(ctx, width, height, params) {
   let color = params.color;
   let r = color[0];
   let g = color[1];
   let b = color[2];
   ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

   const ratio = 0.75;

   let x1 = Math.floor(((1 - ratio) / 2) * width);
   let y1 = Math.floor(((1 - ratio) / 2) * height);

   ctx.fillRect(x1, y1, Math.floor(ratio * width), Math.floor(ratio * height));

   ctx.fillStyle = "rgba(50, 150, 200, 0.8)";

   x1 = Math.floor(((1 - ratio) / 4) * width);
   y1 = Math.floor(((1 - ratio) / 4) * height);
   ctx.fillRect(x1, y1, Math.floor(ratio * width / 2), Math.floor(ratio * height) / 2);
}

function drawFractal(parent, width, height) {
   let stop;
   let s = (p) => {
      stop = () => {
         p.remove();
      }

      var tree = [];
      var x;
      var y;

      p.setup = function() {
       p.createCanvas(width, height);

       var a = p.createVector(p.width / 2, p.height);
       var b = p.createVector(p.width / 2, p.height - 50);
       var root = new Branch(a, b);
       tree[0] = root;
       for (var t = 0; t < 5; t++) {
         for (var i = tree.length-1; i >= 0; i--) {
           if (!tree[i].finished){
             tree.push(tree[i].branchA());
             tree.push(tree[i].branchB());
             tree.push(tree[i].branchC());
           }
           tree[i].finished = true;
         }
       }
     }

     p.draw = function() {
       p.background(51);
       x = p.mouseX;
       y = p.mouseY;

       for (var i = 0; i < tree.length; i++) {
         tree[i].show();
         tree[i].wind(x, y, tree[i].end.x, tree[i].end.y);
       }
     }

     function Branch(begin, end) {
       this.begin = begin;
       this.end   = end;
       this.finished = false;
       this.origx = this.end.x;
       this.origy = this.end.y;

       this.show = function() {
         p.stroke(255);
         p.line(this.begin.x, this.begin.y, this.end.x, this.end.y);
       }

       this.branchA = function() {
         var dir = p5.Vector.sub(this.end, this.begin);
         dir.rotate(19.2);
         dir.mult(0.67);
         var newEnd = p5.Vector.add(this.end, dir);

         var v = new Branch(this.end, newEnd);
         return v;
       }
       this.branchB = function() {
         var dir = p5.Vector.sub(this.end, this.begin);
         dir.rotate(0);
         dir.mult(0.67);
         var newEnd = p5.Vector.add(this.end, dir);

         var v = new Branch(this.end, newEnd);
         return v;
       }
       this.branchC = function() {
         var dir = p5.Vector.sub(this.end, this.begin);
         dir.rotate(-19.2);
         dir.mult(0.67);
         var newEnd = p5.Vector.add(this.end, dir);

         var v = new Branch(this.end, newEnd);
         return v;
       }
       this.wind = function(mox,moy,treex,treey) {
             var d = p.dist(mox,moy,treex,treey);

             if (d < 20) {
               this.end.x += p.random(-0.3, 0.3);
               this.end.y += p.random(-0.3, 0.3);
             }else{

               this.end.x = this.origx;
               this.end.y = this.origy;

             }
         }
     }
   };

   new p5(s, parent);

   return stop;
}
