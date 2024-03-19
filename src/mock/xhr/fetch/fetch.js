const window = globalThis.window || {};
const realFetch = window.fetch;
function mockFetch() {
    // 代理 fetch 的初始化函数
    if (window.fetch && !window.fetch.hasOwnProperty('$mock')) {
        window.fetch = fakeFetch;
        window.fetch.$mock = true;
        console.warn('fetch 已经被代理');
    }
}

// 假的 fetch 函数
import { find, convert } from '../ajax-tools';

// 假的 Response 对象
// import fakeResponse from "./src/response.js";
import fakeResponse from './src/response';

async function fakeFetch(url, options = {}) {
    if (window.fetch.$mock === true) {
        // 只有在 $mock 标记为 true 时才进行代理
        const savedHook = {
            url,
            type: options.method || 'get',
        };
        const result = find(savedHook);
        if (result) {
            const data = convert({ ...result, body: options.body }, savedHook);
            console.warn('mock | fetch代理中', url);
            return new fakeResponse(data, options);
        }
    }

    return realFetch(url, options);
}
export { fakeFetch, mockFetch };
