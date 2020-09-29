/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * math.js
 * Unit testing
 */

describe('Math', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    describe('Vector2', function() {

        let zero;

        beforeEach(function() {
            zero = Speedy.Vector2(0, 0);
        });

        it('creates a vector', function() {
            expect(Speedy.Vector2(1, 1)).toBeDefined();
            expect(zero).toBeDefined();
        });

        it('holds valid coordinates', function() {
            const u = Speedy.Vector2(4, 5);
            const v = Speedy.Vector2(-4, -5);

            expect(u.x).toEqual(4);
            expect(u.y).toEqual(5);

            expect(v.x).toEqual(-4);
            expect(v.y).toEqual(-5);
        });

        it('clones vectors', function() {
            const u = Speedy.Vector2(4, 5);
            const v = u.clone();

            expect(u.x).toEqual(v.x);
            expect(u.y).toEqual(v.y);
            expect(u).not.toBe(v);
        });

        it('returns the correct length', function() {
            const u = Speedy.Vector2(-3, -4);
            const v = Speedy.Vector2(3, 4);

            expect(u.length).toEqual(5);
            expect(v.length).toEqual(5);
            expect(zero.length).toEqual(0);
        });

        it('won\'t accept non-numbers as coordinates', function() {
            expect(() => Speedy.Vector2('2', 'a')).toThrow();
            expect(() => Speedy.Vector2(2, null)).toThrow();
            expect(() => Speedy.Vector2(null)).toThrow();
            expect(() => Speedy.Vector2(undefined)).toThrow();
            expect(() => Speedy.Vector2({})).toThrow();
            expect(() => Speedy.Vector2('test')).toThrow();
            expect(() => Speedy.Vector2(true, 1)).toThrow();
            expect(() => Speedy.Vector2(2, Math.exp(2))).not.toThrow();
        });

        it('supports translations', function() {
            const v = zero.translatedBy(5, 5);
            const w = Speedy.Vector2(2, 3).translatedBy(v);

            expect(v.x).toEqual(5);
            expect(v.y).toEqual(5);
            expect(w.x).toEqual(7);
            expect(w.y).toEqual(8);
        });

        it('supports scaling', function() {
            const v = Speedy.Vector2(3, 4).scaledBy(2);
            const w = v.scaledBy(0.5);

            expect(v.x).toEqual(6);
            expect(v.y).toEqual(8);
            expect(w.x).toEqual(3);
            expect(w.y).toEqual(4);
        });

        it('compute distances', function() {
            const one = Speedy.Vector2(1, 1);
            const v = Speedy.Vector2(4, 5);

            expect(v.distanceTo(one)).toEqual(5);
            expect(one.distanceTo(v)).toEqual(5);
        });

        it('normalizes vectors', function() {
            const v = Speedy.Vector2(4, 0).normalized();
            const u = Speedy.Vector2(0, 5).normalized().normalized();
            const z = zero.normalized();

            expect(v.x).toEqual(1);
            expect(v.y).toEqual(0);
            expect(v.length).toEqual(1);

            expect(u.x).toEqual(0);
            expect(u.y).toEqual(1);
            expect(u.length).toEqual(1);

            expect(z.x).toEqual(0);
            expect(z.y).toEqual(0);
            expect(z.length).toEqual(0);
        });

        it('computes the dot product', function() {
            const v = Speedy.Vector2(1, 1);
            const w = Speedy.Vector2(2, 5);

            expect(v.dot(w)).toEqual(7);
            expect(zero.dot(v)).toEqual(0);
        });

    });

});