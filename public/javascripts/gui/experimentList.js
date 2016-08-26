"use strict";
const DataReader = require('../data/dataReader');

/**
 * @param experU {Object}
 * @param par {Container}
 * @constructor
 */
function ExperimentList(experU, par) {
    this.parent = par;
    this.exp = [];
    for (var i = 0; i < experU.length; i++) {
        this.exp.push($.extend(new Experiment(), experU[i]));
    }
    this.model = new ExperModel(this.exp);
    this.files = document.getElementById('loadTable');
    this.files.style.cursor = "default";
    this.populateTable();

    this.loadB = document.getElementById('loadB');
    this.loadB.addEventListener('click', this.refreshTable.bind(this));

    this.selection = null;
    $('#loadTable').on('click', 'tbody tr', function(event) {
        $(this).addClass('highlight').siblings().removeClass('highlight');
    });
}

ExperimentList.prototype = {
    constructor : ExperimentList,

    handleSelect : function(row) {
        const rowInt = row.rowIndex-1;
        this.selection = null;
        if (rowInt != -1) {
            this.selection = this.model.getValueAt(rowInt, 0);
        }
    },

    getSelection : function() {
        return this.selection;
    },
    /**
     * This function is rendered useless by experimentListServer's implementation.
     * @param u {URL}
     * @returns {Array} of Experiments
     */
    parseExper : function(u) {
        const v = [];
        let buf = DataReader.readURL(u);
        const line = buf.toString().split("\\n");
        for (let i = 0; i < line.length; i++) {
            try {
                if (line[i][0] == "#") {
                    continue;
                }
                let f = DataReader.trimAll(line[i].split("\\|"));
                let sn = f.length > 3 ? f[3] : "arabidopsis";
                let at = f.length > 4 ? f[4] : null;
                v.push(new Experiment(f[0], f[1], f[2], sn, at));
            } catch (e) {
                console.error("error parsing experiment file at line: " + (i+1));
                console.error("file: " + u);
                console.error(e);
            }
        }
        return v;
    },
    populateTable : function() {
        for (var i = 0; i < this.exp.length; i++) {
            const e = this.exp[i];
            const row = document.createElement('tr');

            const nameCell = row.insertCell(0);
            const descCell = row.insertCell(1);
            const specCell = row.insertCell(2);

            const specDiv = document.createElement('div');
            const specContent = document.createElement('div');
            const spaceDiv = document.createElement('div');
            const dotSpan = document.createElement('span');

            nameCell.innerHTML = e.getFilename();
            descCell.innerHTML = e.getDesc();
            specContent.innerHTML = e.getSpecies();
            dotSpan.innerHTML = '&nbsp;';

            specContent.className = 'td-content';
            spaceDiv.className = 'spacer';
            specDiv.className = 'td-container';

            specDiv.appendChild(specContent);
            specDiv.appendChild(spaceDiv);
            specDiv.appendChild(dotSpan);
            specCell.appendChild(specDiv);

            row.id = 'experiment-' + i;

            this.parent.appendChild(row);
            row.addEventListener('click', this.handleSelect.bind(this, row));
        }
    },
    // TODO: Ensure this works.
    /**
     * This function removes any pre-existing selections when the modal is called.
     */
    refreshTable : function() {
        $('#loadTable tr').removeClass('highlight');
    }
};

function ExperModel(data) {
    this.data = data.slice();   /** {Vector<Experiment>} */
    this.titles = ["Name", "Description", "Species"];
}

ExperModel.prototype = {
    constructor : ExperModel,
    getColumnName : function(col) {
        return this.titles[col];
    },
    getRowCount : function() {
        return this.data.length;
    },
    getColumnCount : function() {
        return this.titles.length;
    },
    /**
     * @param row {int}
     * @param column {int}
     */
    getValueAt : function(row, column) {
        switch(column) {
            case 0:
                return this.data[row];
            case 1:
                return this.data[row].getDesc();
            case 2:
                return this.data[row].getSpecies();
            default:
                return "";
        }
    }
};

/**
 * @param id {String}
 * @param filename {String}
 * @param desc {String}
 * @param species {String}
 * @param attrib {String}
 * @constructor
 */
function Experiment(id, filename, desc, species, attrib) {
    this.id = id;
    this.filename = filename;
    this.desc = desc;
    this.species = species;
    this.attrib = attrib;
}

Experiment.prototype = {
    constructor : Experiment,
    getId : function() {
        return this.id;
    },
    getFilename : function() {
        return this.filename;
    },
    getDesc : function() {
        return this.desc;
    },
    getSpecies : function() {
        return this.species;
    },
    getAttribFile : function() {
        return this.attrib;
    },
    toString : function() {
        return this.id;
    }
};

module.exports = ExperimentList;