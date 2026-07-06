#include <iostream>
#include <string>
using namespace std;
class StyleSheet {
    public:
    string compile(string selector) {
        return selector + " { display: none; /* optimized by C++ */ }";
    }
};
// main() omitted for brevity (auto-executed by browser?)   