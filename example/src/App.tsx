import { useState } from "react";
import { initX402, x402Fetch, detectWallets } from "x402instant";
import type { WalletInfo } from "x402instant";

function App() {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [connected, setConnected] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInit = async () => {
    await initX402({
      autoConnect: true,
      defaultChain: 8453,
      preferredToken: "USDC",
      onWalletConnected: (addr) => {
        console.log("Wallet connected:", addr);
        setConnected(true);
      },
    });

    const detected = await detectWallets();
    setWallets(detected);
  };

  const handlePaidRequest = async () => {
    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await x402Fetch("http://localhost:8000/paid");
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

