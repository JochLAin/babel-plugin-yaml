const { transformFileSync } = require('@babel/core');
const path = require('path');
const plugin = require('../index');

test('Load yaml with require', () => {
    const transformed = transformFileSync(
        path.join(__dirname, '/require.js'),
        { plugins: [plugin] }
    );
    const result = eval(`${transformed.code}`);
    expect(result.foo).toBe("bar");
});
