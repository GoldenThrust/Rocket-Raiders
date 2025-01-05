import { createClient } from "redis";
import mongoose from "mongoose";
import { mongoDBURI, redisOptions } from "../utils/constants.js";

class Redis {
  constructor() {
    this.client = createClient(redisOptions);

    this.client.on("error", (err) => {
      console.error("Redis client failed to connect:", err);
    });
  }

  async run() {
    try {
      await this.client.connect();
      console.log("Successfully connected to Redis!");
    } catch (err) {
      console.error("Redis client failed to connect:", err);
    }
  }

  set(key, value, exp) {
    return this.client.SETEX(key, exp, value);
  }

  get(key) {
    return this.client.get(key);
  }

  del(key) {
    return this.client.DEL(key);
  }
  
  async hset(key, field, value, exp = 10 * 60) {
    await this.client.HSET(key, field, value);
    this.client.expire(`${key}:${field}`, exp);
  }

  async hget(key, field) {
    return this.client.HGET(key, field);
  }

  async hdel(key, field) {
    return this.client.HDEL(key, field);
  }

  async setArray(key, value, exp) {
    const cache = await redisDB.get(key);

    if (!cache) {
        await redisDB.set(key, JSON.stringify([value]), exp);
    } else {
        const parse = JSON.parse(cache);
        parse.push(value);
        await redisDB.set(key, JSON.stringify(parse), exp);
    }
  }

  hgetall(key) {
    return this.client.HGETALL(key);
  }
}

class MongoDB {
  constructor() {
    this.uri = mongoDBURI;
  }

  async run() {
    try {
      await mongoose.connect(this.uri, {
        autoIndex: true,
      });

      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
}

export const redis = new Redis();
const mongodb = new MongoDB();

export default mongodb;
