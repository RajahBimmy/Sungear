/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 *
 * @author RajahBimmy
 */

const Icons = require('./gui/sungear/icons');
const SunGear = require('./gui/sunGear');

const p5 = require('p5');
const VisGene = require('./app/visGene');

var args = [ "" ];

var hereWeGo = new p5(function(p5) {
    var WIDTH;
    var HEIGHT;
    var canvas;
    var vis;
    
    p5.setup = function() {
        WIDTH = document.getElementById('sungearGui').offsetWidth;
        HEIGHT = document.getElementById('sungearGui').offsetHeight;
        canvas = p5.createCanvas(WIDTH,HEIGHT);
        p5.frameRate(30);
        p5.textSize(30);
        p5.textAlign(p5.CENTER);
        vis = VisGene.main(args);
    };
    p5.draw = function() {
        p5.background("#111111");
        var visuals = vis.getSunGearVisuals();
        for (var i = 0; i < visuals.length; i++) {
            var visual = visuals[i];
            var visFunction = visual.drawFunction;
            if (visual.draw) {
                visFunction(p5, visual.params);
            }
        }
    };

    p5.mouseReleased = function() {
        // TODO: Increment the VesselMinIcon on Press?
    };

}, 'sungearGui');