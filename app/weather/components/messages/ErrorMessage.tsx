export default function ErrorMessage({ error }: { error: string | null }) {
	return (
		<>
			{error && (
				<div
					className="bg-red-950 border border-red-500 text-red-500 px-4 py-3 rounded relative w-full max-w-3xl mx-auto mb-4"
					role="alert">
					<span className="block sm:inline">{error}</span>
				</div>
			)}
		</>
	);
}
