import { Injectable, ProviderScope } from "@graphql-modules/di";

@Injectable({ scope: ProviderScope.Session })
class MDXRenderProvider {}

export default MDXRenderProvider;
