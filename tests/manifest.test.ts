import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GOC = process.cwd();
const MODULE = ["core", "test", "report"] as const;

type Manifest = {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
  entities: { ten: string; noiO: string }[];
};

const doc = (ma: string): Manifest =>
  JSON.parse(readFileSync(join(GOC, "modules", ma, "module.config.json"), "utf8"));

describe("manifest module", () => {
  it.each(MODULE)("module %s có manifest hợp lệ", (ma) => {
    const m = doc(ma);
    expect(m.id).toBe(ma);
    expect(m.version).toMatch(/^\d+\.\d+\.\d+$/u);
  });

  it("🔴 test và report CHỈ được phụ thuộc core", () => {
    for (const ma of ["test", "report"] as const) {
      expect(doc(ma).dependencies, `module ${ma}`).toEqual(["core"]);
    }
  });

  it("core KHÔNG phụ thuộc module nghiệp vụ nào", () => {
    expect(doc("core").dependencies).toEqual([]);
  });

  it("🔴 entities KHÔNG được để rỗng — manifest rỗng là manifest nói dối", () => {
    for (const ma of MODULE) {
      expect(doc(ma).entities.length, `module ${ma}`).toBeGreaterThan(0);
    }
  });

  it("mọi entity trỏ tới file CÓ THẬT trong module", () => {
    for (const ma of MODULE) {
      for (const e of doc(ma).entities) {
        const duong = join(GOC, "modules", ma, e.noiO);
        expect(() => readFileSync(duong, "utf8"), `${ma}/${e.noiO}`).not.toThrow();
      }
    }
  });

  it("🔴 .semgrep có rule cho ĐÚNG ba module — rule mồ côi im lặng cho cảm giác đang được canh", () => {
    const yml = readFileSync(join(GOC, ".semgrep/ranh-gioi-module.yml"), "utf8");
    for (const ma of ["test", "report"] as const) {
      expect(yml, `thiếu rule cho ${ma}`).toMatch(new RegExp(`modules/${ma}/`, "u"));
    }
    // Không có rule cho module đã bị xoá.
    const maTrongYml = [...yml.matchAll(/\*\*\/modules\/([a-z-]+)\/\*\*/gu)].map((m) => m[1]);
    for (const ma of new Set(maTrongYml)) {
      expect(MODULE as readonly string[], `rule mồ côi cho module "${ma}"`).toContain(ma);
    }
  });

  it("mỗi module có OVERVIEW.md, và OVERVIEW không còn nhắc Supabase", () => {
    for (const ma of MODULE) {
      const ov = readFileSync(join(GOC, "modules", ma, "OVERVIEW.md"), "utf8");
      expect(ov.length).toBeGreaterThan(500);
      if (ma !== "core") {
        expect(ov, `OVERVIEW của ${ma} còn nhắc Supabase`).not.toMatch(/Supabase/u);
      }
    }
  });
});
