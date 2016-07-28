/**
 * The Controls class contains the buttons which belong to the controlF panel.
 * They then call actions on a given GeneList
 */

var MultiSelectable = require('../genes/multiSelectable');
var GeneEvent = require('../genes/geneEvent');

/**
 * @param gn {GeneList}
 * @param el {ExportList}
 * @constructor
 */
function Controls(gn, el) {
    this.genes = gn;
    this.gear = null;
    this.export = el;
    this.coolMethod = 0;
    this.cool = []; /** {Comp.CoolVessel[]} */

    this.restartB = document.getElementById('restartB');
    this.restartB.title = "Work with the original active set";
    this.restartB.addEventListener("click", this.runRestart.bind(this));
    this.restartB.className = Controls.ENABLED;

    this.allB = document.getElementById('allB');
    this.allB.title = "Select all items";
    this.allB.addEventListener("click", this.runAll.bind(this));
    this.allB.className = Controls.ENABLED;

    this.noneB = document.getElementById('noneB');
    this.noneB.title = "Unselect all items";
    this.noneB.addEventListener("click", this.runNone.bind(this));
    this.noneB.className = Controls.ENABLED;

    this.backB = document.getElementById('backB');
    this.backB.title = "Go back to the previous selected set";
    this.backB.addEventListener("click", this.runBack.bind(this));
    this.backB.className = Controls.DISABLED;

    this.forwardB = document.getElementById('forwardB');
    this.forwardB.title = "Go forward to the next selected set";
    this.forwardB.addEventListener("click", this.runForward.bind(this));
    this.forwardB.className = Controls.DISABLED;

    this.narrowB = document.getElementById('narrowB');
    this.narrowB.title = "Restrict the active set to the current selected set";
    this.narrowB.addEventListener("click", this.runNarrow.bind(this));
    this.narrowB.className = Controls.ENABLED;
    
    this.unionB = document.getElementById('unionB');
    this.unionB.title = "Set the selected set to the union of all selected items";
    this.unionB.addEventListener("click", this.runUnion.bind(this));
    this.unionB.className = Controls.DISABLED;

    this.intersectB = document.getElementById('intersectB');
    this.intersectB.title = "Set the selected set to the intersect of all selected items";
    this.intersectB.addEventListener("click", this.runIntersect.bind(this));
    this.intersectB.className = Controls.DISABLED;

    this.coolM = document.getElementById('coolM');
    this.coolB = document.getElementById('coolB');
    this.coolB.addEventListener("click", this.runCool.bind(this));
    this.coolB.className = Controls.ENABLED;
    this.genes.addGeneListener(this);
}

Controls.ENABLED = "btn btn-primary";
Controls.DISABLED = "btn btn-primary disabled";

Controls.prototype = {
    constructor : Controls,
    cleanup : function() {
        this.genes = null;
        this.cool = null;
    },
    getPreferredSize : function() {
        // TODO: Implement? May be unnecessary.
    },
    setCoolState : function() {
        if (this.cool === null) {
            this.coolB.className = Controls.ENABLED;
            this.coolB.innerHTML = "Find Cool";
            this.coolB.title = "Search for highly over-represented vessels";
        } else if (this.cool.length == 0) {
            this.coolB.className = Controls.DISABLED;
            this.coolB.innerHTML = "Nothing Cool";
            this.coolB.title = "No cool vessels";
        } else {
            this.coolB.className = Controls.ENABLED;
            this.coolB.innerHTML = "Show Cool";
            this.coolB.title = "Show the list of highly over-represented vessels";
        }
    },
    getCachedCool : function() {
        var v = this.export.get().getExtra(this); // TODO: Ensure this works.
        var cc = null;
        if (v !== null && v.length > this.coolMethod) {
            cc = v[this.coolMethod];
        }
        return cc;
    },
    /**
     * @param m {int}
     */
    setCoolMethod : function(m) {
        this.coolMethod = m;
        this.cool = null;
        this.updateCool(false);
    },
    updateCool : function(load) {
        if (this.gear !== null && this.gear.get() !== null) {
            this.cool = this.getCachedCool();
            if (this.cool === null && load) {
                switch(this.coolMethod) {
                    // TODO: @Dennis find out what is going on here.
                    case 1:
                        this.cool = this.gear.get().getCool(3, -1000, 1);
                        break;
                    case 2:
                        this.cool = this.gear.get().getCool(3, 5, 1);
                        break;
                    default:
                        this.cool = this.gear.get().getCool(3, 10, 0);
                }
                this.addCachedCool();
            }
        }
        while (this.coolM.firstChild) {
            this.coolM.removeChild(this.coolM.firstChild);
        }
        this.setCoolState();
        if (this.cool !== null && this.cool.length > 0) {
            // TODO: Figure out lines 208 - 219
        }
    },
    setGear : function(gear) {
        this.gear = gear;
    },
    setActions : function(comp) {
        // TODO: Implement this last.
    },
    removeBindingFully : function(comp, key) {
        // TODO: Implement this later.
    },
    updateGUI : function() {
        var iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.allB.title = "Select all " + iL;
        this.noneB.title = "Unselect all " + iL;
    },
    listUpdated : function(e) {
        switch(e.getType()) {
            case GeneEvent.NEW_LIST:
                this.updateGUI();
                break;
            case GeneEvent.RESTART:
                break;
            case GeneEvent.NARROW:
                this.cool = null;
                this.updateCool(false);
                break;
            case GeneEvent.SELECT:
                if (this.genes.hasPrev()) {
                    this.backB.className = Controls.ENABLED;
                } else {
                    this.backB.className = Controls.DISABLED;
                }
                if (this.genes.hasNext()) {
                    this.forwardB.className = Controls.ENABLED;
                } else {
                    this.forwardB.className = Controls.DISABLED;
                }
                break;
            case GeneEvent.MULTI_START:
                this.unionB.className = Controls.ENABLED;
                this.intersectB.className = Controls.ENABLED;
                break;
            case GeneEvent.MULTI_FINISH:
                this.unionB.className = Controls.DISABLED;
                this.intersectB.className = Controls.DISABLED;
                break;
        }
    },
    runRestart : function() {
        this.genes.restart(this);
    },
    runAll : function() {
        this.genes.setSelection(this, this.genes.getActiveSet());
    },
    runNone : function() {
        this.genes.setSelection(this, new TreeSet());
    },
    runBack : function() {
        this.genes.back(this);
    },
    runForward : function() {
        this.genes.forward(this);
    },
    runNarrow : function() {
        this.genes.narrow(this);
    },
    runUnion : function() {
        this.genes.finishMultiSelect(this, MultiSelectable.UNION);
    },
    runIntersect : function() {
        this.genes.finishMultiSelect(this, MultiSelectable.INTERSECT);
    },
    runCool : function() {
        if (this.cool === null) {
            this.updateCool(true);
            if (this.cool.length == 0) {
                alert("No cool vessels found - try narrowing or restarting.");
            }
        }
        if (this.cool.length > 0) {
            // TODO: Set coolM to visible.
        }
    }
};

module.exports = Controls;