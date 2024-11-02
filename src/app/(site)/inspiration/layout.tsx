type Props = React.PropsWithChildren<{
	modal: React.ReactNode;
}>;

export default function Layout({ children, modal }: Props) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}
