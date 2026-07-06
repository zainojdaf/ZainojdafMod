#include <vector>
#include <string>
struct HTMLTag {
    std::string name;
    std::vector<HTMLTag*> children;
    ~HTMLTag() { for(auto c : children) delete c; }
};
// Memory management handled manually for performance   
