import { Injectable, ProviderScope } from "@graphql-modules/di";
import { AutomergeText } from "shared";
import { PubSub } from "apollo-server";

const pubsub = new PubSub();

interface Store {
  [key: string]: AutomergeText;
}

@Injectable({ scope: ProviderScope.Application })
class AutoMergeProvider {
  store: Store = {};

  getContents(id: string) {
    if (!this.store[id]) {
      this.store[id] = new AutomergeText();
    }
    return this.store[id];
  }

  applyChange({ id, change }: { id: string; change: string }) {
    if (!this.store[id]) {
      return false;
    }
    this.store[id].applyChange(change);
    pubsub.publish(id, change);
    return true;
  }

  subscribe(id: string) {
    return pubsub.asyncIterator([id]);
  }
}

export default AutoMergeProvider;
