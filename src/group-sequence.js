
const HEAD = "head";
const USER = "user";

let defaultOptions = {
    horizontalSpacing: 50,
    verticalSpacing: 100,
    spacingFromHead: 10,
    useHead: true,
    useGroups: true,
    sortGroups: true,
    sortNodeIds: true,
    direction: "LR",
    smoothRoundnessRange: 0.09,
    useSmooth: true,
    groupNodeBy: "group",
    sortNodes: undefined,
}

class GroupSequence {

    constructor(options = {}){
        this.options = Object.assign(defaultOptions, options);
    }

    createHeadNode (groupName) {

        return {
            id: "header_" + groupName,
            shape: 'box',
            label: groupName.toString(),
            group: groupName,
            type: HEAD,
            color: {
                border: 'black',
                background: 'white',
            }
        }
    }

    getGroupNames(nodes, prop){
        
        if (!this.options.useGroups) {
            return [1];
        }

        return nodes.map(e => e[prop]).filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    getNodes(nodes, prop, value){
        
        return nodes.get({
            filter: function (item) {
                return item[prop] == value;
            }
        });
    }

    sort(nodes, prop){

        return nodes.sort((a, b) => {

            if (a.type && a.type == HEAD) {
                return -1;
            }

            if (b.type && b.type == HEAD) {
                return -1;
            }

            if (this.options.sortNodes) {
                return this.options.sortNodes(a,b);
            }

            return a[prop] - b[prop];
        });
    }

    arrange(network, data){

        let prop = this.options.groupNodeBy || "group";
        let hSpacing = this.options.horizontalSpacing || 10;
        let vSpacing = this.options.verticalSpacing || 10;
        let spacingFromHead = this.options.spacingFromHead || 10;

        let groupNames = this.getGroupNames(data.nodes, prop);

        if (this.options.useHead) {
            
            groupNames.forEach(groupName => {
                data.nodes.add(this.createHeadNode(groupName));
            });
        }

        groupNames.forEach((groupName, i) => {
            
            var nodes = data.nodes.map(e => e);

            if (this.options.useGroups) {
                nodes = this.getNodes(data.nodes, prop, groupName);
            }

            nodes = this.sort(nodes, "id");

            let widths = [];
            let positions = [];

            nodes.forEach((node, j) => {

                let n = network.body.nodes[node.id];

                let width = n.shape.width;

                widths.push(width);

                n.x = 0;

                if (j == 0) {
                    n.x -= (width / 2); 
                } else if (j == 1) {
                    n.x += (spacingFromHead) + (width / 2);
                } else {
                    n.x += (hSpacing) + positions[j - 1] + widths[j - 1]; 
                }

                n.y = vSpacing * i;

                positions.push(n.x);
            });
        });
        
        let cacheEdge = {};
        
        data.edges.forEach( (edge) => {

            let e = network.body.edges[edge.id];

            let key = e.fromId + "_" + e.toId;

            cacheEdge[key] = cacheEdge[key] || 0;
            cacheEdge[key] += this.options.smoothRoundnessRange;

            let roundnesss = cacheEdge[key];

            data.edges.update({
                id: edge.id, 
                smooth: {
                    type: 'curvedCCW',
                    roundness: roundnesss
                }
            });
        });
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
