import React from 'react';

const dossiers = [
    { id: 1, numero: '2023/4567', partie: 'Ahmed Ben Youssef', status: 'En cours' },
    { id: 2, numero: '2024/1023', partie: 'Société Al Amal', status: 'Jugé' },
    { id: 3, numero: '2022/8741', partie: 'Fatima El Amrani', status: 'Radié' },
];

const StatutBadge = ({ status }) => {
    const color = {
        'En cours': 'bg-yellow-200 text-yellow-800',
        'Jugé': 'bg-green-200 text-green-800',
        'Radié': 'bg-red-200 text-red-800',
    }[status] || 'bg-gray-200 text-gray-800';

    return <span className={`px-2 py-1 rounded text-sm font-semibold ${color}`}>{status}</span>;
};

const ListeDossiers = () => {
    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Liste des dossiers judiciaires</h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">N° Dossier</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Partie</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {dossiers.map((dossier) => (
                        <tr key={dossier.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{dossier.numero}</td>
                            <td className="border border-gray-300 px-4 py-2">{dossier.partie}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <StatutBadge status={dossier.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListeDossiers;
