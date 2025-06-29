'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function WalletPage() {
  const [account, setAccount] = useState('');
  const [ensName, setEnsName] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('');
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [signature, setSignature] = useState('');

  const MAINNET_CHAIN_ID = 1;

  // Detect MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskAvailable(true);
    }
  }, []);

  // Format Ethereum address to shortened version
  const shortenAddress = (addr) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    setConnecting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const bal = await provider.getBalance(accounts[0]);
      const net = await provider.getNetwork();

      const ens = await provider.lookupAddress(accounts[0]);

      setAccount(accounts[0]);
      setEnsName(ens || '');
      setBalance(ethers.formatEther(bal));
      setNetwork(`Name: ${net.name}, Chain ID: ${net.chainId}`);
      setWrongNetwork(Number(net.chainId) !== MAINNET_CHAIN_ID);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setConnecting(false);
    }
  };

  const switchToMainnet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const net = await provider.getNetwork();

      if (Number(net.chainId) === MAINNET_CHAIN_ID) {
        console.log('Already on Ethereum Mainnet');
        return;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });

      setTimeout(connectWallet, 300);
    } catch (err) {
      console.error('Failed to switch to Ethereum Mainnet:', err);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = () => {
      console.log('[Chain changed]');
      setTimeout(connectWallet, 300);
    };

    const handleAccountsChanged = () => {
      console.log('[Accounts changed]');
      connectWallet();
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    connectWallet();

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const signMessage = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = 'Verify wallet ownership';
      const sig = await signer.signMessage(message);
      setSignature(sig);
    } catch (err) {
      console.error('Message signing failed:', err);
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: 'Arial', maxWidth: 500, margin: '0 auto' }}>
      <h1>🦊 Web3 Wallet Demo</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={connectWallet} disabled={connecting || !isMetaMaskAvailable}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>{' '}
        <button onClick={switchToMainnet} disabled={!isMetaMaskAvailable}>
          Switch to Mainnet
        </button>
      </div>

      {wrongNetwork && (
        <p style={{ color: 'red', marginTop: 10 }}>
          ❌ Unsupported network. Please switch to Ethereum Mainnet.
        </p>
      )}

      {account && !wrongNetwork && (
        <div style={{ marginTop: 20, lineHeight: '1.6' }}>
          <p><strong>Account:</strong> {ensName || shortenAddress(account)}</p>
          <p><strong>Balance:</strong> {Number(balance).toFixed(4)} ETH</p>
          <p><strong>Network:</strong> {network}</p>

          <button onClick={signMessage} style={{ marginTop: 10 }}>
            Sign Message
          </button>

          {signature && (
            <p style={{ wordBreak: 'break-word' }}><strong>Signature:</strong> {signature}</p>
          )}
        </div>
      )}
    </main>
  );
}
