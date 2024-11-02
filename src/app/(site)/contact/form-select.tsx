'use client';

import { useRouter } from 'next/navigation';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../../components/ui/select';

type FormType = 'general' | 'media' | 'sample';

export function FormSelect({ value }: { value: FormType }) {
	const router = useRouter();

	return (
		<Select
			value={value}
			onValueChange={(newValue) =>
				router.replace(`/contact?form=${newValue}`, { scroll: false })
			}
		>
			<SelectTrigger id="nature" className="w-full">
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="general">General inquiry</SelectItem>
				<SelectItem value="media">I am with the media</SelectItem>
				<SelectItem value="samples">I would like to request samples</SelectItem>
			</SelectContent>
		</Select>
	);
}
