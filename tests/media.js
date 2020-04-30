const test = require('./ava-browser');

test('Speedy object exists', async t => {
    const output = await t.context.run(() => {
        return typeof(Speedy);
    });

    t.is(output, 'object');
});

test('Speedy.load() returns a SpeedyMedia object', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return media.constructor.name;
    });

    t.is(output, 'SpeedyMedia');
});

test('SpeedyMedia.source is valid', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return media.source === image;
    });

    t.true(output);
});

test('Speedy can load an image', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return {
            type: media.type,
            width: media.width,
            height: media.height,
        };
    });

    t.is(output.type, 'image');
    t.true(output.width >= 128);
    t.true(output.height >= 128);
});

test('SpeedyMedia.descriptor without a descriptor', async t => {
    const output = await t.context.run(() => {
        const image = document.getElementById('square');
        const media = Speedy.load(image);
        return media.descriptor == null;
    });

    t.true(output);
});