#include "murmur.h"
#include <iostream>

unsigned int rotateLeft(unsigned int h, int k) {
  return (h << k) | (h >> (32 - k));
}

unsigned int murmurGen(std::string key){
  unsigned int len = key.length(), seed = 0, hash = seed,
    c1 = 0xcc9e2d51,
    c2 = 0x1b873593,
    r1 = 15,
    r2 = 13,
    m = 5,
    n = 0xe6546b64, i = 0, remainder = len % 4,
      bytes = len - remainder;

      while (i < bytes) {
        unsigned int k = (
            (((unsigned int)key[i] & 0xFF)) |
            (((unsigned int)key[++i] & 0xFF) << 8) |
            (((unsigned int)key[++i] & 0xFF) << 16) |
            (((unsigned int)key[++i] & 0xFF) << 24)) * c1;
        k = rotateLeft(k, r1) * c2;

        hash ^= k;
        hash = rotateLeft(hash, r2);
        hash *= m;
        hash += n;
        i++;
      }

      if (remainder > 0) {
        unsigned int rem = 0, p = 0;

        while (i < len) {
          rem |= (((unsigned int) key[i] & 0xFF)) << (8 * p);
          i++;
          p++;
        }

        rem *= c1;
        rem = rotateLeft(rem, r1);
        rem *= c2;

        hash ^= rem;
      }

      hash ^= len;

      hash ^= (hash >> 16);
      hash *= 0x85ebca6b;
      hash ^= (hash >> 13);
      hash *= 0xc2b2ae35;
      hash ^= (hash >> 16);

      return hash;
}

Napi::Number MurmurWrapped(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();
  Napi::Number returnValue = Napi::Number::New(env, murmurGen(
    info[0].As<Napi::String>()
  ));

  return returnValue;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(
    Napi::String::New(env, "murmur"), Napi::Function::New(env, MurmurWrapped)
  );

  return exports;
}

NODE_API_MODULE(murmur, Init);
