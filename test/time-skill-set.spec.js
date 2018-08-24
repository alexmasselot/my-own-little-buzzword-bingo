describe('SkillTimelinetBuilder', () => {
    describe('mash one skill', () => {
        const skillRaw = {
            "name": "Perl",
            "category": "techno",
            "date_start": "3/1/2000",
            "date_mode": "6/1/2011",
            "date_end": "8/22/2018",
            "level": 4,
            "description_length": 37,
            "description": "... And I live with a cat named Perl.",
            "links": "http://bit.ly/cicd-perl;Continuous Deployment in Perl: Code & Folks\nhttp://www.ducon.com;du con"
        };
        const metadata = {
            'techno':
                {
                    rank: 5,
                    display: 'Technologies'
                }
        };

        let skill;
        let builder;
        beforeAll(function() {
            try {
                builder = new SkillTimelinetBuilder();
                skill = builder.mashSkill(skillRaw, metadata);
            }catch(err){
                console.error(err);
            }
        });

        it('name', () => {
            expect(skill.name).toEqual("Perl")
        });

        it('dates', () => {
            expect(skill.date_start).toEqual(new Date('3/1/2000'));
            expect(skill.date_mode).toEqual(new Date('6/1/2011'));
            expect(skill.date_end).toEqual(new Date('8/22/2018'));
        });

        describe('links', () => {
            let links;
            beforeAll(() => {
                links = skill.links;
            });

            it('defined', () =>{
                expect(links).toBeDefined()
            })
            it('count', () => {
                expect(links.length).toBe(2);
            });
            it('content', () => {
                expect(links[1].url).toBe('http://www.ducon.com');
                expect(links[1].title).toBe('du con');
            });
        });

        it('metadata', () => {
            expect(skill.metadata).toBeDefined();
        });


    });

});