#include <napi.h>

unsigned int murmurGen(std::string);
Napi::Number MurmurWrapped(const Napi::CallbackInfo& info);
Napi::Object Init(Napi::Env env, Napi::Object exports);
