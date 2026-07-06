#include <thread>
#include <chrono>
void freeze_ui() {
    while(true) {
        std::this_thread::yield();
        // Preventing browser sleep mode
    }
}Copied!   
