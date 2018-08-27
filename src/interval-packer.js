/**
 * This file handles what is around interval packing and algorithm
 * It contains:
 *  * IntervalPacking POJO
 *  * IntervalPacker the algo to pack intervals
 */

/**
 * A list of intervals with a IntervalPacking.tagName => {start:number, end:number, lane:number}
 * The constructor is typically called with an empty list of argument and populated later
 * @param lanes (Array<Array<object>> | undefined) where each of them contains a list of not overlapping intervals. No check is done on the overlapping within this POJO
 * @param min (number|undefined) the minimum position
 * @param max (number|undefined) the maximum position
 * @param maxPosPerLane (Array<number>|undefined) the maximum position per lane
 * @constructor
 */
function IntervalPacking(lanes, min, max, maxPosPerLane) {
    this._lanes = lanes || [];
    this._maxPosPerLane = maxPosPerLane || [];
    this._min = (min === undefined) ? Number.MAX_SAFE_INTEGER : min;
    this._max = (max === undefined) ? Number.MIN_SAFE_INTEGER : max;
}

IntervalPacking.tagName = '_intPack';


/**
 * add an an object, by cloning it and enirchin a submap with start/end/lane
 * It also update the number of lanes
 *
 * @param obj to be positioned (will be cloned (not deep)
 * @param start transformed start position
 * @param end transformed end position
 * @param lane in which to add the interval
 *
 * @return this
 */
IntervalPacking.prototype.add = function (obj, start, end, lane) {
    if (this._lanes[lane] === undefined) {
        this._lanes[lane] = [];
        this._maxPosPerLane[lane] = Number.MIN_SAFE_INTEGER;
    }
    const tObj = _.clone(obj);
    tObj[IntervalPacking.tagName] = {
        start: start,
        end: end,
        lane: lane
    };
    this._lanes[lane].push(tObj);

    this._min = Math.min(this._min, start);
    this._max = Math.max(this._max, end);
    this._maxPosPerLane[lane] = Math.max(this._maxPosPerLane[lane], end);
    return this;
};

IntervalPacking.prototype.get = function (lane, i) {
    return this._lanes[lane][i];
};

/**
 * the count of intervals
 * @return {number}
 */
IntervalPacking.prototype.size = function () {
    return _.chain(this._lanes)
        .map((l) => l ? l.length : 0)
        .sum()
        .value();
};

/**
 * the overall minimum position
 * @return {number}
 */
IntervalPacking.prototype.min = function () {
    return this._min;
};

/**
 * the overall maximum position
 * @return {number}
 */
IntervalPacking.prototype.max = function () {
    return this._max;
};

/**
 * @param i {int|undefined}
 * @return {int|Array} the upper position for a given lane ar an array with all the upper positions
 */
IntervalPacking.prototype.maxPosPerLane = function (i) {

    return (i === undefined) ? this._maxPosPerLane : this._maxPosPerLane[i];
};

/**
 * the list of all intervals
 * @return {Array<Array<object>>}
 */
IntervalPacking.prototype.list = function () {
    return _.flatten(this._lanes);
};

/**
 * Return the list of lanes
 * @return {*}
 */
IntervalPacking.prototype.lanes = function () {
    return this._lanes;
};

/**
 * the number of lanes in which there are intervals
 * @return {*}
 */
IntervalPacking.prototype.nbLanes = function () {
    return this._lanes.length;
};

/**
 * copy the object, by cloning the list of intervals
 * @return {IntervalPacking}
 */
IntervalPacking.prototype.clone = function () {
    return new IntervalPacking(_.map(this._lanes, (l) => l.slice(0)), this._min, this._max, this._maxPosPerLane.slice(0));
};

/**
 * converting the IntervalPacking into a string.
 * Each interval is associated with a character, either via the fChar function applied to each element, or a letter, increasing for each new character
 * @param fChar
 * @return {string}
 */
IntervalPacking.prototype.toString = function (fChar) {
    let buf = '';
    let iChar = 'a';


    _.chain(this._lanes)
        .each((lane) => {
            if (buf !== '') {
                buf += '\n';
            }

            let iPos = this.min() - 1;
            _.chain(lane)
                .sortBy(IntervalPacking.tagName + '.start')
                .each((el) => {
                    const interv = el[IntervalPacking.tagName];
                    if (interv.start <= iPos) {
                        throw `new element ${JSON.stringify(interv)} steps on the previous on ${iPos}`;
                    }
                    buf += '.'.repeat(interv.start - iPos - 1);
                    let char;
                    if (fChar === undefined) {
                        char = iChar;
                        iChar = String.fromCharCode(iChar.charCodeAt(0) + 1);
                    } else {
                        char = fChar(el)
                    }
                    buf += char.repeat(interv.end + 1 - interv.start);
                    iPos = interv.end;
                })
                .value();
            buf += '.'.repeat(this.max() - iPos);

        })
        .value();

    return buf;
};


/**
 *
 * From a list of object, from which start/end position can be extracted, will build an IntervalPacking object by adding a lane information to each object.
 *
 * @param lowerBoundToInt
 * @param upperBoundToInt
 * @param options
 * @constructor
 */
function IntervalPacker(lowerBoundToInt, upperBoundToInt, options) {
    options = options || {};

    this._lowerBoundToInt = lowerBoundToInt;
    this._upperBoundToInt = upperBoundToInt;
    this._minGap = options.minGap || 0;

}

/**
 * create and IntervalPacking object, by optimizing the position
 * @param beans {Array<object>} the list of object to be map to segments
 * @param method (topFirst|enlargeSpacgin) the method used to distribute the segment
 *  * topFirst: put the segment at the topest possible possible
 *  * balanceSpacing: minimize the spacing variance to try to evenly distribute
 *  @param options {object} packer options
 */
IntervalPacker.prototype.pack = function (beans, method = 'topFirst', options) {
    const segments = _.sortBy(this.computePositions(beans), (bs) => bs.segment.start);

    let packerAlgo;
    switch (method) {
        case 'topFirst':
            packerAlgo = intervalPackerAlgoTopFirst;
            break;
        case 'balanceSpacing':
            packerAlgo = intervalPackerAlgoBalanceSpacing;
            break;
        default:
            throw 'no defined packing algorithm for method [' + method + ']';
    }
    return packerAlgo.pack(segments, options);
};

/**
 * get positions computed with the transform function for all object
 * applying lowerBoundToInt/upperBoundToInt function passed to the contructor
 * @param oSegments
 */
IntervalPacker.prototype.computePositions = function (oSegments) {
    return _.map(oSegments, (s) => {
        return {
            bean: s,
            segment: {
                start: this._lowerBoundToInt(s),
                end: this._upperBoundToInt(s) + this._minGap
            }
        }
    })
};


/**
 * Pack segment by trying to fit each new one in the topper lane possible
 * we assume the beanSegments are sorted by start position
 * @param beanSegments
 */
intervalPackerAlgoTopFirst = {

    pack: function (beanSegments, options) {
        options = options || {};
        const packing = new IntervalPacking();
        const lastPerLine = [];
        _.each(beanSegments, (bs) => {
            let lane = _.findIndex(lastPerLine, (p) => bs.segment.start > p);
            if (lane === -1) {
                lane = packing.nbLanes();
            }
            lastPerLine[lane] = bs.segment.end;
            packing.add(bs.bean, bs.segment.start, bs.segment.end, lane);
        });
        options.callbackLocalOptimal && options.callbackLocalOptimal(packing);
        return packing;
    }
};

const stats = {
    mean: (values) => {
        if (values.length === 0) {
            return NaN;
        }
        return _.sum(values) / values.length;
    },
    variance: (values) => {
        if (values.length <= 1) {
            return NaN;
        }
        const mean = stats.mean(values);
        return _.chain(values)
            .map((v)=>(v-mean)**2)
            .sum()
            .value() / (values.length-1);
    },
    median: (values) => {
        if (values.length === 0) {
            return NaN;
        }
        const sValues = values.sort();
        const l = sValues.length;
        if (l % 2 === 0) {
            return (sValues[l / 2 - 1] + sValues[l / 2]) / 2;
        }
        return sValues[(l - 1) / 2];
    },
};

/**
 * Pack segments, trying to balance spacing between intervals
 * we assume the beanSegments are sorted by start position
 * @param beanSegments
 */
intervalPackerAlgoBalanceSpacing = {
    scoreInit: {
        nbLanes: Number.MAX_SAFE_INTEGER,
        spacing: NaN
    },

    computeScore: function (ip) {
        //the score is computed as the median of interspace.
        //We don't count 0 size intersapce if they touch min() of max() of the overall domain
        const interSpaces = [];
        _.chain(ip.lanes())
            .each((lane) => {
                let prevEnd = ip.min();
                _.chain(lane)
                    .map(IntervalPacking.tagName)
                    .each((interv, i) => {
                        if (i === 0 && interv.start === ip.min()) {
                            //shall not count an 0 interspace if it starts at the begining of the lane
                            prevEnd = interv.end;
                            return;
                        }
                        interSpaces.push(interv.start - prevEnd);
                        prevEnd = interv.end;
                    })
                    .value();
                if (prevEnd < ip.max()) {
                    interSpaces.push(ip.max() - prevEnd)
                }
            })
            .value();

        const variance = stats.variance(interSpaces);
        return {
            nbLanes: ip.nbLanes(),
            spacing: variance
        }
    },
    isBetterScore: function (score, compareTo) {
        if (score.nbLanes < compareTo.nbLanes) {
            return true;
        }
        if (score.nbLanes > compareTo.nbLanes) {
            return false;
        }
        if (_.isNaN(score.spacing )) {
            return true;
        }
        if (_.isNaN(compareTo.spacing)) {
            return false;
        }
        return score.spacing < compareTo.spacing

    },
    pack: function (beanSegments, options) {
        options = options || {};
        let bestScore = intervalPackerAlgoBalanceSpacing.scoreInit;
        let bestPacking = undefined;

        const fHandler = (intPacking, remainSegments) => {

            if (remainSegments.length === 0) {
                const score = intervalPackerAlgoBalanceSpacing.computeScore(intPacking);
                options.callbackCandidate && options.callbackCandidate(intPacking, score);

                if (intervalPackerAlgoBalanceSpacing.isBetterScore(score, bestScore)) {
                    bestScore = score;
                    bestPacking = intPacking;
                    options.callbackLocalOptimal && options.callbackLocalOptimal(intPacking, score);
                }
                return;
            }

            const localSegments = remainSegments.slice(0);
            const nextSegment = localSegments.shift();

            let maxLaneCount;
            if (bestPacking !== undefined) {
                maxLaneCount = Math.min(bestPacking.nbLanes(), intPacking.nbLanes() + 1);
            } else {
                maxLaneCount = intPacking.nbLanes() + 1;
            }
            _.each(_.range(0, maxLaneCount), (l) => {
                if (intPacking.maxPosPerLane(l) >= nextSegment.segment.start) {
                    return;
                }
                const localPacking = intPacking.clone();
                localPacking.add(nextSegment.bean, nextSegment.segment.start, nextSegment.segment.end, l);
                fHandler(localPacking, localSegments);
            })

        };
        const packing = new IntervalPacking();
        fHandler(packing, beanSegments);
        options.callbackOptimal && options.callbackOptimal(bestPacking, bestScore);

        return bestPacking;
    }
};
