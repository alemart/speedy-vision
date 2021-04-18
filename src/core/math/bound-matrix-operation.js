/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * bound-matrix-operation.js
 * Bound matrix operations
 */

import { MatrixOperation, MatrixOperationSequence } from './matrix-operations';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { SpeedyMatrix } from './matrix';
import { Utils } from '../../utils/utils';

/**
 * A MatrixOperation bound with input & output matrices
 */
export class BoundMatrixOperation
{
    /**
     * Constructor
     * @param {?MatrixOperation} operation if null, this is just a helper no-op
     * @param {SpeedyMatrix} outputMatrix
     * @param {SpeedyMatrix[]} inputMatrices
     */
    constructor(operation, outputMatrix, inputMatrices)
    {
        /** @type {?MatrixOperation} matrix operation */
        this.operation = operation;

        /** @type {SpeedyMatrix} output matrix */
        this.outputMatrix = outputMatrix;

        /** @type {SpeedyMatrix[]} input matrices */
        this.inputMatrices = inputMatrices;

        // validate
        if(this.operation !== null)
            Utils.assert(this.operation.numberOfInputMatrices() === this.inputMatrices.length);

        // make it immutable
        return Object.freeze(this);
    }
}

/**
 * A tree of bound matrix operations
 */
export class BoundMatrixOperationTree
{
    /**
     * Constructor
     * @param {?MatrixOperation} operation operation of this node
     * @param {SpeedyMatrix} outputMatrix output of this operation tree
     * @param {BoundMatrixOperationTree[]} [children] child nodes
     */
    constructor(operation, outputMatrix, children = [])
    {
        /** @type {BoundMatrixOperation} operation of this node */
        this._boundOperation = new BoundMatrixOperation(
            operation, // if operation is null, this is just an empty node to help construct the tree
            outputMatrix,
            children.map(child => child._boundOperation.outputMatrix)
        );

        /** @type {BoundMatrixOperationTree[]} child nodes */
        this._children = children;

        // make it immutable
        return Object.freeze(this);
    }

    /**
     * The output matrix of the tree (of this node of the tree)
     * @returns {SpeedyMatrix}
     */
    get outputMatrix()
    {
        return this._boundOperation.outputMatrix;
    }

    /**
     * Pack the tree into a single BoundMatrixOperation
     * @returns {BoundMatrixOperation}
     */
    pack()
    {
        const matrices = []; // matrices of the ENTIRE tree
        const stack = [ [ this, false ] ];
        const steps = [];

        // transform the tree into a sequence of operations
        while(stack.length > 0) {
            const [ node, done ] = stack.pop();
            if(!done) {
                // visit children (in increasing order)
                stack.push([ node, true ]);
                for(let i = node._children.length - 1; i >= 0; i--)
                    stack.push([ node._children[i], false ]);
            }
            else if(node._boundOperation.operation !== null) {
                // visit this node (we skip it if the operation is null)
                const { operation, outputMatrix, inputMatrices } = node._boundOperation;
                const indexOfOutputMatrix = this._findOrAdd(matrices, outputMatrix);
                const indicesOfInputMatrices = inputMatrices.map(inputMatrix => this._findOrAdd(matrices, inputMatrix));

                const step = MatrixOperationSequence.step(operation, indexOfOutputMatrix, indicesOfInputMatrices)
                step.header.updateMetadata(outputMatrix, inputMatrices);
                steps.push(step);
            }
        }

        // bind the sequence of operations to the appropriate matrices
        return new BoundMatrixOperation(
            new MatrixOperationSequence(
                matrices.length,
                this.outputMatrix.shape,
                steps
            ),
            this.outputMatrix,
            matrices
        );
    }

    /**
     * Find an element in an array. If it doesn't exist, add it.
     * @param {SpeedyMatrix[]} array
     * @param {SpeedyMatrix} element
     * @return {number} index of the element in the array
     */
    _findOrAdd(array, element)
    {
        const idx = array.lastIndexOf(element);
        return idx >= 0 ? idx : array.push(element) - 1;
    }
}