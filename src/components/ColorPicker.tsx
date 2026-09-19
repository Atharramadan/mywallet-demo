const PALETTE = [
  '#7C6FE0', '#B4A7F5', '#7FB8E8', '#6ED9C4', '#FFB088',
  '#FF8DA1', '#FFD166', '#8ED081', '#A8A8B3', '#5C9EAD',
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={color}
          className="h-9 w-9 rounded-full transition-transform"
          style={{
            backgroundColor: color,
            transform: value === color ? 'scale(1.15)' : 'scale(1)',
            boxShadow: value === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}
