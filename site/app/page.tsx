import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Search, Zap, RefreshCw, Shield, ArrowRight, CheckCircle2, Wallet, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              Frontend SDK for x402 Payments
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              x402Instant
          </h1>
            <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
              Add x402 payments to your frontend with automatic wallet discovery and instant checkout.{" "}
              <Link
                href="/compatible-packages"
                className="font-medium underline hover:text-foreground transition-colors"
              >
                Works with fastx402 and fastx402-ts backends
              </Link>
              .
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/examples">
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Instant Checkout Made Simple
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for seamless wallet integration and payment flows
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Browser Wallet Discovery</CardTitle>
                  <CardDescription>
                    Automatic wallet detection using EIP-6963 standard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Detects MetaMask, Coinbase Wallet, and more</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>EIP-6963 standard support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Multiple wallet providers simultaneously</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Legacy wallet fallback support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Automatic Checkout Flows</CardTitle>
                  <CardDescription>
                    Automatic callbacks trigger instant checkout flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Automatic 402 challenge detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Seamless payment signing flow</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Request retry with payment headers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Zero manual payment handling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>EIP-712 Signing</CardTitle>
                  <CardDescription>
                    Secure structured data signing for payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Type-safe message encoding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Domain separator for security</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Wallet-native signing experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Prevents signature replay attacks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t bg-muted/50">
          <div className="container px-4 py-24">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  How It Works
                </h2>
                <p className="text-lg text-muted-foreground">
                  Automatic wallet discovery and instant checkout in three simple steps
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">1. Wallet Discovery</h3>
                  <p className="text-muted-foreground">
                    Automatically detects available wallets using EIP-6963. Supports MetaMask, Coinbase Wallet, WalletConnect, and any EIP-1193 compatible wallet.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">2. Automatic Callbacks</h3>
                  <p className="text-muted-foreground">
                    When a 402 challenge is detected, automatic callbacks trigger the instant checkout flow. No manual intervention needed.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">3. Instant Checkout</h3>
                  <p className="text-muted-foreground">
                    User signs payment with EIP-712, request automatically retries with payment header, and access is granted seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for Modern Frontends
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for seamless payment integration
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Simple API</h3>
                <p className="text-muted-foreground">
                  Just use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">x402Fetch()</code> instead of <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fetch()</code>. Everything else is automatic.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Automatic Retry</h3>
                <p className="text-muted-foreground">
                  Handles 402 challenges and retries with payment automatically. No manual challenge handling required.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multi-Wallet Support</h3>
                <p className="text-muted-foreground">
                  Works with any EIP-1193 compatible wallet. MetaMask, Coinbase Wallet, WalletConnect, and more.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure by Default</h3>
                <p className="text-muted-foreground">
                  EIP-712 structured data signing prevents signature replay. Nonce-based challenge validation ensures security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="border-t bg-muted/50">
          <div className="container px-4 py-24">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Get Started in Minutes
                </h2>
                <p className="text-lg text-muted-foreground">
                  Three lines of code to enable instant checkout
          </p>
        </div>
              <Card>
                <CardHeader>
                  <CardTitle>Installation & Usage</CardTitle>
                  <CardDescription>
                    Automatic wallet discovery and instant checkout flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                    <code>{`import { initX402, x402Fetch } from "x402instant";

// Initialize with automatic wallet discovery
await initX402({ autoConnect: true });

// Make paid requests - automatic checkout!
const response = await x402Fetch("/api/paid-endpoint");
const data = await response.json();`}</code>
                  </pre>
                  <p className="mt-4 text-sm text-muted-foreground">
                    That's it! Wallet discovery, 402 challenge handling, payment signing, and request retry all happen automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to add instant checkout?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start integrating browser wallet discovery and automatic checkout flows in your frontend today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/cybertheory/fastx402" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </Link>
              </Button>
            </div>
        </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
