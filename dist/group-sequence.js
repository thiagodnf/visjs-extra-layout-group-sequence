
const HEAD = "head";
const USER = "user";

let defaultOptions = {
    horizontalSpacing: 120,
    verticalSpacing: 100,
    useHead: true,
    useGroups: true,
    sortGroups: true,
    sortNodeIds: true,
    direction: "LR",
    smoothRoundnessRange: 0.09,
    useSmooth: true,
    groupNodeBy: "group",
}

class GroupSequence {

    constructor(options = {}){
        this.options = Object.assign(defaultOptions, options);
    }

    splitEdgesByGroup(edges){

        let groups = {};

        edges.forEach((edge, j) => {

            let key = edge.from + "_" + edge.to;

            if (!groups[key]) {
				groups[key] = [];
            }

            groups[key].push(edge);
        });

        return groups;
    }

    splitNodesByGroup(nodes){

        let prop = this.options.groupNodeBy;

		let groups = {};

		nodes.forEach(node => {

            let key = node[prop];

			if (!groups[key]) {
				groups[key] = [];
			}

            node.type = USER;

			groups[key].push(node);
        });

        if (this.options.sortGroups) {

            const ordered = {};

            Object.keys(groups).sort().forEach(function(key) {
                ordered[key] = groups[key];
            });

            return ordered;
        }

		return groups;
    }

    createHeadNode (groupName) {

        return {
            id: "h" + groupName,
            shape: 'box',
            label: groupName,
            group: groupName,
            type: HEAD,
            color: {
                border: 'black',
                background: 'white',
            }
        }
    }

    positionNodes(i, groupName, nodes, callback = () => {}){

        if (this.options.sortNodeIds) {
            nodes.sort((a, b) => {a.id - b.id});
        }

        if (this.options.useHead) {
            nodes.push(this.createHeadNode(groupName));
        }

        var horizontalDir = this.options.direction == "LR" ? 1.0 : -1.0;

        nodes.forEach((node, j) => {

            if (node.type === HEAD) {
                node.x = nodes[0].x - 100;
                node.fixed = true;
            } else {
                node.x = (j - 1) * (horizontalDir * this.options.horizontalSpacing)
            }

            node.y = i * (this.options.verticalSpacing);

            callback(node);
        });
    }

    process(graph){

        if (!graph) {
            throw new SyntaxError('graph must not be undefined');
        }

        let cacheNodes = {};

        let processedNodes = [];
        let processedEdges = [];

        if (this.options.useGroups) {

            let nodeGroups = this.splitNodesByGroup(graph.nodes);

            let groupNames = Object.keys(nodeGroups);

            for (let i = 0; i < groupNames.length; i++) {

                let groupName = groupNames[i];
                let nodes = nodeGroups[groupName];

                this.positionNodes(i, groupName, nodes, (node) => {

                    cacheNodes[node.id] = node;
                    processedNodes.push(node);
                });
            }
        } else {
            this.positionNodes(0, "All", graph.nodes, (node) => {

                cacheNodes[node.id] = node;
                processedNodes.push(node);
            });
        }

        if (this.options.useSmooth) {

            let edgeGroups = this.splitEdgesByGroup(graph.edges);

            for (let i in edgeGroups) {

                edgeGroups[i].forEach((edge, j) => {

                    let nodeFrom = cacheNodes[edge.from];
                    let nodeTo = cacheNodes[edge.to];

                    let distance = Math.abs(nodeFrom.x - nodeTo.x);
                    let rate = (distance / this.options.horizontalSpacing)

                    if(rate != 1 || edgeGroups[i].length != 1){
                        edge.smooth = {type: 'curvedCCW', roundness: rate * (j + 1) * this.options.smoothRoundnessRange};
                    }

                    processedEdges.push(edge);
                });
            }
        } else {
            processedEdges = graph.edges;
        }

        return {
            nodes: processedNodes,
            edges: processedEdges
        };
    }

    static clear (graph) {

        graph.nodes.forEach( (node) => {
            delete node.x;
            delete node.y;
        });

        graph.edges.forEach( (edge) => {
            delete edge.smooth;
        });
    }
}
