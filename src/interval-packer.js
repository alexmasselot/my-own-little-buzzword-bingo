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
 *
 * @return {Array}
 */
IntervalPacking.prototype.maxPosPerLane = function () {
    return this._maxPosPerLane;
};

/**
 * the list of all intervals
 * @return {Array<Array<object>>}
 */
IntervalPacking.prototype.list = function () {
    return _.flatten(this._lanes);
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

IntervalPacking.prototype.toString = function () {
    let buf = '';
    let iChar = 'a';


    _.chain(this._lanes)
        .each((lane) => {
            if (buf !== '') {
                buf += '\n';
            }

            let iPos = this.min() - 1;
            _.chain(lane)
                .map(IntervalPacking.tagName)
                .sortBy('start')
                .each((interv) => {
                    if (interv.start <= iPos) {
                        throw `new element ${JSON.stringify(interv)} steps on the previous on ${iPos}`;
                    }
                    buf += '.'.repeat(interv.start - iPos - 1);
                    buf += iChar.repeat(interv.end + 1 - interv.start);
                    iChar = String.fromCharCode(iChar.charCodeAt(0) + 1);
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
 * @param beans the list of object to be map to segments
 * @param method (topFirst|enlargeSpacgin) the method used to distribute the segment
 *  * topFirst: put the segment at the topest possible possible
 */
IntervalPacker.prototype.pack = function (beans, method = 'topFirst') {
    const segments = _.sortBy(this.computePositions(beans), (bs) => bs.segment.start);

    const packFunction = this['pack_' + method];
    return packFunction(segments);
};

/**
 * we assume the beanSEgments are sorted by start position
 * @param beanSegments
 */
IntervalPacker.prototype.pack_topFirst = function (beanSegments) {
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
    return packing;
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
