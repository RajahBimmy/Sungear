/**
 * Created 2016.07.07
 * @author RajahBimmy
 * I will laugh if this works.
 */

const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const url = require('url');
const request = require('request');

require('javascript.util');
const Iterator = javascript.util.Iterator;
const SortedSet = javascript.util.SortedSet;
const TreeSet = javascript.util.TreeSet;

var Anchor = require('../genes/anchor');
var Gene = require('../genes/gene');
var Term = require('../genes/term');
var Vessel = require('../genes/vessel');

/**
 * Constructs a new master data reader.
 * @param attrib {Attributes}
 * @constructor
 */
function DataReader(attrib) {
    this.attrib = attrib;
    this.clear();
}

DataReader.SEP = "\\t|\\|";
DataReader.FSEP = ",| ";
DataReader.NVSEP = "=";

DataReader.prototype = {
    constructor : DataReader,

    clear : function() {
        this.allGenes = null;
        this.terms = null;
        this.roots = null;
        this.geneToGo = null;
        this.anchors = null;
        this.expGenes = null;
    },
    /**
     * @param attrib {Attributes}
     * */
    setAttrib : function(attrib) {
        this.attrib = attrib;
    },
    /**
     * @param geneU {URL}
     * @param listU {URL}
     * @param hierU {URL}
     * @param assocU {URL}
     * @param sungearU {URL}
     */
    readAll : function(geneU, listU, hierU, assocU, sungearU) {
        this.readGenes(geneU);
        this.readTerms(listU);
        this.readHierarchy(hierU);
        this.readGeneToGo(assocU);
        this.readSungear(sungearU);
    },
    /**
     * @param geneU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param a {Attributes}
     */
    readGenes : function(geneU, genes, a) {
        if (typeof genes == 'undefined') {
            this.allGenes = {};
            this.readGenes(geneU, this.allGenes, this.attrib);
        } else {
            var iN = this.openURL(geneU);
        }

    },
    /**
     * @param listU {URL}
     * @param terms {Hashtable<String, Term>}
     * @param a {Attributes}
     */
    readTerms : function(listU, terms, a) {
        if (typeof terms == 'undefined') {
            this.terms = {};
            this.readTerms(listU, this.terms, this.attrib);
        } else {

        }
    },
    /**
     * @param hierU {URL}
     * @param terms {Hashtable<String, Term>}
     * @param rootsV {Vector<Term>}
     * @param a {Attributes}
     */
    readHierarchy : function(hierU, terms, rootsV, a) {
        if (typeof terms == 'undefined') {
            this.roots = [];
            this.readHierarchy(hierU, this.terms, this.roots, this.attrib);
        } else {

        }
    },
    /**
     * @param assocU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param terms {Hashtable<String, Term>}
     * @param geneToGo {Hashtable<Gene, Vector<Term>>}
     * @param a {Attributes}
     */
    readGeneToGo : function(assocU, genes, terms, geneToGo, a) {
        if (typeof genes == 'undefined') {
            this.geneToGo = {};
            this.readGeneToGo(assocU, this.allGenes, this.terms, this.geneToGo, this.attrib);
        } else {

        }
    },
    /**
     * @param sungearU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param anchors {Vector<Anchor>}
     * @param expGenes {SortedSet<Gene>}
     * @param missingGenes {SortedSet<String>}
     * @param dupGenes {SortedSet<Gene>}
     * @param a {Attributes}
     */
    readSungear : function(sungearU, genes, anchors, expGenes, missingGenes, dupGenes, a) {
        if (typeof genes == 'undefined') {
            this.anchors = [];
            this.expGenes = new TreeSet();
            this.missingGenes = new TreeSet();
            this.dupGenes = new TreeSet();
            this.readSungear(sungearU, this.allGenes, this.anchors, this.expGenes, this.missingGenes, this.dupGenes, this.attrib);
        } else {

        }
    },

    // NOTE: setThreshold has moved to the static area.

    // NOTE: trimALl has moved to the static area.
    /**
     * Chops a StringBuffer into an array of lines.
     * @param b the data to separate into lines
     * @return Array array of separated lines
     */
    chop : function(b) {
        return b.toString().split("\\n");
    },

    // NOTE: openURL has moved to the static area.
    // NOTE: readURL has moved to the static area.
    /**
     * Reads the header of a file into a StringBuffer.
     * @param u the URL of the file to read
     * @return the read text
     * @throws IOException
     */
    readHeader : function(u) {
        // TODO: @Dennis Implement
    },

    getResource : function(s) {
        // TODO: @Dennis Implement
    },

    parseHeader : function(){
        // TODO: @Dennis Implement
        var comment = "";
        var line = "";
    }
};

// STATIC AREA:

DataReader.openURL = function(u, callback) {
    console.log("Opening: " + u);
    var stream = null;
    try {
        var req = request.get(u);
        req.on('response', function(res) {
            var chunks = [];
            res.on('data', function(chunk) {
                console.log("Pushing data");
                chunks.push(chunk);
            });
            res.on('end', function() {
                console.log("Finished!");
                var buffer = Buffer.concat(chunks);
                console.log(res.headers);
                var encoding = res.headers['content-encoding'];
                if (typeof encoding === 'undefined') {
                    encoding = res.headers['content-type'];
                }
                if (encoding.indexOf('gzip') > -1) {
                    console.log("Unzipping...");
                    zlib.gunzip(buffer, function(err, decoded) {
                        console.log(decoded);
                        if (err) {
                            console.log("Error :(");
                            console.log(err);
                        } else {
                            console.log(decoded.toString());
                        }
                        callback();
                    });
                }
            })
        });
        req.on('error', function(err) {
            console.log("error :(");
            console.log(err);
            callback();
        });
    } catch (e) {
        callback(e);
    }
};
/**
 * Reads the entire text contents of a URL into a StringBuffer.
 * @param u {URL}
 * @return
 * @throws IOException
 */
DataReader.readURL = function(u, callback) {
    console.log("reading: " + u);
    var buf = new Buffer(5242880); // 5 MB - Lord hear our prayer.
    fs.open(u, 'r', function(err, fd) {
        if (err) {
            console.log(err);
        }
        console.log("File opened successfully!");
        console.log("Going to read the file");
        fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
            if (err){
                console.log(err);
            }
            console.log(bytes + " bytes read");

            // Print only read bytes to avoid junk.
            if(bytes > 0){
                 callback(buf.slice(0, bytes));
            }
        });
    });
};

/**
 * @param base {URL}
 * @param s {String}
 * @return {URL}
 */
DataReader.makeURL = function(base, s) {
    var u;
    try {
        u = new URL(s);
    } catch(mu) {
        try {
            u = new URL(s, base);
        } catch (mu2) {
            // This should be impossible because Mewtwo is hard as fuck to catch in the original games /s
            u = url.resolve(base, s);
        }
    }
    return u;
};

/**
 * Updates vessel membership based on the provided threshold value.
 * @param t {float} threshold for vessel inclusion
 * @param expGenes {SortedSet<Gene>} all genes in the experiment set
 * @param anchors {Vector<Anchor>} experiment anchors (static)
 * @param vessels {Vector<Vessel>} updated vessels are placed here
 */
DataReader.setThreshold = function(t, expGenes, anchors, vessels) {
    var m = "";
    var last = "";
    var vh = {};
    var curr = null;
    for (var it = expGenes.iterator(); it.hasNext(); ) {
        var g = it.next();
        var e = g.getExp();
        for (var i = 0; i < e.length; i++) {
            if (e[i] < t) {
                m += "0";
            } else {
                m += "1";
            }
        }
        var sig = m;    // May be redundant
        if (m != last) {
            curr = vh[sig];
            if (curr === null) {
                var va = [];
                for (var j = 0; j < sig.length; j++) {
                    if (sig[j] == "1") {
                        va.push(anchors[j]);
                    }
                }
                curr = new Vessel(va);
                vessels.push(curr);
                vh[sig] = curr;
            }
            last = sig;
        }
        curr.addGene(g);
    }
};

/**
 * Trims all the elements of an array of Strings, and returns the result.
 * The original array's contents are not modified.
 * @param s the array of Strings to trim
 * @return {Array} of trimmed Strings
 */
DataReader.trimAll = function(s) {
    var r = []; /** {String[]} */
    for (var i = 0; i < s.length; i++) {
        r[i] = s[i].trim();
    }
    return r;
};

DataReader.testRequest = function(callback) {
    var buffer = [];
    var toGo = url.parse("http://virtualplant.bio.nyu.edu/virtualplant2/biovis2/data/annot_human.txt");
    toGo.encoding = null;
    toGo.url = "http://virtualplant.bio.nyu.edu/virtualplant2/biovis2/data/annot_human.txt";
    console.log(toGo);
    var req = request.get(toGo);
    req.on('response', function(res) {
        var chunks = [];
        res.on('data', function(chunk) {
            console.log("Pushing data");
            chunks.push(chunk);
        });
        res.on('end', function() {
            console.log("Finished!");
            var buffer = Buffer.concat(chunks);
            console.log(res.headers);
            var encoding = res.headers['content-encoding'];
            if (typeof encoding === 'undefined') {
                encoding = res.headers['content-type'];
            }
            if (encoding.indexOf('gzip') > -1) {
                console.log("Unzipping...");
                zlib.gunzip(buffer, function(err, decoded) {
                    console.log(decoded);
                    if (err) {
                        console.log("Error :(");
                        console.log(err);
                    } else {
                        console.log(decoded.toString());
                    }
                    callback();
                });
            } else {
                console.log(chunks.toString());
            }
        })
    });
    req.on('error', function(err) {
        console.log("error :(");
        console.log(err);
        callback();
    });
};

module.exports = DataReader;