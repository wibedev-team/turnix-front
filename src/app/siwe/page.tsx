'use client';

import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useNetwork,
	useSignMessage,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import cls from './styles.module.css';

function Siwe() {
	const { signMessageAsync } = useSignMessage();
	const { chain } = useNetwork();
	const { address, isConnected } = useAccount();
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});
	const { data: session } = useSession();
	const { disconnect } = useDisconnect();

	const handleLogin = useCallback(async () => {
		try {
			const callbackUrl = '/protected';
			const message = new SiweMessage({
				domain: window.location.host,
				address,
				statement: 'Sign in with Ethereum to the app.',
				uri: window.location.origin,
				version: '1',
				chainId: chain?.id,
				nonce: await getCsrfToken(),
			});
			const signature = await signMessageAsync({
				message: message.prepareMessage(),
			});
			signIn('credentials', {
				message: JSON.stringify(message),
				redirect: false,
				signature,
				callbackUrl,
			});
		} catch (error) {
			window.alert(error);
		}
	}, [address, chain?.id, signMessageAsync]);

	useEffect(() => {
		console.log(isConnected);
		if (isConnected && !session) {
			handleLogin();
		}
	}, [handleLogin, isConnected, session]);

	return (
		<div className={cls.container}>
			{!session && <span>You are not signed in</span>}
			{session?.user && (
				<>
					<span>
						<small>Signed in as</small>
						<br />
						<strong>{session.user.email ?? session.user.name}</strong>
					</span>
					<Link
						href="/api/auth/signout"
						className={cls.link}
						onClick={(e) => {
							e.preventDefault();
							disconnect();
							signOut();
						}}
					>
						Sign out
					</Link>
				</>
			)}
			<Link href="/" className={cls.link}>
				Home
			</Link>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					if (!isConnected) {
						connect();
					} else {
						handleLogin();
					}
				}}
				className={cls.link}
			>
				Sign-in
			</button>
		</div>
	);
}

export default Siwe;
