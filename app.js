"use strict";

angular.module('gallery', [])
   .controller('GalleryController', function($scope) {
      $scope.drawingWidth = 400;
      $scope.drawingHeight = 300;

      $scope.drawingFunction = {
         start: drawSquare,
         stop: undefined
      }
      $scope.colors = [];
      for(let i = 0; i < 9; i++) {
         let color = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
         $scope.colors.push(color);
      }
   })
   .directive('drawing', function() {
      return {
         template: '<canvas></canvas>',
         replace: true,
         restrict: 'E',
         scope: {
            drawingWidth: '=',
            drawingHeight: '=',
            drawingFunction: '=',
            drawingParams: '=',
         },

         controller: function($scope, $element) {
            let canvas = $element[0];//.getElementsByTagName('canvas')[0];

            let canvasSizeChanged = () => {
               if($scope.drawingFunction.stop) {
                  drawOnCanvas(canvas, $scope.drawingFunction.stop);
               }

               canvas.width = $scope.drawingWidth;
               canvas.height = $scope.drawingHeight;
               console.log('drawingWidth: ' + $scope.drawingWidth + ', drawingHeight: ' + $scope.drawingHeight);

               drawOnCanvas(canvas, $scope.drawingFunction.start, $scope.drawingParams);
            }
            $scope.canvasSizeChanged = canvasSizeChanged;
            $scope.$watch('drawingWidth', function() {
               canvasSizeChanged();
            });
            $scope.$watch('drawingHeight', function() {
               canvasSizeChanged();
            });
         }
      };
   });


function randomInt(min, max) {
   return min + Math.floor(Math.random() * (max - min));
}


function test(a, b, c) {
   console.log('a: ' + a + ', b: ' + b +', c: ' + c);
}

function drawOnCanvas(canvas, f, drawingParams) {
   var ctx = canvas.getContext("2d");
   f(ctx, canvas.width, canvas.height, drawingParams);
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
