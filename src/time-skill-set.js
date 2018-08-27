

function SkillTimelinetBuilder() {
}

SkillTimelinetBuilder.prototype.build = function (skills, metadata) {
    return _.chain(skills)
        .map((skill)=>this.mashSkill(skill, metadata))
        .groupBy('category')
        .value();
};


SkillTimelinetBuilder.prototype.timeRange = function (skills) {
    return {
        start: _.chain(skills)
            .map('date_start')
            .min()
            .value(),
        end: _.chain(skills)
            .map('date_end')
            .max()
            .value(),
    }
};


SkillTimelinetBuilder.prototype.mashSkill = function (skill, metadata) {
    const tSkill = Object.create(skill);
    tSkill.date_start = new Date(skill.date_start);
    tSkill.date_end = new Date(skill.date_end);
    tSkill.date_mode = new Date(skill.date_mode);
    if (skill.links) {
        tSkill.links = _.map(skill.links.split('\n'), function (l) {
            const t = l.split(';');
            return {
                url: t[0],
                title: t[1]
            };
        });
    } else {
        tSkill.links = undefined;
    }
    tSkill.metadata = metadata[tSkill.category];
    return tSkill;
};
