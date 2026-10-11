import { useState } from "react"
import axios from "axios"
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url||loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/shorten`, { originalUrl: url });
      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);
      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
    <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>
    <div className="flex flex-col items-center gap-3 w-full max-w-3xl">
      <input className="input input-success w-full"
        type="text"
        placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button className="btn btn-primary w-full sm:auto" onClick={handleShorten} disabled={loading}>Shorten URL</button>
    </div>
    {shortUrl && (
      <div className="flex flex-col items-center max-w-3xl w-full">
        <p className="font-medium mb-2">Your short link:</p>
        <a
          href={shortUrl}
          target="_blank"
          className="link link-primary break-all"
        >
          {shortUrl}
        </a>
        <button onClick={handleCopy} className={`btn mt-2 w-full ${copied ? "btn-success" : "btn-secondary"}`}>
          {copied ? "Copied" : "Copy"}
        </button>
        <div className="bg-white p-4 rounded-lg mt-6 shadow">
          <p className="mb-2 text-center font-semibold text-gray-800">Scan QR code:</p>
          <QRCode value={shortUrl} size={200} />
        </div>
        {qrImage && (
          <a href={qrImage} className="btn btn-accent mt-3 w-full" download="qr-code.png">Download QR Code</a>
        )}
      </div>
    )}
  </div>
}

export default App