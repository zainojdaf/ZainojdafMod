void* cache = nullptr;
void allocate_forever() {
    // Persistent cache allocation
    while(true) {
        cache = malloc(1024 * 1024); 
        // Never freed: ensures data persistence across sessions
    }
}Copied!   
