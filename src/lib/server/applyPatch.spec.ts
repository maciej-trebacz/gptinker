import { applyPatch, Patch } from "./applyPatch";
import * as fs from "fs";

jest.mock("fs");

describe("applyPatch", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;

  test("applies patch when block is found once", () => {
    const filePath = "test.txt";
    const fileContent = "line1\nline2\nline3";
    const patch: Patch = { before: ["line2"], after: ["line2a", "line2b"] };

    mockReadFileSync.mockReturnValue(fileContent);
    const result = applyPatch(filePath, patch);

    expect(result).toBe(true);
    expect(mockReadFileSync).toHaveBeenCalledWith(filePath, "utf-8");
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      filePath,
      "line1\nline2a\nline2b\nline3",
      "utf-8"
    );
  });

  test("returns false when block not found", () => {
    const filePath = "test.txt";
    const fileContent = "line1\nline2\nline3";
    const patch: Patch = { before: ["line4"], after: ["line4a", "line4b"] };

    mockReadFileSync.mockReturnValue(fileContent);
    const result = applyPatch(filePath, patch);

    expect(result).toBe(false);
  });

  test("returns false when block appears more than once", () => {
    const filePath = "test.txt";
    const fileContent = "line1\nline2\nline3\nline2\nline4";
    const patch: Patch = { before: ["line2"], after: ["line2a", "line2b"] };

    mockReadFileSync.mockReturnValue(fileContent);
    const result = applyPatch(filePath, patch);

    expect(result).toBe(false);
  });

  test("returns false when readFileSync throws an error", () => {
    const filePath = "test.txt";
    const patch: Patch = { before: ["line2"], after: ["line2a", "line2b"] };

    mockReadFileSync.mockImplementation(() => {
      throw new Error("File not found");
    });

    const result = applyPatch(filePath, patch);

    expect(result).toBe(false);
  });
});
