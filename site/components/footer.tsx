import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">x402Instant</h3>
            <p className="text-sm text-muted-foreground">
              TypeScript frontend SDK for x402 HTTP-native payments. Browser wallet discovery and instant checkout flows.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/wallet-discovery"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Wallet Discovery
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/instant-checkout"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instant Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/examples"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="https://x402.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  x402 Protocol
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/cybertheory/fastx402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Backend Libraries</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/cybertheory/fastx402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  fastx402 (Python)
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/cybertheory/fastx402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  fastx402-ts (TypeScript)
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} x402Instant. MIT License.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/cybertheory/fastx402"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

