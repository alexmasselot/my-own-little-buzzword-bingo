const skillsMeta = {
    'management/lead':
        {
            rank: 0,
            display: 'Management & lead'
        },
    'methodo':
        {
            rank: 1,
            display: 'Methodology'
        },
    'teaching':
        {
            rank: 2,
            display: 'Teaching'
        },
    'domain':
        {
            rank: 3,
            display: 'Domains'
        },
    'data viz':
        {
            rank: 4,
            display: 'Data visualization'
        },
    'techno':
        {
            rank: 5,
            display: 'Technologies'
        }
};

const skillsRaw = [{
    "name": "Perl",
    "category": "techno",
    "date_start": "3/1/2000",
    "date_mode": "6/1/2011",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": 37,
    "description": "... And I live with a cat named Perl.",
    "links": "http://bit.ly/cicd-perl;Continuous Deployment in Perl: Code & Folks"
}, {
    "name": "Akka",
    "category": "techno",
    "date_start": "6/1/2012",
    "date_mode": "6/1/2015",
    "date_end": "8/22/2018",
    "level": 3,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Scala",
    "category": "techno",
    "date_start": "6/1/2012",
    "date_mode": "12/1/2016",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "C++",
    "category": "techno",
    "date_start": "3/1/2000",
    "date_mode": "1/1/2008",
    "date_end": "1/1/2010",
    "level": 2,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Spark",
    "category": "techno",
    "date_start": "6/1/2012",
    "date_mode": "6/1/2015",
    "date_end": "8/22/2018",
    "level": 2,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Kibana",
    "category": "data viz",
    "date_start": "3/1/2016",
    "date_mode": "6/1/2017",
    "date_end": "12/1/2017",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Fortran",
    "category": "techno",
    "date_start": "9/1/1992",
    "date_mode": "3/1/2000",
    "date_end": "3/1/2000",
    "level": 5,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "HPC",
    "category": "techno",
    "date_start": "9/1/1992",
    "date_mode": "3/1/2000",
    "date_end": "3/1/2000",
    "level": 5,
    "description_length": null,
    "description": "many type of machines, up to 1600 nodes cluster",
    "links": null
}, {
    "name": "numerical models",
    "category": "domain",
    "date_start": "9/1/1992",
    "date_mode": "3/1/2000",
    "date_end": "3/1/2000",
    "level": 4,
    "description_length": null,
    "description": "fluid dynamics, theoretical physics models, ecology and social",
    "links": null
}, {
    "name": "MPI",
    "category": "techno",
    "date_start": "9/1/1992",
    "date_mode": "3/1/2000",
    "date_end": "3/1/2005",
    "level": 5,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "proteomics",
    "category": "data viz",
    "date_start": "1/1/2001",
    "date_mode": "6/1/2014",
    "date_end": "9/1/2015",
    "level": 5,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "physics models",
    "category": "data viz",
    "date_start": "9/1/1992",
    "date_mode": "3/1/2000",
    "date_end": "3/1/2000",
    "level": 4,
    "description_length": null,
    "description": "AWS, adhoc, framebuffer, animations, fluid dynamics",
    "links": null
}, {
    "name": "R",
    "category": "techno",
    "date_start": "1/1/2008",
    "date_mode": "6/1/2015",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "JVM languages",
    "category": "techno",
    "date_start": "1/1/2005",
    "date_mode": "6/1/2015",
    "date_end": "8/22/2018",
    "level": 3,
    "description_length": null,
    "description": "Java, Groovy, Kotlin",
    "links": null
}, {
    "name": "text indexing/searcing",
    "category": "domain",
    "date_start": "1/1/2010",
    "date_mode": "3/1/2012",
    "date_end": "3/1/2012",
    "level": 3,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "high performance",
    "category": "data viz",
    "date_start": "6/1/2012",
    "date_mode": "6/1/2014",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Ph.D. & Master mentoring",
    "category": "teaching",
    "date_start": "9/1/2006",
    "date_mode": "6/1/2011",
    "date_end": "6/1/2011",
    "level": 3,
    "description_length": null,
    "description": "3 Ph.D. and various masters in bioinformatics",
    "links": null
}, {
    "name": "Introduction to data science for biologists",
    "category": "teaching",
    "date_start": "2/1/2005",
    "date_mode": null,
    "date_end": "6/1/2011",
    "level": 3,
    "description_length": null,
    "description": "1 semester per year ",
    "links": null
}, {
    "name": "Master in business Innovation (Crea)",
    "category": "teaching",
    "date_start": "10/15/2017",
    "date_mode": null,
    "date_end": "12/15/2017",
    "level": 4,
    "description_length": null,
    "description": "Contribute setup the cursus and teach the lean startup module",
    "links": null
}, {
    "name": "academic assistant",
    "category": "teaching",
    "date_start": "3/1/1995",
    "date_mode": null,
    "date_end": "3/1/2000",
    "level": 3,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "graph",
    "category": "domain",
    "date_start": "6/1/2012",
    "date_mode": "6/1/2014",
    "date_end": "3/1/2018",
    "level": 3,
    "description_length": null,
    "description": "neo4j, analysis, Cytoscape, Gephi...",
    "links": null
}, {
    "name": "d3.js",
    "category": "techno",
    "date_start": "6/1/2013",
    "date_mode": "6/1/2014",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Agile/lean in research",
    "category": "methodo",
    "date_start": "6/1/2012",
    "date_mode": "6/1/2015",
    "date_end": "6/1/2015",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "CI/CD",
    "category": "domain",
    "date_start": "1/1/2010",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": "Hudson/Jenkins, Gitlab CI, Perl, ",
    "links": null
}, {
    "name": "NoSQL",
    "category": "domain",
    "date_start": "6/1/2012",
    "date_mode": "12/1/2016",
    "date_end": "8/22/2018",
    "level": 3,
    "description_length": null,
    "description": "MongoDB, Elastic, Neo4j",
    "links": null
}, {
    "name": "Docker ecosystem",
    "category": "techno",
    "date_start": "12/15/2016",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": "Docker, kubernetes, AWS",
    "links": null
}, {
    "name": "Unsupported polar ski expeditions",
    "category": "management/lead",
    "date_start": "1/1/1995",
    "date_mode": "5/1/2002",
    "date_end": "4/1/2004",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Management & strategy",
    "category": "management/lead",
    "date_start": null,
    "date_mode": null,
    "date_end": null,
    "level": null,
    "description_length": null,
    "description": "team lead, architect and CTO @ GeneBio",
    "links": null
}, {
    "name": "Technology evangelist",
    "category": "management/lead",
    "date_start": "5/1/2012",
    "date_mode": null,
    "date_end": "9/1/2014",
    "level": null,
    "description_length": null,
    "description": "Genentech",
    "links": null
}, {
    "name": "Holacracy",
    "category": "management/lead",
    "date_start": null,
    "date_mode": null,
    "date_end": null,
    "level": null,
    "description_length": null,
    "description": "OCTO",
    "links": null
}, {
    "name": "Product Ownership",
    "category": "methodo",
    "date_start": "9/1/2015",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": "Coaching & role",
    "links": null
}, {
    "name": "Lean",
    "category": "methodo",
    "date_start": "9/1/2015",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Product Innovation",
    "category": "methodo",
    "date_start": "9/1/2016",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "DevOps",
    "category": "methodo",
    "date_start": "9/1/2016",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 3,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "Lean UX",
    "category": "methodo",
    "date_start": "1/1/2010",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}, {
    "name": "JavaScript",
    "category": "techno",
    "date_start": "1/1/2000",
    "date_mode": "1/1/2017",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": "JavaScript, Typscript, Angular(JS), React (native) and older techno (Backbone, jQuery)",
    "links": null
}, {
    "name": "testing",
    "category": "methodo",
    "date_start": "6/1/2012",
    "date_mode": "8/22/2018",
    "date_end": "8/22/2018",
    "level": 4,
    "description_length": null,
    "description": null,
    "links": null
}];