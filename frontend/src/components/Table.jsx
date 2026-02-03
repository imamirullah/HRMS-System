export default function Table({ headers, children }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h) => (
            <th key={h} className="p-2 border text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
