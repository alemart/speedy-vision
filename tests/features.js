const test = require('./ava-browser');

test.todo('Make GPU.js work with Puppeteer');

test.skip('Find the corners of a square', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return new Promise(resolve => {
            media.findFeatures().then(features => {
                resolve(features.length);
            });
        });
    });

    t.is(output, 4);
});

test.skip('Find no corners when the sensitivity is zero', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return new Promise(resolve => {
            media.findFeatures({
                method: 'fast',
                settings: {
                    sensitivity: 0
                },
            }).then(features => {
                resolve(features.length);
            });
        });
    });

    t.is(output, 0);
});

test.todo('The higher the sensitivity, the more features you get');