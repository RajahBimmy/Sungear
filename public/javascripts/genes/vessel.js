"use strict";
/**
 * @author RajahBimmy
 */

const SortedSet = require('collections/sorted-set');

/** @param anchor {Array} of Anchors */
function Vessel(anchor) {
    this.anchor = anchor.sort();
    this.genes = new SortedSet();
}

Vessel.prototype = {
    constructor : Vessel,
    toString : function(){
        let s = "";
        for(let i = 0; i < this.anchor.length; i++) {
            s += (i > 0 ? " | " : "") + this.anchor[i].name;
        }
        return s;
    },
    cleanup : function() {
        this.genes = null;
        this.anchor = null;
    },
    /** @param g {Gene} */
    addGene : function(g) {
        this.genes.push(g);
    },
    getFullCount : function() {
        return this.genes.length;
    }
};

module.exports = Vessel;