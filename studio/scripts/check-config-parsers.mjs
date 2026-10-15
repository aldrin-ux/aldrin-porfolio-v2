import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(new URL("../package.json", import.meta.url));
const entry = require.resolve("@vercel/frameworks");
const { readConfigFile } = require(path.join(path.dirname(entry), "read-config-file.js"));
const fromFrameworks = createRequire(entry);

async function packageVersion(name) {
  let directory = path.dirname(fromFrameworks.resolve(name));
  while (directory !== path.dirname(directory)) {
    try {
      const pkg = JSON.parse(await readFile(path.join(directory, "package.json"), "utf8"));
      if (pkg.name === name) return pkg.version;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    directory = path.dirname(directory);
  }
  throw new Error(`Cannot identify ${name} resolved by framework config reader`);
}

assert.equal(await packageVersion("js-yaml"), "3.15.2");
assert.equal(await packageVersion("smol-toml"), "1.9.1");

const directory = await mkdtemp(path.join(tmpdir(), "portfolio-studio-parsers-"));
const expected = { build: { command: "npm run build", publish: "dist" } };
// TOML can return null-prototype records; compare configuration values, not prototypes.
const values = (record) => JSON.parse(JSON.stringify(record));
try {
  const yaml = path.join(directory, "config.yaml");
  const yml = path.join(directory, "config.yml");
  const toml = path.join(directory, "config.toml");
  const json = path.join(directory, "config.json");
  await writeFile(yaml, "build:\n  command: npm run build\n  publish: dist\n");
  await writeFile(yml, "defaults: &defaults\n  publish: dist\nbuild:\n  <<: *defaults\n  command: npm run build\n");
  await writeFile(toml, '[build]\ncommand = "npm run build"\npublish = "dist"\n');
  await writeFile(json, JSON.stringify(expected));
  assert.deepEqual(values(await readConfigFile(yaml)), expected);
  assert.deepEqual(values((await readConfigFile(yml)).build), expected.build);
  assert.deepEqual(values(await readConfigFile(toml)), expected);
  assert.deepEqual(values(await readConfigFile(json)), expected);
  const absent = path.join(directory, "absent.yaml");
  assert.equal(await readConfigFile(absent), null);
  assert.deepEqual(values(await readConfigFile([absent, toml])), expected);
  await writeFile(yaml, "build: [unterminated\n");
  await writeFile(toml, "[unterminated\n");
  await assert.rejects(readConfigFile(yaml));
  await assert.rejects(readConfigFile(toml));
  console.log("Framework config compatibility: patched versions, YAML/YML anchors, TOML, JSON, missing/fallback paths and invalid-input rejection passed.");
} finally {
  const prefix = path.resolve(tmpdir()) + path.sep + "portfolio-studio-parsers-";
  if (!path.resolve(directory).startsWith(prefix)) throw new Error("Unsafe temporary cleanup path");
  await rm(directory, { recursive: true, force: true });
}
