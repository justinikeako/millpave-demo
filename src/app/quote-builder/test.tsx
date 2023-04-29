'use client';
import { useState } from 'react';

export function Counter() {
	const [count, setCount] = useState(0);

	return (
		<div className="flex">
			<button onClick={() => setCount(count - 1)}>Down</button>
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>Up</button>
		</div>
	);
}
