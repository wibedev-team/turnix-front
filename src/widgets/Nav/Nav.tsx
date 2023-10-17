'use-client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import React from 'react';
import cls from './Nav.module.css';

export default function Nav() {
	return (
		<nav className={cls.nav}>
			<Link href="/siwe" className={cls.link}>
				SIWE
			</Link>
			<ConnectButton />
		</nav>
	);
}
