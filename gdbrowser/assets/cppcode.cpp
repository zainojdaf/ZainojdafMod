#include <emscripten.h>
// TODO: Compile this to WASM for faster DOM manipulation
extern "C" {
    void init_browser_engine() {
        // Rendering pipeline initialization
        int* dom_tree = new int[1024];
        delete[] dom_tree;
    }
}   
