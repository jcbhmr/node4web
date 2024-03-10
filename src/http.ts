export const METHODS = [
  "ACL",
  "BIND",
  "CHECKOUT",
  "CONNECT",
  "COPY",
  "DELETE",
  "GET",
  "HEAD",
  "LINK",
  "LOCK",
  "M-SEARCH",
  "MERGE",
  "MKACTIVITY",
  "MKCALENDAR",
  "MKCOL",
  "MOVE",
  "NOTIFY",
  "OPTIONS",
  "PATCH",
  "POST",
  "PROPFIND",
  "PROPPATCH",
  "PURGE",
  "PUT",
  "REBIND",
  "REPORT",
  "SEARCH",
  "SOURCE",
  "SUBSCRIBE",
  "TRACE",
  "UNBIND",
  "UNLINK",
  "UNLOCK",
  "UNSUBSCRIBE",
] as const;

export const STATUS_CODES = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  509: "Bandwidth Limit Exceeded",
  510: "Not Extended",
  511: "Network Authentication Required",
} as const;

interface ServerOptions<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse,
> {
  IncomingMessage?: Request | undefined;
  ServerResponse?: Response | undefined;
  requestTimeout?: number | undefined;
  joinDuplicateHeaders?: boolean;
  keepAliveTimeout?: number | undefined;
  connectionsCheckingInterval?: number | undefined;
  highWaterMark?: number | undefined;
  insecureHTTPParser?: boolean | undefined;
  maxHeaderSize?: number | undefined;
  noDelay?: boolean | undefined;
  keepAlive?: boolean | undefined;
  keepAliveInitialDelay?: number | undefined;
  uniqueHeaders?: Array<string | string[]> | undefined;
}

type RequestListener<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse,
> = (
  req: InstanceType<Request>,
  res: InstanceType<Response> & { req: InstanceType<Request> },
) => void;

// @ConstructableWithoutNew
export class Server<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse,
> extends NetServer {
  constructor(requestListener?: RequestListener<Request, Response>);
  constructor(
    options: ServerOptions<Request, Response>,
    requestListener?: RequestListener<Request, Response>,
  );
  constructor() {
    let options: ServerOptions<Request, Response>;
    let requestListener: RequestListener<Request, Response> | undefined;
    if (typeof arguments[0] === "function") {
      options = {};
      requestListener = arguments[0];
    } else {
      options = arguments[0];
      requestListener = arguments[1];
    }

    super();
    if (requestListener) {
      this.on("request", requestListener);
    }
    this.on("connection", connectionListener);
    this.on("listening", setupConnectionsTracking);
  }

  listen() {
    if (
      !globalThis.ServiceWorkerGlobalScope ||
      !(globalThis instanceof ServiceWorkerGlobalScope)
    ) {
      throw new ReferenceError("not in service worker");
    }
    globalThis.addEventListener("fetch", (event: Event & any) => {
      event.respondWith(this.#handleRequest(event.request));
    });
  }

  [captureRejectSymbol](error: unknown, event: string, ...args: any[]) {
    switch (event) {
      case "request": {
        const [req, res] = args as [Request, Response];
        if (!res.headersSent && !res.writableEnded) {
          const names = res.getHeaderNames();
          for (const name of names) {
            res.removeHeader(name);
          }
          res.statusCode = 500;
          res.end(STATUS_CODES[500]);
        } else {
          res.destroy();
        }
      }
      default:
        super[Symbol.for("nodejs.rejection")].apply(this, arguments);
    }
  }

  #handleRequest(request: globalThis.Request): globalThis.Response {}
}
