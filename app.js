"use strict";

angular.module('gallery', [])
   .controller('GalleryController', function($scope) {
      $scope.drawingWidth = 400;
      $scope.drawingHeight = 300;

      $scope.drawingFunction = {
         start: drawSquare
      }
      $scope.colors = [];
      for(let i = 0; i < 3; i++) {
         let color = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
         $scope.colors.push(color);
      }

      $scope.drawSquare = drawSquare;
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
            let canvas = $element[0];

            let start = $scope.drawingFunction.start;
            let stop;

            let notifySizeChanged = () => {
               if(stop) {
                  drawOnCanvas(canvas, stop);
               }

               stop = drawOnCanvas(canvas, $scope.drawingWidth, $scope.drawingHeight, $scope.drawingFunction.start, $scope.drawingParams);
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

function drawOnCanvas(canvas, width, height, f, drawingParams) {
   let ctx = canvas.getContext("2d");
   canvas.width = width;
   canvas.height = height;
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
