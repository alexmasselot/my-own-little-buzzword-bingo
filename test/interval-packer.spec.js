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
                    ip.add({t: 'X'}, 1, 5, 0);
                    ip.add({t: 'Y'}, 3, 8, 1);
                    ip.add({t: 'Z'}, 7, 10, 0);
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
            it('toString(fChar)', () => {
                expect(ip.toString((e) => e.t)).toBe(
                    'XXXXX.ZZZZ\n' +
                    '..YYYYYY..'
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

describe('stats', () => {
    describe('mean', () => {
        it('empty', () => {
            const mean = stats.mean([]);

            expect(mean).toBeNaN();
        });
        it('one element', () => {
            const mean = stats.mean([3]);

            expect(mean).toBe(3);
        });
        it('multiple', () => {
            const mean = stats.mean([10, 12, 17]);

            expect(mean).toBe(13);
        });
    });
    describe('variance', () => {
        it('empty', () => {
            const variance = stats.variance([]);

            expect(variance).toBeNaN();
        });
        it('one element', () => {
            const variance = stats.variance([3]);

            expect(variance).toBeNaN();
        });
        it('multiple', () => {
            const variance = stats.variance([5, 7, 12]);

            expect(variance).toBe(13);
        });
    });
    describe('median', () => {
        it('empty', () => {
            const median = stats.median([]);

            expect(median).toBeNaN();
        });
        it('one element', () => {
            const median = stats.median([3]);

            expect(median).toBe(3);
        });
        it('even number', () => {
            const median = stats.median([10, 20, 30, 40]);

            expect(median).toBe(25);
        });
        it('odd numbers', () => {
            const median = stats.median([10, 20, 30, 40, 50]);

            expect(median).toBe(30);
        });

        it('unsorted', () => {
            const median = stats.median([30, 20, 40, 50, 10]);

            expect(median).toBe(30);
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

        describe('intervalPackerAlgoTopFirst', () => {
            describe('pack', () => {
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
        describe('intervalPackerAlgoBalanceSpacing', () => {
            describe('computeScore', () => {
                it('empty', () => {
                    const ip = new IntervalPacking();

                    const score = intervalPackerAlgoBalanceSpacing.computeScore(ip);

                    expect(score).toEqual({nbLanes: 0, spacing: NaN})
                });

                it('one el', () => {
                    const ip = new IntervalPacking();
                    ip.add({}, 10, 20, 0);

                    const score = intervalPackerAlgoBalanceSpacing.computeScore(ip);

                    expect(score).toEqual({nbLanes: 1, spacing: NaN})
                });

                it('two els, same size', () => {
                    const ip = new IntervalPacking();
                    ip.add({}, 10, 20, 0);
                    ip.add({}, 10, 20, 1);

                    const score = intervalPackerAlgoBalanceSpacing.computeScore(ip);

                    expect(score).toEqual({nbLanes: 2, spacing: NaN})
                });

                it('4 els, 3 lanes', () => {
                    const ip = new IntervalPacking();
                    ip.add({}, 0, 7, 0);
                    ip.add({}, 2, 4, 1);
                    ip.add({}, 5, 10, 1);
                    ip.add({}, 4, 6, 2);

                    const score = intervalPackerAlgoBalanceSpacing.computeScore(ip);

                    expect(score).toEqual({nbLanes: 3, spacing: 1.7})
                });
            });
            describe('isBetterScore', () => {
                it('on < nbLanes', () => {
                    const s1 = {nbLanes: 2, spacing: 7};
                    const s2 = {nbLanes: 3, spacing: 7};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(true);
                });
                it('on > nbLanes', () => {
                    const s1 = {nbLanes: 4, spacing: 7};
                    const s2 = {nbLanes: 3, spacing: 7};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(false);
                });
                it('same lane, large spacing', () => {
                    const s1 = {nbLanes: 3, spacing: 9};
                    const s2 = {nbLanes: 3, spacing: 7};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(false);
                });
                it('same nbLanes, smaller spacing', () => {
                    const s1 = {nbLanes: 3, spacing: 5};
                    const s2 = {nbLanes: 3, spacing: 7};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(true);
                });
                it('identical', () => {
                    const s1 = {nbLanes: 3, spacing: 7};
                    const s2 = {nbLanes: 3, spacing: 7};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(false);
                });

                it('spacing undefined', () => {
                    const s1 = {nbLanes: 3, spacing: NaN};
                    const s2 = {nbLanes: 3, spacing: 3};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(true);
                });
                it('compare to spacing undefined', () => {
                    const s1 = {nbLanes: 3, spacing: 7};
                    const s2 = {nbLanes: 3, spacing: NaN};

                    const isBetter = intervalPackerAlgoBalanceSpacing.isBetterScore(s1, s2);

                    expect(isBetter).toBe(false);
                });
            })
            describe('pack', () => {
                it('empty', () => {
                    const packing = packer.pack([], method = 'balanceSpacing');

                    expect(packing.toString()).toEqual('');
                });
                it('one element', () => {
                    const packing = packer.pack([[3, 7]], method = 'balanceSpacing');

                    expect(packing.toString()).toEqual('aaaaa');
                });

                it('2 elements, same line', () => {
                    const packing = packer.pack([[3, 7], [9, 11]], method = 'balanceSpacing');

                    expect(packing.toString()).toEqual('aaaaa.bbb');
                });
                it('2 elements, 2 lines', () => {
                    const packing = packer.pack([[3, 7], [5, 11]], method = 'balanceSpacing');

                    expect(packing.toString()).toEqual('aaaaa....\n..bbbbbbb');
                });
                it('4 elements, 2 lines', () => {
                    const packing = packer.pack(
                        [[3, 7], [5, 11], [9, 10], [0, 1]],
                        method = 'balanceSpacing',
                        {
                            // callbackLocalOptimal: (packing, score) => {
                            //     console.log('local optimal', score);
                            //     console.log(packing.toString(() => '+'));
                            // }
                        });

                    expect(packing.toString(() => '+')).toEqual(
                        '++...+++++++\n' +
                        '...+++++.++.'
                    );
                });
                it('longer', () => {
                    const packing = packer.pack(
                        [[12, 13], [8, 9], [10, 12], [8, 12], [12, 14], [2, 4], [3, 3], [15, 17], [4, 8], [15, 16], [12, 15], [8, 10], [10, 14], [3, 6], [12, 17]],
                        method = 'balanceSpacing',
                        {
                            // callbackCandidate: (packing, score) => {
                            //     console.log('candidate', score);
                            // },
                            callbackLocalOptimal: (packing, score) => {
                                console.log('local optimal', score);
                                console.log(packing.toString(() => '+'));
                            },
                            callbackOptimal: (packing, score) => {
                                console.log('Winner', score);
                                console.log(packing.toString(() => 'X'));
                            }
                        });

                    expect(packing.toString(() => '+')).toEqual(
                        '+++.....+++..+++\n' +
                        '.+......+++++...\n' +
                        '.++++.....++....\n' +
                        '..+++++...+++...\n' +
                        '......++..++++..\n' +
                        '......+++++..++.\n' +
                        '......+++.++++++'
                    );
                });
                // xit('random', () => {
                //     const lenGen = Prob.poisson(2);
                //     const rndPos = _.map(_.range(0, 15), () => {
                //         const x = Math.round(20 * Math.random());
                //         const l = lenGen();
                //         return [x, x + l];
                //     });
                //     console.log(rndPos.toString());
                //     const packing = packer.pack(
                //         rndPos,
                //         method = 'balanceSpacing',
                //         {
                //             // callbackCandidate: (packing, score) => {
                //             //     console.log('local optimal', score);
                //             //     console.log(packing.toString(() => '?'));
                //             // },
                //             callbackLocalOptimal: (packing, score) => {
                //                 console.log('local optimal', score);
                //                 console.log(packing.toString(() => '+'));
                //             },
                //             callbackOptimal: (packing, score) => {
                //                 console.log('Winner', score);
                //                 console.log(packing.toString(() => 'X'));
                //             }
                //         });
                //
                //     // expect(packing.toString(() => '+')).toEqual(
                //     //     '++...+++++++\n' +
                //     //     '...+++++.++.'
                //     // );
                //});
            });
        });
    });
});