import { Sku } from '@prisma/client';
import { round } from 'mathjs';
import { useState } from 'react';
import { PaverDetails } from '../types/product';
import { formatPrice } from '../utils/format';
import { roundTo } from '../utils/number';
import { extractDetail } from '../utils/product';
import * as Select from './select';

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
		<section data-ai-hidden className="bg-gray-900 text-white">
			<div className="align-center flex justify-between p-8">
				<h2 className="text-lg">Cost Estimator</h2>

				<Select.Root
					value={unit}
					onValueChange={(newUnit: EstimatorUnit) => {
						setUnit(newUnit);

						const newValue = convert(rawArea, paverDetails).fromSqftTo(newUnit);

						setValue(String(newValue));
					}}
				>
					<Select.Trigger basic />

					<Select.Content>
						<Select.ScrollUpButton />
						<Select.Viewport>
							<Select.Item value="SQFT">By Area</Select.Item>
							<Select.Item value="PCS">By Unit</Select.Item>
							<Select.Item value="PAL">By Pallet</Select.Item>
						</Select.Viewport>
						<Select.ScrollDownButton />
					</Select.Content>
				</Select.Root>
			</div>
			<div className="space-y-8 px-8 pb-8">
				<div className="flex items-center space-x-4">
					<Label unit={unit} />

					<input
						inputMode="decimal"
						id="paver-estimator"
						type="number"
						min={0}
						placeholder="Area"
						className="w-32 rounded-sm p-4 font-semibold text-black outline-none placeholder:font-normal placeholder:text-gray-500"
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
					{pallet.count} pallets ({pallet.area}ft²) & {piece.count} pieces (
					{piece.area}ft²) ≈&nbsp;
					<b>
						{totalArea}ft<sup>2</sup>
					</b>
				</p>
				<hr />

				<div>
					<p className="text-lg">{formatPrice(total)}</p>
					<p>Incl. GCT</p>
				</div>
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
	const sqft_per_pallet = extractDetail(paverDetails, 'sqft_per_pallet'),
		pcs_per_sqft = extractDetail(paverDetails, 'pcs_per_sqft');

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
	const sqft_per_pallet = extractDetail(paverDetails, 'sqft_per_pallet'),
		pcs_per_sqft = extractDetail(paverDetails, 'pcs_per_sqft');

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
	const sqft_per_pallet = extractDetail(paverDetails, 'sqft_per_pallet'),
		pcs_per_sqft = extractDetail(paverDetails, 'pcs_per_sqft');

	const sqft_per_half_pallet = sqft_per_pallet / 2;

	const palletArea = roundTo(area, sqft_per_half_pallet, 'down');
	const palletCount = Math.floor(palletArea / sqft_per_half_pallet) / 2;
	const pieceArea = roundTo(area - palletArea, 1 / pcs_per_sqft, 'up');
	const pieceCount = Math.round(pieceArea * pcs_per_sqft);

	return {
		pallet: {
			area: round(palletArea, 2),
			count: palletCount
		},
		piece: {
			area: round(pieceArea, 2),
			count: pieceCount
		},
		totalArea: round(round(palletArea, 2) + round(pieceArea, 2), 2)
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
