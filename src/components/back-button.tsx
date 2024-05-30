'use client';

import { useRouter } from 'next/navigation';
import { Button } from '~/components/button';

export function BackButton() {
	const router = useRouter();

	return (
		<Button intent="primary" onClick={() => router.back()}>
			Return to Previous Page
		</Button>
	);
}
