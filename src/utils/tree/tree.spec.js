import { Tree } from 'fantom-vue3-components';
import {
    getNodesCommonParent,
    getNodesPositions,
    nodesHaveSameDirectParent,
} from './tree.js';

describe('tree utils', () => {
    let tree = null;

    function TREE() {
        return [
            { name: '404' },
            {
                name: 'main',
                _c: [
                    { name: 'home' },
                    { name: 'blocks', _c: [{ name: 'block-detail' }] },
                    {
                        name: 'transactions',
                        _c: [
                            {
                                name: 'transaction-detail',
                                _c: [{ name: 'transaction-sub-detail' }],
                            },
                        ],
                    },
                ],
            },
        ];
    }

    beforeEach(() => {
        tree = new Tree(TREE(), { idPropertyName: 'name' });
    });

    afterEach(() => {
        tree = null;
    });

    describe('getNodesCommonParent()', () => {
        it('should return common parent of the given nodes', () => {
            const parent = getNodesCommonParent(
                'block-detail',
                'transaction-detail',
                tree
            ).parent;

            expect(parent.name).toBe('main');
        });

        it('should return null if no common parent is found', () => {
            expect(getNodesCommonParent('404', 'home', tree).parent).toBeNull();
            expect(getNodesCommonParent('home', '404', tree).parent).toBeNull();
        });
    });

    describe('nodesHaveSameDirectParent()', () => {
        it('should return true if given nodes has the same parent', () => {
            expect(nodesHaveSameDirectParent('home', 'blocks', tree)).toBe(true);
            expect(nodesHaveSameDirectParent('404', 'main', tree)).toBe(true);
            expect(
                nodesHaveSameDirectParent(
                    tree.getNode('home'),
                    tree.getFullNode('blocks'),
                    tree
                )
            ).toBe(true);
            expect(
                nodesHaveSameDirectParent('block-detail', 'transaction-detail', tree)
            ).toBe(false);
        });
    });

    describe('getNodesPositions()', () => {
        it('should return "equals" if nodes are equal', () => {
            expect(getNodesPositions('home', 'home', tree)).toBe('equals');
            expect(getNodesPositions('home', 'blocks', tree)).not.toBe('equals');
            expect(
                getNodesPositions('block-detail', 'transaction-detail', tree)
            ).not.toBe('equals');
            expect(getNodesPositions('foooo', 'transaction-sub-detail', tree)).not.toBe(
                'equals'
            );
        });

        it('should return "before" if node1 is parent of node2', () => {
            expect(getNodesPositions('main', 'home', tree)).toBe('before');
        });

        it('should return "before" if node1 and node2 are siblings and node1 is before node2', () => {
            expect(getNodesPositions('404', 'main', tree)).toBe('before');
        });

        it('should return "after" if node1 is child of node2', () => {
            expect(getNodesPositions('home', 'main', tree)).toBe('after');
        });

        it('should return "after" if node1 and node2 are siblings and node1 is after node2', () => {
            expect(getNodesPositions('blocks', 'home', tree)).toBe('after');
        });

        it('should return "before" if node1 and node2 are on the same level but are not siblings', () => {
            expect(getNodesPositions('block-detail', 'transaction-detail', tree)).toBe(
                'before'
            );
        });

        it('should return "before" if node1 and node2 have the same parent', () => {
            expect(
                getNodesPositions('block-detail', 'transaction-sub-detail', tree)
            ).toBe('before');
        });
    });
});
