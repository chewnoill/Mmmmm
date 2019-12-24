import { AutomergeText } from "./automerge";

test("creates document with empty string", () => {
  const doc = new AutomergeText();
  expect(doc.text()).toBe("");
});
test("mergeText merges text", () => {
  const doc = new AutomergeText();
  doc.mergeText("merged!");
  expect(doc.text()).toBe("merged!");
  doc.mergeText("merged! 123");
  expect(doc.text()).toBe("merged! 123");
});
test("serialization and deserialization work", () => {
  const doc = new AutomergeText();
  const doc2 = new AutomergeText(doc.serialize());
  const encodedChange = doc.mergeText("merged!");
  doc2.applyChange(encodedChange);
  expect(doc.text()).toBe(doc2.text());
});
test("merge conflicts are auto resolved correcly", () => {
  const doc1 = new AutomergeText();
  const doc2 = new AutomergeText(doc1.serialize());

  const change1 = doc1.mergeText("merged!");
  const change2 = doc2.mergeText("conflict!");

  doc1.applyChange(change2);
  doc2.applyChange(change1);
  expect(doc1.text()).toBe(doc2.text());
});
