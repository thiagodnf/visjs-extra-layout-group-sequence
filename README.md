![logo](https://user-images.githubusercontent.com/114015/82124812-8367bf80-976f-11ea-9663-16b4358403f1.png)

A Vis.js layout extension for formatting nodes in a sequence or group sequence

[![GitHub Release](https://img.shields.io/github/release/thiagodnf/visjs-extras-groupsequence.svg)](https://github.com/thiagodnf/visjs-extras-groupsequence/releases/latest)
[![GitHub contributors](https://img.shields.io/github/contributors/thiagodnf/visjs-extras-groupsequence.svg)](https://github.com/thiagodnf/visjs-extras-groupsequence/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/thiagodnf/visjs-extras-groupsequence.svg)](https://github.com/almende/thiagodnf/visjs-extras-groupsequence)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

## Features

- Aggregate the nodes in groups
- Use a "head" node to display the group's name
- Select which node's property should be used to grouping

## Screenshot

Groups activated

> [![screenshot][1]][1]

Groups disactived

> [![screenshot][2]][2]

  [1]: https://user-images.githubusercontent.com/114015/82110234-8a101b80-970a-11ea-9367-d01cbdbf9662.png
  [2]: https://user-images.githubusercontent.com/114015/82126173-ec076a00-9778-11ea-892f-ea9cb614df12.png
  
## Requirements
Updated versions of these toolsets may break the build or app. If you have issues, try mirroring these exact versions.

- Vis.js 7.6.4

## Getting Started

### Online access

Click on the on the link below for seeing this tool in action.

https://thiagodnf.github.io/visjs-extras-groupsequence/

### Usage

Include the javascript file in your html file

```html
<script type="text/javascript" src="src/group-sequence.js"></script>
```

and call the class before sending the nodes the vis-network

```js

let gsOptions = {};

let layout  = new GroupSequence(gsOptions);

graph = layout.process(graph);

var data = {
    nodes: new vis.DataSet(graph.nodes),
    edges: new vis.DataSet(graph.edges)
};

var options = {
    physics: false
};

var network = new vis.Network($container[0] , data, options);
```

Warning! Don't forget to set ```physics: false```

### Parameters

The default options are:

```js
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
```

The individual options are explained below.

| Name | Type | Default | Description |   
| --- | --- | --- | --- | 
| horizontalSpacing | number | 120 | The horizontal distance among nodes |
| verticalSpacing | number | 100 | The vertical distance among nodes |
| useHead | boolean | true | Active the use of head nodes |
| useGroups | boolean | true | Active the use of groups  |
| sortGroups | boolean | true | Active if the groups should be sorted  |
| sortNodeIds | boolean | true | Active if the nodes should be sorted |
| direction | string | "LR" | Define the direction. Available options ```LR``` and ```RL``` |
| smoothRoundnessRange | number | 0.09 | The size of edge's roundness |
| useSmooth | boolean | true | Active the use of edge's smooth |
| groupNodeBy | string |  "group" | Define the properties used for grouping|


## Contribute

Contributions to the this project are very welcome! We can't do this alone! Feel free to fork this project, work on it and then make a pull request.

## Questions or Suggestions

Feel free to create <a href="https://github.com/thiagodnf/visjs-extras-groupsequence/issues">issues</a> here as you need

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

<a href="https://www.buymeacoffee.com/thiagodnf" target="_blank">
  <img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg" alt="Buy Me A Coffee">
</a>
