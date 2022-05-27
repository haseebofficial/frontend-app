require "google_translate_diff"

require "redis"
require "connection_pool"
require "redis-namespace"
require "ratelimit"

pool = ConnectionPool.new(size: 10, timeout: 5) { Redis.new }

keyfile = "config/gcp.json"
creds = Google::Cloud::Translate::Credentials.new keyfile
GoogleTranslateDiff.api = Google::Cloud::Translate.new(
    project: ENV["GCP_PROJECT"],
    keyfile: creds
  )

GoogleTranslateDiff.cache_store =
  GoogleTranslateDiff::RedisCacheStore.new(pool, timeout: 7.days, namespace: "t")

GoogleTranslateDiff.rate_limiter =
  GoogleTranslateDiff::RedisRateLimiter.new(
    pool, threshold: 8000, interval: 60, namespace: "t"
  )
