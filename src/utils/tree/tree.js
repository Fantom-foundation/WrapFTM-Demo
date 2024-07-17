/**
 * @param {string|TreeFullNode|TreeNode} node
 * @param {Tree} tree
 * @return {TreeFullNode}
 */
function getFullNode(node, tree) {
    return typeof node === 'object'
        ? 'node' in node
            ? node
            : tree.getFullNode(node[tree._idPropertyName])
        : tree.getFullNode(node);
}

/**
 * @param {string|TreeNode} node
 * @param {Tree} tree
 * @return {TreeFullNode}
 */
/*
function getNode(node, tree) {
    return getFullNode(node, tree).node;
}
*/

/**
 *
 * @param {string} _node1
 * @param {string} _node2
 * @param {Tree} tree
 * @return {TreeNode|null}
 */
export function getNodesCommonParent(_node1, _node2, tree) {
    const node1 = getFullNode(_node1, tree);
    const node2 = getFullNode(_node2, tree);
    const node1Parents = node1.node ? node1.parents : [];
    const node2Parents = node2.node ? node2.parents : [];
    const indices = { parent: -1, node1: -1, node2: -1 };
    let name = '';
    const idName = tree._idPropertyName;

    if (node1Parents.length > 0 && node2Parents.length > 0) {
        for (let i = node1Parents.length - 1; i >= 0; i--) {
            name = node1Parents[i][idName];

            indices.parent = node2Parents.findIndex((parent) => name === parent[idName]);

            if (indices.parent > -1) {
                indices.node1 = i + 1 < node1Parents.length ? i + 1 : i;
                indices.node2 =
                    indices.parent + 1 < node2Parents.length
                        ? indices.parent + 1
                        : indices.parent;
                break;
            }
        }
    }

    return {
        parent: indices.parent > -1 ? node1Parents[indices.parent] : null,
        directChildren: {
            node1: indices.node1 > -1 ? node1Parents[indices.node1] : null,
            node2: indices.node2 > -1 ? node2Parents[indices.node2] : null,
        },
    };
}

/*
 *
 * @param {string} _node1
 * @param {string} _node2
 * @param {Tree} tree
 * @return {boolean}
 */
export function nodesHaveSameDirectParent(_node1, _node2, tree) {
    const node1 = getFullNode(_node1, tree);
    const node2 = getFullNode(_node2, tree);
    const node1Parents = node1.node ? node1.parents : [];
    const node2Parents = node2.node ? node2.parents : [];
    const idName = tree._idPropertyName;

    return (
        (node1Parents.length === 0 && node2Parents.length === 0) ||
        (node1Parents.length > 0 &&
            node2Parents.length > 0 &&
            node1Parents[node1Parents.length - 1][idName] ===
                node2Parents[node2Parents.length - 1][idName])
    );
}

/**
 *
 * @param {string} _node1
 * @param {string} _node2
 * @param {Tree} tree
 * @return {string}
 */
export function getNodesPositions(_node1, _node2, tree) {
    let node1 = getFullNode(_node1, tree);
    let node2 = getFullNode(_node2, tree);
    let position = '';

    if (nodesHaveSameDirectParent(node1, node2, tree)) {
        if (node1.index === node2.index) {
            position = 'equals';
        } else if (node1.index < node2.index) {
            position = 'before';
        } else {
            position = 'after';
        }
    } else {
        const commonParent = getNodesCommonParent(node1, node2, tree);

        if (!commonParent.parent) {
            if (node1.level < node2.level) {
                position = 'before';
            } else {
                position = 'after';
            }
        } else {
            node1 = getFullNode(commonParent.directChildren.node1, tree);
            node2 = getFullNode(commonParent.directChildren.node2, tree);

            if (node1 && node2) {
                if (node1.index < node2.index) {
                    position = 'before';
                } else {
                    position = 'after';
                }
            }
        }
    }

    return position;
}
