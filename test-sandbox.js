const fs = require('fs');
const vm = require('vm');
const files = fs.readdirSync('frontend/dist/assets').filter(f => f.endsWith('.js'));

for (const file of files) {
  const code = fs.readFileSync('frontend/dist/assets/' + file, 'utf8');
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    MutationObserver: class { observe() {} disconnect() {} },
    document: {
      createElement: () => ({ style: {} }),
      head: { appendChild: () => {} },
      getElementById: () => ({ appendChild: () => {} }),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElementNS: () => ({ style: {} }),
      documentElement: { style: {} }
    },
    window: {
        navigator: { userAgent: 'test' },
        document: {},
        addEventListener: () => {},
        matchMedia: () => ({ matches: false }),
        location: { href: 'http://localhost' }
    }
  };
  sandbox.window.document = sandbox.document;
  
  Object.defineProperty(sandbox.window, 'fetch', {
    get: () => function() {},
    configurable: false
  });
  
  Object.defineProperty(sandbox, 'fetch', {
    get: () => function() {},
    configurable: false
  });
  
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox.window;
  sandbox.window.window = sandbox.window;
  
  const context = vm.createContext(sandbox);
  try {
    vm.runInContext(code, context);
  } catch (err) {
    console.log('Error in file:', file, err.message);
    if (err.message.includes('fetch')) console.log(err.stack);
  }
}
console.log("Done testing");
