import * as fastDiff from "fast-diff";
const Automerge = require("automerge");
import { encode, decode } from "./utils";

/**
 * AutomergeText
 *
 * base64 encodes datastructures for transport.
 * Contents of changes and internal strucures
 * shuld be opaque to calling functions and
 * storage.
 */
export class AutomergeText {
  doc: any;
  constructor(encodedDoc?: string) {
    if (!encodedDoc) {
      this.doc = Automerge.from({ text: new Automerge.Text() });
    } else {
      this.doc = Automerge.load(decode(encodedDoc));
    }
  }

  text() {
    return this.doc.text.toString();
  }

  serialize() {
    return encode(Automerge.save(this.doc));
  }

  mergeText(newText: string) {
    const diffs = fastDiff(this.doc.text.toString(), newText);
    const result = Automerge.change(this.doc, (doc: any) => {
      let offset = 0;
      diffs.forEach(diff => {
        if (diff[0] === -1) {
          for (let x = 0; x < diff[1].length; x++) {
            doc.text.deleteAt(offset);
          }
        } else if (diff[0] === 1) {
          for (let x = 0; x < diff[1].length; x++) {
            doc.text.insertAt(offset, diff[1][x]);
            offset++;
          }
        } else {
          offset += diff[1].length;
        }
      });
    });
    const history = Automerge.getChanges(this.doc, result);
    this.doc = result;
    return encode(history);
  }

  applyChange(encodedChange: string) {
    this.doc = Automerge.applyChanges(this.doc, decode(encodedChange));
  }
}
