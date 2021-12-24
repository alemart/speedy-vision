/** @type {number} Default number of tables in a LSH data structure */
export const LSH_DEFAULT_NUMBER_OF_TABLES: number;
/** @type {number} Default number of bits of a hash */
export const LSH_DEFAULT_HASH_SIZE: number;
/** @type {number[]} Acceptable number of tables for a LSH data structure */
export const LSH_ACCEPTABLE_NUMBER_OF_TABLES: number[];
/** @type {number[]} Acceptable values for hashSize, in bits */
export const LSH_ACCEPTABLE_HASH_SIZES: number[];
/** @type {number[]} Acceptable sizes for keypoint descriptors, in bytes */
export const LSH_ACCEPTABLE_DESCRIPTOR_SIZES: number[];
/** @typedef {Uint32Array} BitSequences flattened array of LSH_SEQUENCE_COUNT sequences of LSH_SEQUENCE_MAXLEN elements each - each entry represents a bit index */
/** @typedef {Object<number,BitSequences>} BitSequencesIndexedByDescriptorSize */
/** @typedef {Object<number,BitSequencesIndexedByDescriptorSize>} LSHSequences */
/** @type {number} maximum number of elements of a sequence */
export const LSH_SEQUENCE_MAXLEN: number;
/** @type {number} number of sequences in a BitSequences object */
export const LSH_SEQUENCE_COUNT: number;
/**
 * GPU-based LSH tables for fast matching of binary descriptors
 */
export class SpeedyLSH {
    /**
     * Constructor
     * @param {SpeedyTexture} lshTables texture to be used as the set of LSH tables
     * @param {SpeedyTexture} descriptorDB texture to be used as the descriptor database
     * @param {Uint8Array[]} descriptors the binary descriptors you'll store (make sure you don't repeat them, otherwise they will just waste space)
     * @param {number} [tableCount] number of LSH tables, preferably a power of two
     * @param {number} [hashSize] number of bits of a hash of a descriptor
     * @param {number} [probability] probability of no discard events happening in the theoretical model
     */
    constructor(lshTables: SpeedyTexture, descriptorDB: SpeedyTexture, descriptors: Uint8Array[], tableCount?: number | undefined, hashSize?: number | undefined, probability?: number | undefined);
    /** @type {LSHProfile} LSH profile */
    _profile: LSHProfile;
    /** @type {number} descriptor size, in bytes */
    _descriptorSize: number;
    /** @type {number} number of descriptors */
    _descriptorCount: number;
    /** @type {BitSequences} bit sequences */
    _sequences: BitSequences;
    /** @type {SpeedyTexture} LSH tables storing indices of descriptors */
    _tables: SpeedyTexture;
    /** @type {SpeedyTexture} a storage of descriptors */
    _descriptorDB: SpeedyTexture;
    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize(): number;
    /**
     * Number of descriptors stored in this LSH data structure
     * @returns {number}
     */
    get descriptorCount(): number;
    /**
     * LSH bit sequences
     * @returns {BitSequences}
     */
    get sequences(): Uint32Array;
    /**
     * Number of bits that make a hash
     * @returns {number}
     */
    get hashSize(): number;
    /**
     * Maximum number of descriptors that can be stored in a bucket of a table
     * @returns {number}
     */
    get bucketCapacity(): number;
    /**
     * How many buckets per table do we have?
     * @returns {number}
     */
    get bucketsPerTable(): number;
    /**
     * Number of LSH tables
     * @returns {number}
     */
    get tableCount(): number;
    /**
     * Size of one LSH table, in bytes
     * @returns {number}
     */
    get tableSize(): number;
    /**
     * Size of all LSH tables combined, in bytes
     * @returns {number}
     */
    get totalSize(): number;
    /**
     * LSH tables texture
     * @returns {SpeedyDrawableTexture}
     */
    get tables(): SpeedyDrawableTexture;
    /**
     * A collection of descriptors
     * @returns {SpeedyDrawableTexture}
     */
    get descriptorDB(): SpeedyDrawableTexture;
    /**
     * Pick the appropriate LSH sequences for a particular descriptor size
     * @param {number} descriptorSize in bytes
     * @returns {BitSequences}
     */
    _pickSequences(descriptorSize: number): BitSequences;
    /**
     * Create LSH tables
     * @param {SpeedyTexture} texture output texture
     * @param {BitSequences} sequences bit sequences
     * @param {Uint8Array[]} descriptors non-empty array of binary descriptors, ALL HAVING THE SAME SIZE
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture} texture
     */
    _createStaticTables(texture: SpeedyTexture, sequences: BitSequences, descriptors: Uint8Array[], descriptorSize: number): SpeedyTexture;
    /**
     * Pick bits from a binary descriptor
     * @param {Uint8Array} descriptor a single descriptor
     * @param {BitSequences} sequences flattened array of tableCount sequences of LSH_SEQUENCE_MAXLEN elements each
     * @returns {number[]} hash code for each table
     */
    _hashCodes(descriptor: Uint8Array, sequences: BitSequences): number[];
}
/**
 * LSH profile
 */
export type LSHProfile = {
    /**
     * name of the profile
     */
    name: string;
    /**
     * maximum number of keypoints that can be stored in such a table
     */
    capacity: number;
    /**
     * number of bits in a keypoint descriptor hash (at most 16)
     */
    hashSize: number;
    /**
     * number of tables, preferably a power of 2 (at most 16)
     */
    tableCount: number;
    /**
     * maximum number of entries of a bucket of a table
     */
    bucketCapacity: number;
};
/**
 * flattened array of LSH_SEQUENCE_COUNT sequences of LSH_SEQUENCE_MAXLEN elements each - each entry represents a bit index
 */
export type BitSequences = Uint32Array;
export type BitSequencesIndexedByDescriptorSize = {
    [x: number]: BitSequences;
};
export type LSHSequences = {
    [x: number]: BitSequencesIndexedByDescriptorSize;
};
import { SpeedyTexture } from "./speedy-texture";
import { SpeedyDrawableTexture } from "./speedy-texture";
