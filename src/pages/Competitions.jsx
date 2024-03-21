import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { useCompetitions } from "../queries/competitions";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const Competitions = () => {
    const { data, isLoading } = useCompetitions();
    const { t } = useTranslation('global');


    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">{t("competitions")}</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("name-tournament")}</th>
                            {/* Ocultar la columna de la fecha en dispositivos móviles */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t("date-tournament")}</th>
                            {/* Ocultar la columna del delegado en dispositivos móviles */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t("delegate")}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((competition) => (
                            <tr key={competition.id} className="hover:bg-gray-300 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link state={{ competition_id: competition.id }} to={`/competitions/${competition.id}`} className="text-blue-500 hover:text-blue-700">{competition.name}</Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">{competition.start_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">{competition?.delegates[0]?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Competitions;
