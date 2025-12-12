import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ArrowRight, Code, Zap, CheckCircle2, ExternalLink, Plus } from "lucide-react";

export default function CompatiblePackages() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Compatible Packages
            </h1>
            <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
              Find which server/client packages support x402Instant for checkout
            </p>
          </div>
        </section>

        {/* Packages Section */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="relative">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle>fastx402</CardTitle>
                    <Badge variant="secondary">Python</Badge>
                  </div>
                  <CardDescription>
                    FastAPI-based package for Python backend servers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>FastAPI decorator for easy endpoint protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Multiple HTTP client wrappers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>EIP-712 signature verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>WAAS provider support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Full x402Instant compatibility</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link
                      href="https://fastx402.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit fastx402.com
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle>fastx402-ts</CardTitle>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                  <CardDescription>
                    Express-based package for Node.js/TypeScript backend servers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Express middleware for payment protection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Fetch and Axios wrappers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Works in Node.js, Edge functions, and browsers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Client SDK for handling 402 challenges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Full x402Instant compatibility</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link
                      href="https://fastx402.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit fastx402.com
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://github.com/cybertheory/fastx402/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your package here
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="border-t bg-muted/50">
          <div className="container px-4 py-24">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Seamless Integration
                </h2>
                <p className="text-lg text-muted-foreground">
                  x402Instant works seamlessly with both fastx402 and fastx402-ts backends
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Connect your frontend to any compatible backend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold">Frontend (x402Instant)</h3>
                        <p className="text-sm text-muted-foreground">
                          Use x402Instant in your browser to detect wallets and sign payments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold">Backend (fastx402 or fastx402-ts)</h3>
                        <p className="text-sm text-muted-foreground">
                          Protect your API endpoints and verify payment signatures
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold">Automatic Flow</h3>
                        <p className="text-sm text-muted-foreground">
                          x402Instant automatically handles 402 challenges and payment signing, while your backend verifies and grants access
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Choose your backend package and start building with x402Instant
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/docs">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link
                  href="https://fastx402.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit fastx402.com
                  <ExternalLink className="ml-2 h-4 w-4" />
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

