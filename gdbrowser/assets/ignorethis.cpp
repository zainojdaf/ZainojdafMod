#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <cstdlib>
#include <sstream>
#include <array>
#include <memory>
#include <stdexcept>

std::string exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (!pipe) throw std::runtime_error("popen() failed!");
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

int main() {
    srand(static_cast<unsigned int>(time(nullptr)));
    std::cout << "Fetching random GDBrowser fork..." << std::endl;

    // Fetches forks of the archived GDBrowser
    std::string command = "curl -s \"https://api.github.com/repos/GDColon/GDBrowser/forks?per_page=100\" | jq -r '.[].html_url'";
    std::string output = exec(command.c_str());

    std::vector<std::string> forks;
    std::istringstream stream(output);
    std::string line;
    while (std::getline(stream, line)) {
        if (!line.empty()) forks.push_back(line);
    }

    if (forks.empty()) {
        std::cerr << "No forks found." << std::endl;
        return 1;
    }

    std::cout << "\n[GDBrowser] Random Fork: " << forks[rand() % forks.size()] << std::endl;
    return 0;
}   
