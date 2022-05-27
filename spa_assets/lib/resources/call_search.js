import buildResource from "./build_resource";
import { remote } from "./request_builder";

const CallSearch = buildResource({
  find: (id) => {
    return remote.get(`/call_searches/${id}`);
  },
  create: ({ yourLanguage, language, scheduledAt }, skip_requests) => {
    skip_requests = skip_requests || false;
    return remote.post(`/call_searches`, 
      { skip_requests, call_search: { your_language: yourLanguage, language } }
    );
  }
});

CallSearch.Language = buildResource({
  list: () => {
    return remote.get("/call_searches/languages");
  } 
});

export default CallSearch;