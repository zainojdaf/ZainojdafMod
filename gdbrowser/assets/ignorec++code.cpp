#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <cstdlib>
#include <sstream>

// Function to execute a command and return output
std::string exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (!pipe) {
        throw std::runtime_error("popen() failed!");
    }
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

int main() {
    srand(static_cast<unsigned int>(time(nullptr)));

    std::cout << "Fetching forks for web-dashers/web-dashers.github.io..." << std::endl;

    // Command to fetch fork URLs using GitHub API and jq for parsing
    // Requires 'curl' and 'jq' to be installed
    std::string command = "curl -s \"https://api.github.com/repos/web-dashers/web-dashers.github.io/forks?per_page=100\" | jq -r '.[].html_url'";
    
    std::string output = exec(command.c_str());
    
    if (output.empty()) {
        std::cerr << "Failed to fetch forks or no forks found. Ensure 'curl' and 'jq' are installed." << std::endl;
        return 1;
    }

    std::vector<std::string> forks;
    std::istringstream stream(output);
    std::string line;
    
    while (std::getline(stream, line)) {
        if (!line.empty()) {
            forks.push_back(line);
        }
    }

    if (forks.empty()) {
        std::cerr << "No forks found." << std::endl;
        return 1;
    }

    // Select a random fork
    int randomIndex = rand() % forks.size();
    std::string randomFork = forks[randomIndex];

    std::cout << "\n--- Random Fork Selected ---" << std::endl;
    std::cout << "URL: " << randomFork << std::endl;
    std::cout << "----------------------------" << std::endl;

    return 0;
}   
