describe('IntervalPacking', () => {
    describe('accessors', () => {
        describe('empty', () => {
            let ip;

            beforeAll(() => {
                try {
                    ip = new IntervalPacking();
                } catch (err) {
                    throw err;
                }
            });

            it('size', () => {
                expect(ip.size()).toBe(0)
            });
            it('nbLanes', () => {
                expect(ip.nbLanes()).toBe(0)
            });
            it('toString()', () => {
                expect(ip.toString()).toBe('')
            });
        });
        describe('three elements', () => {
            let ip;

            beforeAll(() => {
                try {
                    ip = new IntervalPacking();
                    ip.add({}, 1, 5, 0);
                    ip.add({}, 3, 8, 1);
                    ip.add({}, 7, 10, 0);
                } catch (err) {
                    throw err;
                }
            });

            it('size', () => {
                expect(ip.size()).toBe(3);
            });
            it('nbLanes', () => {
                expect(ip.nbLanes()).toBe(2);
            });
            it('min', () => {
                expect(ip.min()).toBe(1);
            });
            it('max', () => {
                expect(ip.max()).toBe(10);
            });
            it('maxPosPerLane', () => {
                expect(ip.maxPosPerLane()).toEqual([10, 8]);
            });
            it('toString()', () => {
                expect(ip.toString()).toBe(
                    'aaaaa.bbbb\n' +
                    '..cccccc..'
                );
            });
            describe('clone', () => {
                let ip2;
                beforeAll(() => {
                    try {
                        ip2 = ip.clone();
                        ip2.add({}, 10, 12, 1);
                    } catch (err) {
                        throw err;
                    }
                });
                it('size', () => {
                    expect(ip.size()).toBe(3);
                    expect(ip2.size()).toBe(4);
                });
                it('nbLanes', () => {
                    expect(ip.nbLanes()).toBe(2);
                    expect(ip2.nbLanes()).toBe(2);
                });
                it('min', () => {
                    expect(ip.min()).toBe(1);
                    expect(ip2.min()).toBe(1);
                });
                it('max', () => {
                    expect(ip.max()).toBe(10);
                    expect(ip2.max()).toBe(12);
                });
                it('maxPosPerLane', () => {
                    expect(ip.maxPosPerLane()).toEqual([10, 8]);
                    expect(ip2.maxPosPerLane()).toEqual([10, 12]);
                });
                it('toString()', () => {
                    expect(ip.toString()).toBe(
                        'aaaaa.bbbb\n' +
                        '..cccccc..'
                    );
                    expect(ip2.toString()).toBe(
                        'aaaaa.bbbb..\n' +
                        '..cccccc.ddd'
                    );
                });
            });
        });


    });
    describe('add', () => {

        it('add set attributes', () => {
            const ip = new IntervalPacking();

            ip.add({t: 'x'}, 2, 5, 0);
            const added = ip.get(0, 0);

            expect(added._intPack.start).toBe(2);
            expect(added._intPack.end).toBe(5);
            expect(added._intPack.lane).toBe(0);
        });
        it('nbLanes', () => {
            const ip = new IntervalPacking();

            ip.add({t: 'x'}, 2, 5, 0);
            ip.add({t: 'y'}, 4, 7, 1);

            expect(ip.size()).toBe(2)
        });
        it('nbLanes', () => {
            const ip = new IntervalPacking();

            ip.add({t: 'x'}, 2, 5, 0);
            ip.add({t: 'y'}, 4, 7, 1);

            expect(ip.nbLanes()).toBe(2);
        });
    });

});

describe('IntervalPacker', () => {
    describe('computePositions', () => {
        it('simple transform', () => {
            const objs = [
                {t: 'a', x: 1.5, y: 1.9},
                {t: 'b', x: 0.7, y: 1.7}
            ];
            const packer = new IntervalPacker((o) => Math.round(o.x * 10), (o) => Math.round(o.y * 10));

            const oSegs = packer.computePositions(objs);

            expect(oSegs).toEqual([
                {bean: {t: 'a', x: 1.5, y: 1.9}, segment: {start: 15, end: 19}},
                {bean: {t: 'b', x: 0.7, y: 1.7}, segment: {start: 7, end: 17}}
            ]);
        });
        it('with minGap', () => {
            const objs = [
                {t: 'a', x: 1.5, y: 1.9},
                {t: 'b', x: 0.7, y: 1.7}
            ];
            const packer = new IntervalPacker((o) => Math.round(o.x * 10), (o) => Math.round(o.y * 10), {minGap: 2});

            const oSegs = packer.computePositions(objs);

            expect(oSegs).toEqual([
                {bean: {t: 'a', x: 1.5, y: 1.9}, segment: {start: 15, end: 21}},
                {bean: {t: 'b', x: 0.7, y: 1.7}, segment: {start: 7, end: 19}}
            ]);
        });
    });
    describe('packing', () => {
        const packer = new IntervalPacker((o) => o[0], (o) => o[1]);

        describe('pack_topFirst', () => {
            it('empty', () => {
                const packing = packer.pack([], method = 'topFirst');

                expect(packing.toString()).toEqual('');
            });
            it('one element', () => {
                const packing = packer.pack([[3, 7]], method = 'topFirst');

                expect(packing.toString()).toEqual('aaaaa');
            });

            it('2 elements, same line', () => {
                const packing = packer.pack([[3, 7], [9, 11]], method = 'topFirst');

                expect(packing.toString()).toEqual('aaaaa.bbb');
            });
            it('2 elements, 2 lines', () => {
                const packing = packer.pack([[3, 7], [5, 11]], method = 'topFirst');

                expect(packing.toString()).toEqual('aaaaa....\n..bbbbbbb');
            });
            it('4 elements, 2 lines', () => {
                const packing = packer.pack([[3, 7], [5, 11], [9, 10], [0, 1]], method = 'topFirst');

                expect(packing.toString()).toEqual('aa.bbbbb.cc.\n.....ddddddd');
            });
        });
    });
});