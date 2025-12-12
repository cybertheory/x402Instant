import { useState, useRef } from "react";
import { initX402, detectWallets, signPaymentChallenge } from "x402instant";
import type { WalletInfo } from "x402instant";
import { X402Client } from "fastx402";
import type { PaymentChallenge, PaymentSignature } from "fastx402";

function App() {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [connected, setConnected] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const clientRef = useRef<X402Client | null>(null);

  const handleInit = async () => {
    await initX402({
      autoConnect: true,
      defaultChain: 8453,
      preferredToken: "USDC",
      onWalletConnected: (addr: string) => {
        console.log("Wallet connected:", addr);
        setConnected(true);
      },
    });

    const detected = await detectWallets();
    setWallets(detected);

    // Initialize X402Client with signPaymentChallenge as the RPC handler
    clientRef.current = new X402Client({
      rpcHandler: async (challenge: PaymentChallenge): Promise<PaymentSignature | null> => {
        return await signPaymentChallenge(challenge);
      },
    });
  };

  const handlePaidRequest = async () => {
    if (!clientRef.current) {
      setResponse({ error: "Client not initialized. Please click 'Initialize x402' first." });
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await clientRef.current.request("http://localhost:8001/paid");
      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>x402instant Example</h1>

      <div style={{ marginBottom: "2rem" }}>
        <button onClick={handleInit}>Initialize x402</button>
        {wallets.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Detected Wallets:</h3>
            <ul>
              {wallets.map((wallet) => (
                <li key={wallet.id}>
                  {wallet.name} {connected && "✓"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button onClick={handlePaidRequest} disabled={loading}>
          {loading ? "Processing..." : "Make Paid Request"}
        </button>
      </div>

      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

