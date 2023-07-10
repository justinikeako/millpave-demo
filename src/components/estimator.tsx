import { useState } from 'react';
import { PaverDetails, Sku } from '~/types/product';
import { formatPrice } from '~/utils/format';
import { roundTo } from '~/utils/number';
import { roundFractionDigits } from '~/lib/utils';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from './ui/select';
import { Button } from './button';

type PaverEstimatorProps = {
	paverDetails: PaverDetails;
	sku: Sku;
};

type EstimatorUnit = 'SQFT' | 'PCS' | 'PAL';

function PaverEstimator({ paverDetails, sku }: PaverEstimatorProps) {
	const [unit, setUnit] = useState<EstimatorUnit>('SQFT');
	const [value, setValue] = useState('');
	const [rawArea, setRawArea] = useState(0);

	const { pallet, piece, totalArea } = splitArea(rawArea, paverDetails);

	const total = calculateTotal(pallet.area, piece.area, sku);

	return (
		<section
			data-ai-hidden
			className="space-y-4 bg-gray-200 p-6 text-gray-900 lg:px-8"
		>
			<div className="align-center flex justify-between">
				<h2 className="font-display text-lg lg:text-xl">Cost Estimator</h2>

				<Select
					value={unit}
					onValueChange={(newUnit: EstimatorUnit) => {
						setUnit(newUnit);

						const newValue = convert(rawArea, paverDetails).fromSqftTo(newUnit);

						setValue(String(newValue));
						setRawArea(convert(newValue, paverDetails).toSqftFrom(newUnit));
					}}
				>
					<SelectTrigger unstyled>
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="SQFT">By Area</SelectItem>
						<SelectItem value="PCS">By Unit</SelectItem>
						<SelectItem value="PAL">By Pallet</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center space-x-4">
				<Label unit={unit} />

				<input
					inputMode="decimal"
					id="paver-estimator"
					type="number"
					min={0}
					placeholder="Amount"
					className="w-24 rounded-sm border border-gray-400 bg-gray-100 p-4 font-semibold text-gray-900 placeholder:font-normal placeholder:text-gray-500 focus:outline-pink-700"
					value={value}
					onChange={(e) => {
						setValue(e.target.value);

						const parsedValue = parseFloat(e.target.value || '0');
						const newRawArea = convert(parsedValue, paverDetails).toSqftFrom(
							unit
						);

						setRawArea(newRawArea);
					}}
				/>
			</div>

			<p>
				{pallet.count} pallets ({pallet.area} ft²) + {piece.count} pieces (
				{piece.area} ft²) ≈&nbsp;
				<b>
					{totalArea}ft<sup>2</sup>
				</b>
			</p>

			<hr className="border-gray-300" />

			<div className="flex items-end">
				<div className="flex-1 space-y-1">
					<p className="font-display text-xl">{formatPrice(total)}</p>
					<p className="text-sm">Incl. GCT</p>
				</div>

				<Button intent="primary" disabled>
					Add To Quote
				</Button>
			</div>
		</section>
	);
}

function Label({ unit }: { unit: EstimatorUnit }) {
	const labelText: Record<EstimatorUnit, React.ReactNode> = {
		SQFT: (
			<>
				Area (ft<sup>2</sup>)
			</>
		),
		PCS: <>Pieces</>,
		PAL: <>Pallets</>
	};

	return <label htmlFor="paver-estimator">{labelText[unit]}</label>;
}

function convertToSqft(
	value: number,
	fromUnit: EstimatorUnit,
	paverDetails: PaverDetails
) {
	const sqft_per_pallet = paverDetails.sqft_per_pallet,
		pcs_per_sqft = paverDetails.pcs_per_sqft;

	const convertToSqft: Record<EstimatorUnit, (value: number) => number> = {
		SQFT: (squarefeet) => squarefeet,
		PAL: (pallets) => pallets * sqft_per_pallet,
		PCS: (pieces) => pieces / pcs_per_sqft
	};

	return convertToSqft[fromUnit](value);
}

const convertFromSqft = (
	value: number,
	unit: EstimatorUnit,
	paverDetails: PaverDetails
) => {
	const sqft_per_pallet = paverDetails.sqft_per_pallet,
		pcs_per_sqft = paverDetails.pcs_per_sqft;

	const convertFromSqft: Record<EstimatorUnit, (value: number) => number> = {
		SQFT: (sqft) => sqft,
		PAL: (sqft) => roundTo(sqft / sqft_per_pallet, 0.5),
		PCS: (sqft) => roundTo(sqft * pcs_per_sqft, 1)
	};

	return convertFromSqft[unit](value);
};

function convert(value: number, paverDetails: PaverDetails) {
	return {
		toSqftFrom: (unit: EstimatorUnit) =>
			convertToSqft(value, unit, paverDetails),
		fromSqftTo: (unit: EstimatorUnit) =>
			convertFromSqft(value, unit, paverDetails)
	};
}

function splitArea(area: number, paverDetails: PaverDetails) {
	const sqft_per_pallet = paverDetails.sqft_per_pallet,
		pcs_per_sqft = paverDetails.pcs_per_sqft;

	const sqft_per_half_pallet = sqft_per_pallet / 2;

	const palletArea = roundTo(area, sqft_per_half_pallet, 'down');
	const palletCount = Math.floor(palletArea / sqft_per_half_pallet) / 2;
	const pieceArea = roundTo(area - palletArea, 1 / pcs_per_sqft, 'up');
	const pieceCount = Math.round(pieceArea * pcs_per_sqft);

	return {
		pallet: {
			area: roundFractionDigits(palletArea, 2),
			count: palletCount
		},
		piece: {
			area: roundFractionDigits(pieceArea, 2),
			count: pieceCount
		},
		totalArea: roundFractionDigits(
			roundFractionDigits(palletArea, 2) + roundFractionDigits(pieceArea, 2),
			2
		)
	};
}

function calculateTotal(palletArea: number, pieceArea: number, sku: Sku) {
	const factorySubtotal = palletArea * sku.price;
	const showroomSubtotal = pieceArea * (sku.price + 20);

	const GCT = 0.15;

	const subtotal = factorySubtotal + showroomSubtotal;
	const total = subtotal + subtotal * GCT;

	return total;
}

export { PaverEstimator };
