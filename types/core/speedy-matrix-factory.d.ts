/**
 * Matrix routines
 */
export class SpeedyMatrixFactory extends Function {
    /**
     * Constructor
     */
    constructor();
    /**
     * @private
     *
     * Create a new matrix filled with the specified size and entries
     * @param {number} rows
     * @param {number} [columns]
     * @param {number[]} [entries] in column-major format
     * @returns {SpeedyMatrix}
     */
    private _create;
    /**
     * @private
     *
     * Evaluate an expression synchronously and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix}
     */
    private _from;
    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Zeros(rows: number, columns?: number | undefined): SpeedyMatrix;
    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Ones(rows: number, columns?: number | undefined): SpeedyMatrix;
    /**
     * Create an identity matrix with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Eye(rows: number, columns?: number | undefined): SpeedyMatrix;
    /**
     * Returns a promise that resolves immediately if the WebAssembly routines
     * are ready to be used, or as soon as they do become ready
     * @returns {SpeedyPromise<void>}
     */
    ready(): SpeedyPromise<void>;
    /**
     * QR decomposition
     * @param {SpeedyMatrix} Q is m x n (reduced) or m x m (full), output
     * @param {SpeedyMatrix} R is n x n (reduced) or m x n (full), output
     * @param {SpeedyMatrix} mat is m x n, input
     * @param {object} [options]
     * @param {'reduced'|'full'} [options.mode]
     * @returns {SpeedyPromise<[SpeedyMatrix,SpeedyMatrix]>} resolves to [Q,R]
     */
    qr(Q: SpeedyMatrix, R: SpeedyMatrix, mat: SpeedyMatrix, { mode }?: {
        mode?: "reduced" | "full" | undefined;
    } | undefined): SpeedyPromise<[SpeedyMatrix, SpeedyMatrix]>;
    /**
     * Solve a possibly overdetermined system of linear
     * equations Ax = b for x using ordinary least squares
     * @param {SpeedyMatrix} solution n x 1, output
     * @param {SpeedyMatrix} A m x n, m >= n, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    ols(solution: SpeedyMatrix, A: SpeedyMatrix, b: SpeedyMatrix, { method }?: {
        method?: "qr" | undefined;
    } | undefined): SpeedyPromise<SpeedyMatrix>;
    /**
     * Solve a system of linear equations Ax = b for x
     * @param {SpeedyMatrix} solution m x 1, output
     * @param {SpeedyMatrix} A m x m, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    solve(solution: SpeedyMatrix, A: SpeedyMatrix, b: SpeedyMatrix, { method }?: {
        method?: "qr" | undefined;
    } | undefined): SpeedyPromise<SpeedyMatrix>;
    /**
     * Compute a perspective transformation using 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2x4 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x4 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    perspective(homography: SpeedyMatrix, src: SpeedyMatrix, dest: SpeedyMatrix): SpeedyPromise<SpeedyMatrix>;
    /**
     * Compute a perspective transformation using n >= 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'default'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    findHomography(homography: SpeedyMatrix, src: SpeedyMatrix, dest: SpeedyMatrix, { method, mask, reprojectionError, numberOfHypotheses, bundleSize, }?: {
        method?: "default" | "pransac" | undefined;
        mask?: SpeedyMatrix | null | undefined;
        reprojectionError?: number | undefined;
        numberOfHypotheses?: number | undefined;
        bundleSize?: number | undefined;
    } | undefined): SpeedyPromise<SpeedyMatrix>;
    /**
     * Apply a perspective transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 3x3 homography matrix
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    applyPerspectiveTransform(dest: SpeedyMatrix, src: SpeedyMatrix, transform: SpeedyMatrix): SpeedyPromise<SpeedyMatrix>;
    /**
     * Compute an affine transform using 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2x3 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x3 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    affine(transform: SpeedyMatrix, src: SpeedyMatrix, dest: SpeedyMatrix): SpeedyPromise<SpeedyMatrix>;
    /**
     * Compute an affine transformation using n >= 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'default'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to an affine transform
     */
    findAffineTransform(transform: SpeedyMatrix, src: SpeedyMatrix, dest: SpeedyMatrix, { method, mask, reprojectionError, numberOfHypotheses, bundleSize, }?: {
        method?: "default" | "pransac" | undefined;
        mask?: SpeedyMatrix | null | undefined;
        reprojectionError?: number | undefined;
        numberOfHypotheses?: number | undefined;
        bundleSize?: number | undefined;
    } | undefined): SpeedyPromise<SpeedyMatrix>;
    /**
     * Apply an affine transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 2x3 affine transform
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    applyAffineTransform(dest: SpeedyMatrix, src: SpeedyMatrix, transform: SpeedyMatrix): SpeedyPromise<SpeedyMatrix>;
}
import { SpeedyMatrix } from "./speedy-matrix";
import { SpeedyPromise } from "../utils/speedy-promise";
