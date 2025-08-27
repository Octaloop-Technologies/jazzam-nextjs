import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Simple console blocker for production */}
        {process.env.NODE_ENV === "production" && (
          <script
            id="console-blocker"
            nonce="console-blocker"
            dangerouslySetInnerHTML={{
              __html: `
                // Simple console blocking function
                (function() {
                  try {
                    // Save original console methods
                    const originalConsole = {
                      log: console.log,
                      info: console.info,
                      warn: console.warn,
                      debug: console.debug,
                      error: console.error,
                      clear: console.clear
                    };

                    // Block regular console methods
                    console.log = function(){};
                    console.info = function(){};
                    console.warn = function(){};
                    console.debug = function(){};
                    
                    // Keep error logs for critical issues
                    // console.error = function(){};
                    
                    // Protect console from being overwritten
                    Object.defineProperty(window, 'console', {
                      get: function() {
                        return {
                          log: function(){},
                          info: function(){},
                          warn: function(){},
                          debug: function(){},
                          error: originalConsole.error,
                          clear: originalConsole.clear
                        };
                      },
                      set: function() {},
                      configurable: false
                    });
                    
                    // Clear any existing console output
                    originalConsole.clear();
                  } catch (e) {
                    // Silent fail
                  }
                })();
              `,
            }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
